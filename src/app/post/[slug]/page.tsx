"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";

interface Post {
  slug: string;
  title: string;
  type: string;
  metadata: {
    title: string;
    content: string;
    excerpt: string;
    featured_image: {
      url: string;
      imgix_url: string;
    };
    author: {
      slug: string;
      title: string;
      metadata: {
        name: string;
        bio: string;
        profile_photo: {
          url: string;
        };
        email: string;
        social_media: any;
      };
    };
    categories: Array<{
      slug: string;
      title: string;
      metadata: {
        name: string;
        color: string;
      };
    }>;
    published_date: string;
  };
}

export default function PostPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const bucketSlug = process.env.NEXT_PUBLIC_COSMIC_BUCKET;
        const readKey = process.env.NEXT_PUBLIC_COSMIC_READ_KEY;

        if (!bucketSlug || !readKey) {
          throw new Error("Missing CosmicJS configuration");
        }

        // First, get all posts to find the one with matching slug
        const allPostsResponse = await fetch(
          `https://api.cosmicjs.com/v3/buckets/${bucketSlug}/objects?pretty=true&read_key=${readKey}&depth=1&props=id,slug,title,metadata,type`
        );

        if (!allPostsResponse.ok) {
          throw new Error(`Failed to fetch posts (${allPostsResponse.status})`);
        }

        const allPostsData = await allPostsResponse.json();

        // Find the post with matching slug and type "posts"
        const foundPost = allPostsData.objects.find(
          (obj: any) => obj.slug === slug && obj.type === "posts"
        );

        if (!foundPost) {
          throw new Error("Post not found");
        }

        setPost(foundPost);
      } catch (error) {
        console.error("Fetch error:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Loading post...</h1>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Post not found</h1>
        <p>{error}</p>
        <Link href="/pages/posts" style={{ color: "#3b82f6" }}>
          ← Back to all posts
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      {/* Back link */}
      <Link
        href="/pages/posts"
        style={{
          color: "#3b82f6",
          textDecoration: "none",
          fontSize: "0.875rem",
          marginBottom: "2rem",
          display: "inline-block",
        }}
      >
        ← Back to all posts
      </Link>

      {/* Featured Image */}
      {post.metadata.featured_image && (
        <img
          src={post.metadata.featured_image.imgix_url}
          alt={post.metadata.title}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
            borderRadius: "8px",
            marginBottom: "2rem",
          }}
        />
      )}

      {/* Categories */}
      {post.metadata.categories && post.metadata.categories.length > 0 && (
        <div style={{ marginBottom: "1rem" }}>
          {post.metadata.categories.map((category) => (
            <span
              key={category.slug}
              style={{
                backgroundColor: category.metadata.color,
                color: "white",
                padding: "0.25rem 0.75rem",
                borderRadius: "12px",
                fontSize: "0.875rem",
                marginRight: "0.5rem",
              }}
            >
              {category.metadata.name}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <h1
        style={{
          fontSize: "3rem",
          fontWeight: "bold",
          marginBottom: "1rem",
          lineHeight: "1.2",
        }}
      >
        {post.metadata.title}
      </h1>

      {/* Author and Date */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          marginBottom: "2rem",
          paddingBottom: "2rem",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        {post.metadata.author?.metadata?.profile_photo && (
          <img
            src={post.metadata.author.metadata.profile_photo.url}
            alt={post.metadata.author.metadata.name}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              objectFit: "cover",
            }}
          />
        )}
        <div>
          <div style={{ fontWeight: "600", fontSize: "1.125rem" }}>
            {post.metadata.author?.metadata?.name ||
              post.metadata.author?.title}
          </div>
          {post.metadata.author?.metadata?.bio && (
            <div
              style={{
                color: "#6b7280",
                fontSize: "0.875rem",
                marginBottom: "0.25rem",
              }}
            >
              {post.metadata.author.metadata.bio}
            </div>
          )}
          <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
            Published on{" "}
            {new Date(post.metadata.published_date).toLocaleDateString(
              "en-US",
              {
                year: "numeric",
                month: "long",
                day: "numeric",
              }
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div
        style={{ fontSize: "1.125rem", lineHeight: "1.8", color: "#374151" }}
      >
        <ReactMarkdown
          components={{
            h1: ({ children }) => (
              <h1
                style={{
                  fontSize: "2rem",
                  fontWeight: "bold",
                  margin: "1.5rem 0 1rem 0",
                }}
              >
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  margin: "1.5rem 0 1rem 0",
                }}
              >
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3
                style={{
                  fontSize: "1.25rem",
                  fontWeight: "bold",
                  margin: "1rem 0 0.5rem 0",
                }}
              >
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p style={{ margin: "1rem 0", lineHeight: "1.6" }}>{children}</p>
            ),
            ul: ({ children }) => (
              <ul style={{ margin: "1rem 0", paddingLeft: "1.5rem" }}>
                {children}
              </ul>
            ),
            ol: ({ children }) => (
              <ol style={{ margin: "1rem 0", paddingLeft: "1.5rem" }}>
                {children}
              </ol>
            ),
            li: ({ children }) => (
              <li style={{ margin: "0.25rem 0" }}>{children}</li>
            ),
            strong: ({ children }) => (
              <strong style={{ fontWeight: "bold" }}>{children}</strong>
            ),
            blockquote: ({ children }) => (
              <blockquote
                style={{
                  borderLeft: "4px solid #e5e7eb",
                  paddingLeft: "1rem",
                  margin: "1rem 0",
                  fontStyle: "italic",
                  color: "#6b7280",
                }}
              >
                {children}
              </blockquote>
            ),
            code: ({ children }) => (
              <code
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "0.125rem 0.25rem",
                  borderRadius: "0.25rem",
                  fontSize: "0.875em",
                }}
              >
                {children}
              </code>
            ),
            pre: ({ children }) => (
              <pre
                style={{
                  backgroundColor: "#f3f4f6",
                  padding: "1rem",
                  borderRadius: "0.5rem",
                  overflow: "auto",
                  margin: "1rem 0",
                }}
              >
                {children}
              </pre>
            ),
          }}
        >
          {post.metadata.content}
        </ReactMarkdown>
      </div>
    </div>
  );
}
