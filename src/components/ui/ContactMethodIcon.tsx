import { FileText, Globe, Mail, MessagesSquare, Phone } from 'lucide-react'
import type { ContactMethodKey } from '@/types'
import { BrandIcon, LinkedInIcon } from './BrandIcon'

/** Icon for a contact method (decorative — always paired with a visible label). */
export function ContactMethodIcon({ method, className }: { method: ContactMethodKey | 'inquiry'; className?: string }) {
  switch (method) {
    case 'github':
      return <BrandIcon name="github" className={className} />
    case 'whatsapp':
      return <BrandIcon name="whatsapp" className={className} />
    case 'linkedin':
      return <LinkedInIcon className={className} />
    case 'email':
      return <Mail aria-hidden className={className} strokeWidth={1.75} />
    case 'phone':
      return <Phone aria-hidden className={className} strokeWidth={1.75} />
    case 'website':
      return <Globe aria-hidden className={className} strokeWidth={1.75} />
    case 'platform':
      return <MessagesSquare aria-hidden className={className} strokeWidth={1.75} />
    case 'inquiry':
      return <FileText aria-hidden className={className} strokeWidth={1.75} />
  }
}
