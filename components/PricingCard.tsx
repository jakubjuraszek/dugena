'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, Check, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useParams } from 'next/navigation'

interface PricingCardProps {
  name: string
  price: string
  description: string
  features: string[]
  points: number
  popular?: boolean
  badge?: string
  cta: string
  onClick?: (url: string) => void
  disabled?: boolean
  comingSoonText?: string
  tier?: 'quick' | 'professional' | 'premium'
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
  comingSoonText,
  tier
}: PricingCardProps) {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string

  // URL input state
  const [url, setUrl] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [showError, setShowError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const validateUrl = (value: string) => {
    const urlRegex = /^https?:\/\/.+/
    return urlRegex.test(value)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setUrl(value)
    setIsValid(validateUrl(value))
    setShowError(false) // Hide error when user types
  }

  const handleClick = async () => {
    if (disabled || isLoading) return

    // If tier is set and onClick is provided, validate and pass URL
    if (tier && onClick) {
      if (!url || !isValid) {
        setShowError(true)
        return
      }

      // Set loading state
      setIsLoading(true)

      try {
        await onClick(url)
      } catch (error) {
        console.error('Checkout error:', error)
      } finally {
        // Reset loading after 2 seconds (Paddle checkout should be open by then)
        setTimeout(() => {
          setIsLoading(false)
        }, 2000)
      }
    } else if (!onClick && !disabled) {
      router.push(`/${locale}/audit`)
    }
  }

  return (
    <motion.div
      initial={false}
      animate={{ opacity: disabled ? 0.7 : 1 }}
      className="relative h-full"
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
            {/* Inline URL Input - Premium Design */}
            {!disabled && tier && (
              <div className="mb-4">
                <div className="relative">
                  <input
                    type="url"
                    value={url}
                    onChange={handleUrlChange}
                    placeholder="https://yoursite.com"
                    className={`
                      w-full px-6 py-4
                      bg-card
                      text-white text-base font-medium
                      border-2 rounded-md
                      transition-all duration-200
                      focus:outline-none focus:ring-4 focus:ring-primary/20
                      placeholder:text-muted-foreground
                      ${showError
                        ? 'border-destructive shadow-[0_0_0_3px_rgba(239,68,68,0.1)] animate-shake'
                        : isValid
                          ? 'border-accent-success'
                          : 'border-border hover:border-primary/50'
                      }
                      ${isValid ? 'pr-14' : ''}
                      focus:border-primary
                      shadow-sm hover:shadow-md
                    `}
                  />
                  {isValid && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                      <CheckCircle className="w-6 h-6 text-accent-success" />
                    </div>
                  )}
                </div>
                {showError && (
                  <p className="text-xs text-destructive mt-2 ml-1 font-medium animate-in fade-in slide-in-from-top-1 duration-200">
                    Please enter a valid URL (must start with http:// or https://)
                  </p>
                )}
              </div>
            )}

            <button
              onClick={handleClick}
              disabled={disabled || isLoading}
              className={`
                w-full py-4 px-6 rounded-md font-bold transition-all duration-200
                flex items-center justify-center gap-2
                ${disabled || isLoading
                  ? 'bg-muted text-muted-foreground cursor-not-allowed border border-border opacity-50'
                  : popular
                    ? 'bg-primary hover:bg-primary-light text-white shadow-lg hover:shadow-xl shadow-primary/20 hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary/20'
                    : 'bg-card border-2 border-border hover:border-primary hover:bg-primary/10 text-white shadow-sm hover:shadow-md hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-primary/20'
                }
              `}
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {disabled ? 'Coming Soon' : isLoading ? 'Opening Checkout...' : cta}
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
