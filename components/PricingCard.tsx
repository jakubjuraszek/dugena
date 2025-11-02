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
  disabled?: boolean
  comingSoonText?: string
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
  onClick,
  disabled = false,
  comingSoonText
}: PricingCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: disabled ? 0.7 : 1, y: 0 }}
      viewport={{ once: true }}
      className="relative h-full"
      style={{ opacity: disabled ? 0.7 : 1 }}
    >
      {/* Popular badge */}
      {popular && badge && !disabled && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-primary text-white text-sm font-bold px-4 py-1 rounded">
            {badge}
          </div>
        </div>
      )}

      {/* In Development badge */}
      {disabled && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className="bg-muted text-muted-foreground text-xs font-bold px-3 py-1 rounded border border-border">
            IN DEVELOPMENT
          </div>
        </div>
      )}

      <div className={`relative h-full ${popular ? 'pt-6' : ''}`}>
        <div className={`
          relative h-full p-8 rounded transition-all duration-300 flex flex-col
          ${popular
            ? 'bg-gradient-to-b from-[#2a2a2a] to-[#222222] border-2 border-primary shadow-2xl shadow-orange-500/20 hover:shadow-orange-500/30 hover:scale-[1.02]'
            : 'bg-gradient-to-b from-[#222222] to-[#1a1a1a] border border hover:border-primary/30 hover:shadow-xl shadow-lg hover:scale-[1.01]'
          }
        `}>
          <div>
            <h3 className="text-3xl font-bold mb-2 tracking-tight text-white">{name}</h3>
            <div className="text-5xl font-bold mb-3 tracking-tight text-white">{price}</div>
            <p className="text-white text-sm font-medium mb-6">{description}</p>

            {/* Visual scope indicator - STANDARDIZED */}
            <div className="flex gap-1 mb-6 h-2">
              {[...Array(points)].map((_, i) => (
                <div
                  key={i}
                  className="flex-1 bg-primary rounded-full"
                  style={{
                    opacity: 1 - (i * (0.3 / points))
                  }}
                />
              ))}
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-white">
                  <CheckCircle className="w-5 h-5 text-accent-success flex-shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-auto">
            <button
              onClick={disabled ? undefined : onClick}
              disabled={disabled}
              className={`
                w-full py-3 px-6 rounded-md font-bold transition-all
                ${disabled
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border'
                  : popular
                    ? 'bg-primary hover:bg-primary-light text-white shadow-sm hover:shadow-md hover:scale-[1.02]'
                    : 'bg-card border border-border hover:border-primary hover:bg-primary/10'
                }
              `}
            >
              {disabled ? 'Coming Soon' : cta}
            </button>
            {disabled && comingSoonText && (
              <p className="text-xs text-muted-foreground text-center mt-2">
                {comingSoonText}
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
