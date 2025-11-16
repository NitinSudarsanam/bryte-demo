import CosmicTemplateGrid from '../../components/CosmicTemplateGrid'

export default function CosmicTemplateGridPage() {
  return (
    <CosmicTemplateGrid
      bucketSlug="basic-template-production"
      readKey="38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f"
      type="pages"
      slug="home-page"
      props="slug,title,metadata,type"
      depth={1}
    />
  )
}

