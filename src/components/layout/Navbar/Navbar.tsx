import DesktopNavbar from './DesktopNavbar'
import MobileNavbar from './MobileNavbar'

const items = [
  {
    name: 'Dashboard',
    link: '/',
  },
  {
    name: 'Transactions',
    link: '/transactions',
  },
  {
    name: 'Manage',
    link: '/manage',
  },
]

const Navbar = () => {
  return (
    <>
      <DesktopNavbar items={items} />
      <MobileNavbar items={items} />
    </>
  )
}

export default Navbar
