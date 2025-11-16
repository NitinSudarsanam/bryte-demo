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

export default async function CosmicTemplateCard({
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
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {object.metadata?.title || object.title}
            </h1>
          </header>

          {/* Card Layout for Sections */}
          {object.metadata?.sections && Array.isArray(object.metadata.sections) && object.metadata.sections.length > 0 && (
            <div className="space-y-6">
              {object.metadata.sections.map((section: any, index: number) => {
                const sectionImage = getImage(section.metadata?.image)
                
                return (
                  <div key={section.id || index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                      {/* Image Side */}
                      {sectionImage && (
                        <div className="md:w-1/3">
                          <Image
                            src={sectionImage.imgix_url || sectionImage.url}
                            alt={section.metadata?.header || 'Section image'}
                            width={400}
                            height={400}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                      )}
                      
                      {/* Content Side */}
                      <div className={`p-8 ${sectionImage ? 'md:w-2/3' : 'w-full'}`}>
                        {section.metadata?.header && (
                          <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                            {section.metadata.header}
                          </h2>
                        )}
                        
                        {section.metadata?.body_text && (
                          <div 
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: section.metadata.body_text }}
                          />
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Card Layout for Images (if no sections) */}
          {(!object.metadata?.sections || (Array.isArray(object.metadata.sections) && object.metadata.sections.length === 0)) &&
           object.metadata?.images && Array.isArray(object.metadata.images) && object.metadata.images.length > 0 && (
            <div className="space-y-6">
              {object.metadata.images.map((img: any, index: number) => {
                const imageData = img.metadata?.image
                if (!imageData) return null
                
                return (
                  <div key={img.id || index} className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <Image
                      src={imageData.imgix_url || imageData.url}
                      alt={img.title || img.slug || 'Image'}
                      width={800}
                      height={600}
                      className="w-full h-auto"
                      unoptimized
                    />
                    {img.title && (
                      <div className="p-6">
                        <h3 className="text-2xl font-semibold text-gray-800">
                          {img.title}
                        </h3>
                      </div>
                    )}
                  </div>
                )
              })}
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

