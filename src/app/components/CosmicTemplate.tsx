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

    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <header className="mb-10 text-center">
            <h1 className="text-5xl font-bold text-gray-900 mb-4 tracking-tight">
              {object.title}
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
            {/* Metadata Section */}
            {object.metadata && Object.keys(object.metadata).length > 0 && (
              <section className="p-8">
                <h2 className="text-3xl font-semibold text-gray-800 mb-6 pb-3 border-b-2 border-gray-200">
                  Content
                </h2>
                <div className="space-y-6">
                  {Object.entries(object.metadata).map(([key, value]) => {
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
              </section>
            )}

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

