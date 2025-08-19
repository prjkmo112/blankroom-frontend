import { Card, Container, SimpleGrid } from '@mantine/core'
import classes from './CardList.module.css'
import { useNavigate } from 'react-router-dom'

export interface CardListItemType {
  title: string;
  image?: string | null;
  description?: string;
  date: string;
  url: string;
}

function CardListItem({ article }: { article: CardListItemType }) {
  const navigate = useNavigate()

  return (
    <Card
      key={article.title}
      p="md"
      radius="md"
      shadow="md"
      onClick={() => navigate(article.url)}
      className={classes.card}
    >
      <p className="text-xs font-black opacity-30">{article.date}</p>
      <p className="text-2xl">{article.title}</p>
      <p className='m-2 text-sm font-light text-gray-400'>{article.description}</p>
    </Card>
  )
}

export interface CardListProps {
  items: CardListItemType[];
}

export default function CardList(props: CardListProps) {
  return (
    <Container style={{ maxWidth: "65vw" }}>
      <SimpleGrid cols={3} spacing="xs">
        {props.items.map((article) => (
          <CardListItem article={article} />
        ))}
      </SimpleGrid>
    </Container>
  )
}