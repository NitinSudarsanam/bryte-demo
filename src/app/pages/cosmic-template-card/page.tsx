import CosmicTemplateCard from '../../components/CosmicTemplateCard'

export default function CosmicTemplateCardPage() {
  return (
    <CosmicTemplateCard
      bucketSlug="basic-template-production"
      readKey="38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f"
      type="pages"
      slug="about-us"
      props="slug,title,metadata,type"
      depth={1}
    />
  )
}

