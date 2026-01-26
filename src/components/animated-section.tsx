"use client"

import { useEffect, useRef, ReactNode, useState } from "react"

interface AnimatedSectionProps {
  children: ReactNode
  className?: string
  stagger?: boolean
  staggerDelay?: number
}

export function AnimatedSection({ 
  children, 
  className = "",
  stagger = false,
  staggerDelay = 100
}: AnimatedSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true)
            observer.unobserve(entry.target)
          }
        })
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -100px 0px"
      }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  if (stagger && isVisible) {
    // For stagger, wrap children and apply animations
    const childrenArray = Array.isArray(children) ? children : [children]
    return (
      <div
        ref={ref}
        className={`${className} ${isVisible ? "opacity-100" : "opacity-0"} transition-opacity duration-1000`}
      >
        {childrenArray.map((child, index) => (
          <div
            key={index}
            className="opacity-0 animate-fade-in-up"
            style={{ 
              animationDelay: `${index * staggerDelay}ms`,
              animationFillMode: 'forwards'
            }}
          >
            {child}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div
      ref={ref}
      className={`${className} ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-1000 ease-out`}
    >
      {children}
    </div>
  )
}

