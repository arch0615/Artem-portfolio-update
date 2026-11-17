import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonStyles, type ButtonStyleProps } from './button-styles'

type ButtonProps = ButtonStyleProps & ButtonHTMLAttributes<HTMLButtonElement>

export function Button({ variant, size, className, type = 'button', ...props }: ButtonProps) {
  return <button type={type} className={buttonStyles({ variant, size, className })} {...props} />
}

type ButtonLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    /** Internal route (client-side navigation), e.g. `/#contact` or `/projects/radar-app`. */
    to?: string
    /** External URL or `mailto:` link. Opens external URLs in a new tab. */
    href?: string
    children: ReactNode
  }

export function ButtonLink({ to, href, variant, size, className, children, ...props }: ButtonLinkProps) {
  const classes = buttonStyles({ variant, size, className })
  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    )
  }
  const external = href?.startsWith('http')
  return (
    <a
      href={href}
      className={classes}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      {...props}
    >
      {children}
    </a>
  )
}
