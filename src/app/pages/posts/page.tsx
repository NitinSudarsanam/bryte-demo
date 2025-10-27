"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  slug: string;
  title: string;
  type: string;
  metadata: {
    title: string;
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
        profile_photo: {
          url: string;
        };
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

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bucketSlug =
          "posts-production-7d62f3b0-b29a-11f0-a8d7-83e73ed4924b";
        const readKey = "BPrx2j3rSW3jMMfDVXp5Tvy26hQruLoxPcYTFhFugjDE2AOO4g";

        const response = await fetch(
          `https://api.cosmicjs.com/v3/buckets/${bucketSlug}/objects?pretty=true&read_key=${readKey}&depth=1&props=slug,title,metadata,type`
        );

        if (!response.ok) {
          throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        // Filter only posts (not authors or categories)
        const postsOnly = data.objects.filter(
          (obj: any) => obj.type === "posts"
        );
        setPosts(postsOnly);
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center" }}>
        <h1>Loading posts...</h1>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px" }}>
      <h1
        style={{
          fontSize: "2.5rem",
          marginBottom: "2rem",
          textAlign: "center",
        }}
      >
        Blog Posts
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
        {posts.map((post) => (
          <article
            key={post.slug}
            style={{
              border: "1px solid #e5e7eb",
              borderRadius: "8px",
              padding: "1.5rem",
              backgroundColor: "#fff",
              boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Featured Image */}
            {post.metadata.featured_image && (
              <img
                src={post.metadata.featured_image.imgix_url}
                alt={post.metadata.title}
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "6px",
                  marginBottom: "1rem",
                }}
              />
            )}

            {/* Categories */}
            {post.metadata.categories &&
              post.metadata.categories.length > 0 && (
                <div style={{ marginBottom: "0.5rem" }}>
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
            <h2
              style={{
                fontSize: "1.5rem",
                marginBottom: "0.5rem",
                color: "#1f2937",
              }}
            >
              <Link
                href={`/post/${post.slug}`}
                style={{ textDecoration: "none", color: "inherit" }}
              >
                {post.metadata.title}
              </Link>
            </h2>

            {/* Excerpt */}
            <p
              style={{
                color: "#6b7280",
                marginBottom: "1rem",
                lineHeight: "1.6",
              }}
            >
              {post.metadata.excerpt}
            </p>

            {/* Author and Date */}
            <div
              style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}
            >
              {post.metadata.author?.metadata?.profile_photo && (
                <img
                  src={post.metadata.author.metadata.profile_photo.url}
                  alt={post.metadata.author.metadata.name}
                  style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    objectFit: "cover",
                  }}
                />
              )}
              <div>
                <div style={{ fontWeight: "500", fontSize: "0.875rem" }}>
                  {post.metadata.author?.metadata?.name ||
                    post.metadata.author?.title}
                </div>
                <div style={{ color: "#6b7280", fontSize: "0.875rem" }}>
                  {new Date(post.metadata.published_date).toLocaleDateString()}
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
