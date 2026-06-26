import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import type { ComponentProps } from 'react'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        ghost: 'text-zinc-400 hover:bg-primary/10 hover:text-zinc-100',
        outline: 'border border-white/10 bg-transparent text-zinc-400 hover:border-primary/40 hover:bg-primary/10 hover:text-zinc-100',
        secondary: 'border border-white/10 bg-card text-zinc-300 hover:border-primary/30 hover:bg-primary/10',
      },
      size: {
        default: 'h-10 px-3 py-2',
        sm: 'h-9 px-3',
        icon: 'h-9 w-9',
        nav: 'h-auto w-full justify-start px-3 py-2.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }

function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : 'button'

  return <Comp className={cn(buttonVariants({ variant, size }), className)} {...props} />
}

export { Button }
