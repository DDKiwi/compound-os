import type { ComponentProps, ElementType, ReactNode } from 'react'
import { cn } from '../../lib/utils'

type CardProps = ComponentProps<'div'> & {
  as?: ElementType
}

function Card({ as: Comp = 'div', className, ...props }: CardProps) {
  return (
    <Comp
      className={cn('rounded-lg border border-border bg-card text-card-foreground shadow-[var(--shadow-subtle)]', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('mb-4 flex items-center justify-between gap-3', className)} {...props} />
}

function CardTitle({ className, ...props }: ComponentProps<'h2'>) {
  return <h2 className={cn('text-sm font-semibold text-foreground', className)} {...props} />
}

function CardAction({ className, ...props }: ComponentProps<'span'>) {
  return <span className={cn('text-xs text-muted-foreground', className)} {...props} />
}

function CardContent({ className, ...props }: ComponentProps<'div'>) {
  return <div className={cn('', className)} {...props} />
}

export function SectionCard({
  title,
  action,
  children,
}: {
  title: string
  action?: string
  children: ReactNode
}) {
  return (
    <Card as="section" className="p-4 sm:p-5">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {action && <CardAction>{action}</CardAction>}
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export { Card, CardAction, CardContent, CardHeader, CardTitle }
