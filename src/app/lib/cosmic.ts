import { createBucketClient } from '@cosmicjs/sdk'

interface FetchCosmicObjectParams {
  bucketSlug?: string
  readKey?: string
  type: string
  slug: string
  props?: string
  depth?: number
}

export async function fetchCosmicObject({
  bucketSlug,
  readKey,
  type,
  slug,
  props = 'slug,title,metadata,type',
  depth = 1,
}: FetchCosmicObjectParams) {
  const cosmic = createBucketClient({
    bucketSlug: bucketSlug || process.env.COSMIC_BUCKET_SLUG || 'basic-template-production',
    readKey: readKey || process.env.COSMIC_READ_KEY || '38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f',
  })

  const data = await cosmic.objects
    .findOne({
      type,
      slug,
    })
    .props(props)
    .depth(depth)

  return data.object
}

