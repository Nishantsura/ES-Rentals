import { Home, User, Car, SprayCan, HelpCircle, MessageSquare } from 'lucide-react'
import { NavBar } from "@/components/ui/tubelight-navbar"

export function NavBarDemo() {
  const navItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Browse Cars', url: '/cars', icon: Car },
    { name: 'Brands', url: '/brands', icon: SprayCan },
    { name: 'Categories', url: '/categories', icon: User },
    { name: 'FAQ', url: '/faq', icon: HelpCircle },
    { name: 'Quick Book', url: 'https://wa.me/919121883163', icon: MessageSquare }
  ]

  return <NavBar items={navItems} />
}
