import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2 py-1 text-xs font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'border-border-muted bg-muted text-foreground',
        success: 'border-success/25 bg-success/10 text-success',
        destructive: 'border-destructive/25 bg-destructive/10 text-destructive',
        warning: 'border-warning/25 bg-warning/10 text-warning',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
)

type BadgeProps = ComponentProps<'span'> &
  VariantProps<typeof badgeVariants> & {
    tone?: 'neutral' | 'good' | 'bad'
  }

const toneToVariant = {
  neutral: 'default',
  good: 'success',
  bad: 'destructive',
} as const

export function Badge({ className, variant, tone, ...props }: BadgeProps) {
  return (
    <span
      className={cn(badgeVariants({ variant: variant ?? (tone ? toneToVariant[tone] : undefined) }), className)}
      {...props}
    />
  )
}
