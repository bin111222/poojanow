import { Star, Quote } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"

const testimonials = [
  {
    name: "Rajesh Kumar",
    location: "Bangalore",
    text: "I booked a Rudrabhishek pooja at Kashi Vishwanath through PoojaNow. The experience was divine. The video quality was excellent and the pandit ji was very knowledgeable.",
    rating: 5,
    avatar: "RK"
  },
  {
    name: "Priya Sharma",
    location: "USA",
    text: "Living abroad, I missed visiting temples on special occasions. PoojaNow made it possible to offer prayers at Somnath on my birthday. Truly grateful.",
    rating: 5,
    avatar: "PS"
  },
  {
    name: "Amit Patel",
    location: "Mumbai",
    text: "Very professional service. The booking process was smooth and I received the prasad within 3 days. Highly recommended for busy professionals.",
    rating: 4,
    avatar: "AP"
  }
]

export function TestimonialsSection() {
  return (
    <section className="py-24 bg-stone-50 overflow-hidden">
      <div className="container px-4 mx-auto">
        <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by 10,000+ Devotees</h2>
            <p className="text-stone-600 max-w-2xl mx-auto">
                Hear from our community about their spiritual journeys with PoojaNow.
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
                <Card key={i} className="bg-white border-stone-100 shadow-sm hover:shadow-md transition-all">
                    <CardContent className="p-8">
                        <div className="flex gap-1 mb-6">
                            {[...Array(t.rating)].map((_, i) => (
                                <Star key={i} className="h-4 w-4 text-orange-500 fill-orange-500" />
                            ))}
                        </div>
                        <Quote className="h-8 w-8 text-stone-200 mb-4" />
                        <p className="text-stone-700 mb-6 leading-relaxed">
                            "{t.text}"
                        </p>
                        <div className="flex items-center gap-4">
                            <Avatar className="h-10 w-10 border border-stone-200 bg-orange-50">
                                <AvatarFallback className="text-orange-700 font-medium">{t.avatar}</AvatarFallback>
                            </Avatar>
                            <div>
                                <p className="font-bold text-sm">{t.name}</p>
                                <p className="text-xs text-stone-500">{t.location}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
      </div>
    </section>
  )
}

