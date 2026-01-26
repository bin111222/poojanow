'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function grantAdminAccess(formData: FormData) {
  console.log('🔵 [GRANT ADMIN] Action called')
  
  const supabase = createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  console.log('🔵 [GRANT ADMIN] User check:', { 
    hasUser: !!user, 
    userEmail: user?.email, 
    userId: user?.id,
    userError: userError?.message 
  })
  
  if (!user) {
    console.error('❌ [GRANT ADMIN] No user found')
    return { error: 'You must be logged in' }
  }

  const email = formData.get('email') as string
  console.log('🔵 [GRANT ADMIN] Email from form:', email)
  
  if (!email) {
    console.error('❌ [GRANT ADMIN] No email provided')
    return { error: 'Email is required' }
  }

  // First, check if profile exists
  console.log('🔵 [GRANT ADMIN] Checking for existing profile...')
  let { data: targetProfile, error: fetchError } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('email', email)
    .single()

  console.log('🔵 [GRANT ADMIN] Profile fetch result:', { 
    hasProfile: !!targetProfile, 
    profileId: targetProfile?.id, 
    currentRole: targetProfile?.role,
    fetchError: fetchError?.message,
    fetchErrorCode: fetchError?.code,
    fetchErrorDetails: fetchError 
  })

  // If profile doesn't exist, use the current user's ID if email matches
  if (fetchError || !targetProfile) {
    console.log('🔵 [GRANT ADMIN] Profile not found, checking if email matches current user...')
    if (email === user.email) {
      console.log('🔵 [GRANT ADMIN] Email matches current user, creating profile...')
      // Create profile for current user
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: email,
          full_name: email.split('@')[0],
          role: 'admin',
          is_active: true
        })
        .select('id, role')
        .single()

      console.log('🔵 [GRANT ADMIN] Profile creation result:', { 
        hasProfile: !!newProfile, 
        profileId: newProfile?.id,
        createError: createError?.message,
        createErrorCode: createError?.code,
        createErrorDetails: createError 
      })

      if (createError || !newProfile) {
        console.error('❌ [GRANT ADMIN] Failed to create profile:', createError)
        return { 
          error: `Failed to create profile: ${createError?.message || 'Unknown error'}. 
          
You may need to:
1. Run the RLS policy migration (grant_admin_policy.sql)
2. Or manually create your profile in the database

Error: ${createError?.message}
Error Code: ${createError?.code}
Full Error: ${JSON.stringify(createError)}` 
        }
      }

      targetProfile = newProfile
      console.log('✅ [GRANT ADMIN] Profile created successfully')
    } else {
      console.error('❌ [GRANT ADMIN] Email mismatch:', { formEmail: email, userEmail: user.email })
      return { 
        error: `Profile not found for email: ${email}. 
        
If this is your email, make sure you're logged in with this account.
If the profile doesn't exist, you may need to create it manually in Supabase.` 
      }
    }
  }

  // If updating someone else's profile, check if current user is admin
  // If updating own profile, allow it (for self-promotion in dev)
  console.log('🔵 [GRANT ADMIN] Checking permissions...', { 
    targetProfileId: targetProfile.id, 
    currentUserId: user.id,
    isOwnProfile: targetProfile.id === user.id 
  })
  
  if (targetProfile.id !== user.id) {
    console.log('🔵 [GRANT ADMIN] Updating someone else, checking if current user is admin...')
    const { data: currentProfile, error: currentProfileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
    
    console.log('🔵 [GRANT ADMIN] Current user profile:', { 
      hasProfile: !!currentProfile, 
      role: currentProfile?.role,
      error: currentProfileError?.message 
    })
    
    if (currentProfile?.role !== 'admin') {
      console.error('❌ [GRANT ADMIN] Current user is not admin')
      return { error: 'You can only grant admin access to your own account, or you must be an admin to grant access to others.' }
    }
  }

  // Update the profile to grant admin access
  console.log('🔵 [GRANT ADMIN] Attempting to update profile...', { 
    profileId: targetProfile.id,
    currentRole: targetProfile.role 
  })
  
  const { data: updateData, error: updateError } = await supabase
    .from('profiles')
    .update({ 
      role: 'admin',
      is_active: true
    })
    .eq('id', targetProfile.id)
    .select()

  console.log('🔵 [GRANT ADMIN] Update result:', { 
    hasData: !!updateData,
    updatedRows: updateData?.length,
    updateError: updateError?.message,
    updateErrorCode: updateError?.code,
    updateErrorDetails: updateError,
    updateErrorHint: updateError?.hint
  })

  if (updateError) {
    console.error('❌ [GRANT ADMIN] Update failed:', updateError)
    return { 
      error: `Failed to update profile: ${updateError.message}. 
      
Common causes:
1. RLS policy not set up - Run this SQL in Supabase:
   CREATE POLICY "Users can update own profile"
   ON profiles FOR UPDATE TO authenticated
   USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

2. Profile doesn't exist - The system tried to create it but failed.

Error details: ${updateError.message}
Error Code: ${updateError.code}
Error Hint: ${updateError.hint || 'None'}
Full Error: ${JSON.stringify(updateError)}` 
    }
  }

  console.log('✅ [GRANT ADMIN] Success! Revalidating paths...')
  revalidatePath('/admin')
  revalidatePath('/admin/grant-access')
  
  console.log('✅ [GRANT ADMIN] Complete!')
  return { success: true, message: `Admin access granted to ${email}. Please refresh the page.` }
}

