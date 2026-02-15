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
    // Note: .limit() is not available for findOne() queries

  return data.object
}

// New function to fetch multiple objects (like team members)
interface FetchCosmicObjectsParams {
  bucketSlug?: string
  readKey?: string
  type: string
  props?: string
  depth?: number
  limit?: number
}

export async function fetchCosmicObjects({
  bucketSlug,
  readKey,
  type,
  props = 'slug,title,metadata,type',
  depth = 1,
  limit = 100,
}: FetchCosmicObjectsParams) {
  const cosmic = createBucketClient({
    bucketSlug: bucketSlug || process.env.COSMIC_BUCKET_SLUG!,
    readKey: readKey || process.env.COSMIC_READ_KEY!,
  })

  const data = await cosmic.objects
    .find({
      type,
    })
    .props(props)
    .depth(depth)
    .limit(limit)

  return data.objects
}

