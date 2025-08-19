import { Avatar, Burger, Container, Group } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import classes from './HeaderPart.module.css'
import { IconBrandGithub } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import { PageRoutes } from '@/routes'
import { useUserStore } from '@/stores/userStore'


interface GropLinkItem {
  link?: string
  onClick?: () => void
  label: string
}

const links: GropLinkItem[] = [
  { label: 'Login', link: PageRoutes.LOGIN },
  { label: 'Register', link: PageRoutes.REGISTER },
]

const loginedLinks: GropLinkItem[] = [
]

export default function HeaderPart() {
  const navigate = useNavigate()
  const { userInfo } = useUserStore()
  const [opened, { toggle }] = useDisclosure(false)

  const items = (userInfo ? loginedLinks : links).map((link) => (
    <a
      key={link.label}
      href={link.link}
      className={classes.link}
      onClick={link.onClick || (() => navigate(link.link || ''))}
      style={{ cursor: "pointer" }}
    >
      {link.label}
    </a>
  ))

  return (
    <header className={classes.header}>
      <Container size="lg" className={classes.inner}>
        <Avatar
          src={`https://ui-avatars.com/api/?name=mo&color=000`}
          className='rounded-full object-cover border-2 border-white shadow-md'
        />
        <Group gap={5} visibleFrom="xs">
          {items}
        </Group>

        <Burger opened={opened} onClick={toggle} hiddenFrom="xs" size="sm" />
      </Container>
    </header>
  )
}