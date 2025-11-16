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

// Helper function to check if a value is an image object
function isImageObject(value: any): boolean {
  return (
    typeof value === 'object' &&
    value !== null &&
    (value.url || value.imgix_url)
  )
}

// Helper function to render metadata value
function renderMetadataValue(value: any) {
  if (isImageObject(value)) {
    const imageUrl = value.imgix_url || value.url
    return (
      <div className="mt-2">
        <Image
          src={imageUrl}
          alt={value.alt || 'Image'}
          width={800}
          height={600}
          className="rounded-lg shadow-md w-full h-auto max-w-2xl"
          unoptimized
        />
        {value.alt && (
          <p className="mt-2 text-sm text-gray-500 italic">{value.alt}</p>
        )}
      </div>
    )
  }

  if (Array.isArray(value)) {
    return (
      <div className="space-y-2 mt-2">
        {value.map((item, index) => (
          <div key={index} className="pl-4 border-l-2 border-gray-300">
            {isImageObject(item) ? (
              renderMetadataValue(item)
            ) : typeof item === 'object' && item !== null ? (
              <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto">
                {JSON.stringify(item, null, 2)}
              </pre>
            ) : (
              <span className="text-gray-600">{String(item)}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (typeof value === 'object' && value !== null) {
    return (
      <pre className="bg-gray-100 p-3 rounded text-sm overflow-x-auto mt-2">
        {JSON.stringify(value, null, 2)}
      </pre>
    )
  }

  return <span className="text-gray-700">{String(value)}</span>
}

export default async function CosmicTemplate({
  bucketSlug,
  readKey,
  type,
  slug,
  props = 'slug,title,metadata,type',
  depth = 1,
}: CosmicTemplateProps) {
  // Use provided credentials or fall back to environment variables
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
        <div className="max-w-5xl mx-auto">
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

          {/* Main Content */}
          <main className="bg-white rounded-2xl shadow-xl overflow-hidden">
            <section className="p-8">
              {/* Page Title from metadata */}
              {object.metadata?.title && object.metadata.title !== object.title && (
                <div className="mb-8 text-center">
                  <h2 className="text-4xl font-semibold text-gray-800">
                    {object.metadata.title}
                  </h2>
                </div>
              )}

              {/* Sections */}
              {object.metadata?.sections && Array.isArray(object.metadata.sections) && object.metadata.sections.length > 0 && (
                <div className="space-y-12">
                  {object.metadata.sections.map((section: any, index: number) => {
                    const sectionImage = getImage(section.metadata?.image)
                    
                    return (
                      <div key={section.id || index} className="border-b border-gray-200 last:border-b-0 pb-12 last:pb-0">
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">
                          {section.metadata?.header || section.title}
                        </h2>
                        
                        {sectionImage && (
                          <div className="mb-6">
                            <Image
                              src={sectionImage.imgix_url || sectionImage.url}
                              alt={section.metadata?.header || 'Section image'}
                              width={800}
                              height={600}
                              className="rounded-lg shadow-md w-full h-auto"
                              unoptimized
                            />
                          </div>
                        )}
                        
                        {section.metadata?.body_text && (
                          <div 
                            className="prose prose-lg max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{ __html: section.metadata.body_text }}
                          />
                        )}
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Display images if sections are empty or don't exist */}
              {(!object.metadata?.sections || (Array.isArray(object.metadata.sections) && object.metadata.sections.length === 0)) && 
               object.metadata?.images && Array.isArray(object.metadata.images) && object.metadata.images.length > 0 && (
                <div className="space-y-6">
                  {object.metadata.images.map((img: any, index: number) => {
                    const imageData = img.metadata?.image
                    if (!imageData) return null
                    
                    return (
                      <div key={img.id || index} className="mb-6">
                        {img.title && img.title !== 'image' && (
                          <h3 className="text-2xl font-semibold text-gray-800 mb-4">
                            {img.title}
                          </h3>
                        )}
                        <Image
                          src={imageData.imgix_url || imageData.url}
                          alt={img.title || img.slug || 'Image'}
                          width={800}
                          height={600}
                          className="rounded-lg shadow-md w-full h-auto"
                          unoptimized
                        />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Fallback: If no sections and no images, show other metadata */}
              {(!object.metadata?.sections || (Array.isArray(object.metadata.sections) && object.metadata.sections.length === 0)) &&
               (!object.metadata?.images || !Array.isArray(object.metadata.images) || object.metadata.images.length === 0) &&
               object.metadata && Object.keys(object.metadata).length > 0 && (
                <div className="space-y-6">
                  {Object.entries(object.metadata)
                    .filter(([key]) => key !== 'sections' && key !== 'images' && key !== 'title')
                    .map(([key, value]) => {
                      const isImage = isImageObject(value)
                      const isArrayOfImages = Array.isArray(value) && value.some(isImageObject)
                      
                      return (
                        <div
                          key={key}
                          className={`pb-6 ${
                            !isImage && !isArrayOfImages ? 'border-b border-gray-200' : ''
                          }`}
                        >
                          <div className="font-semibold text-lg text-gray-800 capitalize mb-2">
                            {key.replace(/_/g, ' ')}
                          </div>
                          <div className="text-gray-700">
                            {renderMetadataValue(value)}
                          </div>
                        </div>
                      )
                    })}
                </div>
              )}
            </section>

            {/* Raw Data Section (for debugging) */}
            <details className="border-t border-gray-200 bg-gray-50">
              <summary className="cursor-pointer p-4 text-sm font-semibold text-gray-600 hover:text-gray-800 hover:bg-gray-100 transition-colors">
                View Raw Data (Debug)
              </summary>
              <pre className="p-4 bg-gray-900 text-gray-100 text-xs overflow-x-auto">
                {JSON.stringify(object, null, 2)}
              </pre>
            </details>
          </main>
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

