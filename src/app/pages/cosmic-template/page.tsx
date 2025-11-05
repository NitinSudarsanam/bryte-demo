import CosmicTemplate from '../../components/CosmicTemplate'

export default function CosmicTemplatePage() {
  return (
    <CosmicTemplate
      type="pages"
      slug="home-page"
      props="slug,title,metadata,type"
      depth={1}
    />
  )
}

