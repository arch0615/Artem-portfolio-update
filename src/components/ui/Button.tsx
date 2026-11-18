import type { AnchorHTMLAttributes, ReactNode } from 'react'
import { Link } from 'react-router'
import { buttonStyles, type ButtonStyleProps } from './button-styles'

type ButtonLinkProps = ButtonStyleProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
    /** Internal route (client-side navigation), e.g. `/#projects` or `/projects/radar-app`. */
    to: string
    children: ReactNode
  }

/** A link styled as a button. Internal routes only: the site links to nothing off-site from buttons. */
export function ButtonLink({ to, variant, size, className, children, ...props }: ButtonLinkProps) {
  return (
    <Link to={to} className={buttonStyles({ variant, size, className })} {...props}>
      {children}
    </Link>
  )
}
