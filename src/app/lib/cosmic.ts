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
    bucketSlug: bucketSlug || process.env.COSMIC_BUCKET_SLUG!,
    readKey: readKey || process.env.COSMIC_READ_KEY!,
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

