'use client'

import { motion } from 'framer-motion'
import { CheckCircle } from 'lucide-react'

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  points: number
  popular?: boolean
  badge?: string
  cta: string
  onClick?: () => void
}

export function PricingCard({
  name,
  price,
  description,
  features,
  points,
  popular = false,
  badge,
  cta,
  onClick
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative h-full"
    >
      {popular && badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-primary text-white text-sm font-semibold px-4 py-1 rounded-full">
            {badge}
          </div>
        </div>
      )}

      <div className={`relative h-full ${popular ? 'pt-6' : ''}`}>
        {popular && (
          <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent rounded-2xl" />
        )}

        <div className={`
          relative h-full p-8 rounded-2xl transition-all duration-300
          ${popular
            ? 'backdrop-blur-sm bg-card/80 border-2 border-primary/50 shadow-2xl shadow-primary/20 hover:shadow-primary/30'
            : 'bg-card border border-border hover:border-primary/30 hover:shadow-xl'
          }
          hover:scale-[1.02]
        `}>
          <h3 className="text-2xl font-bold mb-2">{name}</h3>
          <div className="text-5xl font-bold mb-3">{price}</div>
          <p className="text-muted text-sm mb-6">{description}</p>

          {/* Visual scope indicator */}
          <div className="flex gap-1 mb-6">
            {[...Array(points)].map((_, i) => (
              <div
                key={i}
                className="h-1 flex-1 bg-primary rounded-full"
                style={{ opacity: 1 - (i * (0.7 / points)) }}
              />
            ))}
          </div>

          <ul className="space-y-3 mb-8">
            {features.map((feature, i) => (
              <li key={i} className="flex items-start gap-3 text-sm">
                <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={onClick}
            className={`
              w-full py-3 px-6 rounded-lg font-semibold transition-all
              ${popular
                ? 'bg-primary hover:bg-primary-light text-white'
                : 'bg-card border border-border hover:border-primary hover:bg-primary/10'
              }
            `}
          >
            {cta}
          </button>
        </div>
      </div>
    </motion.div>
  )
}
