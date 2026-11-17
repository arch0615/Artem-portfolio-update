import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonStyleProps {
  variant?: ButtonVariant
  size?: ButtonSize
  className?: string
}

export function buttonStyles({ variant = 'primary', size = 'md', className }: ButtonStyleProps = {}): string {
  return cn(
    'group/btn relative inline-flex shrink-0 select-none items-center justify-center gap-2 whitespace-nowrap rounded-full font-medium',
    'transition-[background-color,border-color,color,box-shadow,transform] duration-200 ease-out active:scale-[0.97]',
    'disabled:pointer-events-none disabled:opacity-60',
    size === 'sm' && 'h-9 px-4 text-sm',
    size === 'md' && 'h-11 px-5 text-sm',
    size === 'lg' && 'h-12 px-6 text-[0.95rem]',
    variant === 'primary' &&
      'bg-fg text-canvas shadow-[0_0_0_1px_rgb(255_255_255/0.12),0_10px_30px_-10px_rgb(129_140_248/0.55)] hover:bg-white hover:shadow-[0_0_0_1px_rgb(255_255_255/0.2),0_14px_36px_-10px_rgb(129_140_248/0.75)]',
    variant === 'secondary' &&
      'border border-line-strong bg-white/[0.03] text-fg hover:border-white/25 hover:bg-white/[0.07]',
    variant === 'ghost' && 'text-fg-muted hover:text-fg',
    className,
  )
}
