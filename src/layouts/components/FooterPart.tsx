import { IconBrandGithub } from '@tabler/icons-react'
import IconTistory from '@assets/tistory.svg?react'
import { ActionIcon, Avatar, Container, Group, Text } from '@mantine/core'
import classes from './FooterPart.module.css'

interface FooterLinkData {
  title: string;
  links: { label: string; link: string }[];
}
// TODO: Footer 데이터 작성
const data: FooterLinkData[] = [
]

export default function FooterPart() {
  const groups = data.map((group) => {
    const links = group.links.map((link, index) => (
      <Text<'a'>
        key={index}
        className={classes.link}
        component="a"
        href={link.link}
        onClick={(event) => event.preventDefault()}
      >
        {link.label}
      </Text>
    ))

    return (
      <div className={classes.wrapper} key={group.title}>
        <Text className={classes.title}>{group.title}</Text>
        {links}
      </div>
    )
  })

  return (
    <footer className={classes.footer}>
      <Container className={classes.inner}>
        <div className={classes.logo}>
          <Avatar
            src={`https://ui-avatars.com/api/?name=mo&color=000`}
            className='rounded-full object-cover border-2 border-white shadow-md'
          />
          <Text size="xs" c="dimmed" className={classes.description}>
            Ambitious developer determined to change everything with code
          </Text>
        </div>
        <div className={classes.groups}>{groups}</div>
      </Container>
      <Container className={classes.afterFooter}>
        <Text c="dimmed" size="sm">
          © 2020 mantine.dev. All rights reserved.
        </Text>

        <Group gap={0} className={classes.social} justify="flex-end" wrap="nowrap">
          <ActionIcon size="lg" color="gray" variant="subtle" onClick={() => window.open('https://github.com/prjkmo112', '_blank')}>
            <IconBrandGithub size={22} stroke={1.5} />
          </ActionIcon>
          <ActionIcon size="lg" color="gray" variant="subtle" onClick={() => window.open('https://tistory.momodev.work', '_blank')}>
            <IconTistory width={22} height="auto" />
          </ActionIcon>
        </Group>
      </Container>
    </footer>
  )
}