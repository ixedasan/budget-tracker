export interface NavbarItem {
  name: string
  link: string
  handleClick?: () => void
}

export interface NavbarProps {
  items: NavbarItem[]
}
