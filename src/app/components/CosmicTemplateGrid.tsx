import { createBucketClient } from '@cosmicjs/sdk'
import Image from 'next/image'

interface CosmicTemplateProps {
  bucketSlug?: string
  readKey?: string
  type: string
  slug: string
  props?: string
  depth?: number
}

interface CosmicObject {
  slug: string
  title: string
  metadata: Record<string, any>
  type: string
}

export default async function CosmicTemplateGrid({
  bucketSlug,
  readKey,
  type,
  slug,
  props = 'slug,title,metadata,type',
  depth = 1,
}: CosmicTemplateProps) {
  const cosmic = createBucketClient({
    bucketSlug: bucketSlug || process.env.COSMIC_BUCKET_SLUG || 'basic-template-production',
    readKey: readKey || process.env.COSMIC_READ_KEY || '38hX2h4NgRq5t6btJvbkjxJygVsfD9jN5eX9TG9sV8BYPEHw8f',
  })

  try {
    const data = await cosmic.objects
      .findOne({
        type,
        slug,
      })
      .props(props)
      .depth(depth)

    if (!data.object) {
      return (
        <div className="p-8 text-center">
          <h1 className="text-2xl font-bold text-red-600">Content Not Found</h1>
          <p className="mt-2 text-gray-600">
            No object found with type &quot;{type}&quot; and slug &quot;{slug}&quot;
          </p>
        </div>
      )
    }

    const object: CosmicObject = data.object

    // Create image lookup map
    const imagesMap = new Map<string, any>()
    if (object.metadata?.images && Array.isArray(object.metadata.images)) {
      object.metadata.images.forEach((img: any) => {
        if (img.id && img.metadata?.image) {
          imagesMap.set(img.id, img.metadata.image)
        }
      })
    }

    // Get image - handles both ID string and full object
    const getImage = (imageRef: string | any | null | undefined) => {
      if (!imageRef) return null
      
      // If it's a string (ID), look it up in the map
      if (typeof imageRef === 'string') {
        return imagesMap.get(imageRef) || null
      }
      
      // If it's an object with metadata.image (full object from depth=1)
      if (typeof imageRef === 'object' && imageRef.metadata?.image) {
        return imageRef.metadata.image
      }
      
      // If it's already the image data object
      if (typeof imageRef === 'object' && (imageRef.url || imageRef.imgix_url)) {
        return imageRef
      }
      
      return null
    }

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {object.metadata?.title || object.title}
            </h1>
            <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
              <span className="px-3 py-1 bg-gray-200 rounded-full">
                {object.type}
              </span>
              <span className="px-3 py-1 bg-gray-200 rounded-full">
                {object.slug}
              </span>
            </div>
          </header>

          {/* Grid Layout for Images */}
          {object.metadata?.images && Array.isArray(object.metadata.images) && object.metadata.images.length > 0 && (
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {object.metadata.images.map((img: any, index: number) => {
                  const imageData = img.metadata?.image
                  if (!imageData) return null
                  
                  return (
                    <div key={img.id || index} className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow">
                      <Image
                        src={imageData.imgix_url || imageData.url}
                        alt={img.title || img.slug || 'Image'}
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        unoptimized
                      />
                      {img.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                          <h3 className="text-white font-semibold text-lg">
                            {img.title}
                          </h3>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Sections in Grid (if any) */}
          {object.metadata?.sections && Array.isArray(object.metadata.sections) && object.metadata.sections.length > 0 && (
            <div className="mt-8 bg-white rounded-2xl shadow-xl overflow-hidden p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {object.metadata.sections.map((section: any, index: number) => {
                  const sectionImage = getImage(section.metadata?.image)
                  
                  return (
                    <div key={section.id || index} className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                      {sectionImage && (
                        <div className="mb-4">
                          <Image
                            src={sectionImage.imgix_url || sectionImage.url}
                            alt={section.metadata?.header || 'Section image'}
                            width={400}
                            height={250}
                            className="w-full h-48 object-cover rounded-lg"
                            unoptimized
                          />
                        </div>
                      )}
                      
                      {section.metadata?.header && (
                        <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                          {section.metadata.header}
                        </h2>
                      )}
                      
                      {section.metadata?.body_text && (
                        <div 
                          className="prose prose-sm max-w-none text-gray-700"
                          dangerouslySetInnerHTML={{ 
                            __html: section.metadata.body_text.length > 200 
                              ? section.metadata.body_text.substring(0, 200) + '...' 
                              : section.metadata.body_text
                          }}
                        />
                      )}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    )
  } catch (error: any) {
    console.error('Error fetching Cosmic content:', error)
    const bucketUsed = bucketSlug || process.env.COSMIC_BUCKET_SLUG || 'basic-template-production'
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Error Loading Content</h1>
        <div className="mt-4 space-y-2 text-gray-600">
          <p><strong>Bucket:</strong> {bucketUsed}</p>
          <p><strong>Type:</strong> {type}</p>
          <p><strong>Slug:</strong> {slug}</p>
          <p className="mt-4 text-red-600">
            {error?.message || (error instanceof Error ? error.message : 'An unknown error occurred')}
          </p>
        </div>
      </div>
    )
  }
}

