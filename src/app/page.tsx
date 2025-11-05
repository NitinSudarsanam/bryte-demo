import CosmicTemplate from './components/CosmicTemplate';

export default function Home() {
  return (
    <CosmicTemplate
      bucketSlug="basic-template-production"
      readKey="38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f"
      type="pages"
      slug="home-page"
      props="slug,title,metadata,type"
      depth={1}
    />
  );
}
