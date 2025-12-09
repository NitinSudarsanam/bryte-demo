"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "../../components/header/header";
import MastheadPosts from "../../components/masthead/mastheadPosts";
import "./posts.css";

interface Post {
  slug: string;
  title: string;
  type: string;
  metadata: {
    title: string;
    excerpt: string;
    content: string;
    featured_image?: {
      url: string;
      imgix_url: string;
    };
    author?: {
      slug: string;
      title: string;
      metadata?: {
        name: string;
        profile_photo?: {
          url: string;
        };
      };
    };
    categories?: (string | { title: string; slug: string })[];
    published_date: string;
  };
  created_at: string;
}

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [authors, setAuthors] = useState<string[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [noResults, setNoResults] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAuthor, setSelectedAuthor] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bucketSlug = process.env.NEXT_PUBLIC_COSMIC_BUCKET_SLUG || 
                           process.env.NEXT_PUBLIC_COSMIC_BUCKET;
        const readKey = process.env.NEXT_PUBLIC_COSMIC_READ_KEY;

        if (!bucketSlug || !readKey) {
          throw new Error("Missing CosmicJS configuration");
        }

        const response = await fetch(
          `https://api.cosmicjs.com/v3/buckets/${bucketSlug}/objects?pretty=true&read_key=${readKey}&depth=1&props=id,slug,title,metadata,type,created_at`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const posts =
          data.objects?.filter((obj: any) => obj.type === "posts") || [];

        // Extract categories and authors
        const allCategories = new Set<string>();
        const allAuthors = new Set<string>();

        posts.forEach((post: Post) => {
          if (post.metadata?.categories) {
            post.metadata.categories.forEach(
              (cat: string | { title: string; slug: string }) => {
                const categoryName = typeof cat === "string" ? cat : cat.title;
                allCategories.add(categoryName);
              }
            );
          }
          if (post.metadata?.author?.metadata?.name) {
            allAuthors.add(post.metadata.author.metadata.name);
          } else if (post.metadata?.author?.title) {
            allAuthors.add(post.metadata.author.title);
          }
        });

        setCategories(Array.from(allCategories));
        setAuthors(Array.from(allAuthors));
        setPosts(posts);
        setFilteredPosts(posts);
      } catch (error) {
        console.error("Fetch error:", error);
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const performSearch = () => {
    if (!posts.length) return;

    setIsSearching(true);
    setNoResults(false);

    let filtered = [...posts];

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter((post) => {
        const title =
          post.metadata?.title?.toLowerCase() ||
          post.title?.toLowerCase() ||
          "";
        const excerpt = post.metadata?.excerpt?.toLowerCase() || "";
        const content = post.metadata?.content?.toLowerCase() || "";
        const author =
          post.metadata?.author?.metadata?.name?.toLowerCase() ||
          post.metadata?.author?.title?.toLowerCase() ||
          "";
        const searchLower = searchTerm.toLowerCase();

        return (
          title.includes(searchLower) ||
          excerpt.includes(searchLower) ||
          content.includes(searchLower) ||
          author.includes(searchLower)
        );
      });
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter((post) => {
        if (!post.metadata?.categories) return false;
        return post.metadata.categories.some(
          (cat: string | { title: string; slug: string }) => {
            const categoryName = typeof cat === "string" ? cat : cat.title;
            return categoryName === selectedCategory;
          }
        );
      });
    }

    // Filter by author
    if (selectedAuthor) {
      filtered = filtered.filter((post) => {
        const author =
          post.metadata?.author?.metadata?.name || post.metadata?.author?.title;
        return author === selectedAuthor;
      });
    }

    setFilteredPosts(filtered);
    setNoResults(filtered.length === 0);
    setIsSearching(false);
  };

  const handleSearchSubmit = () => {
    performSearch();
  };

  const handleSearchInputChange = (value: string) => {
    setSearchTerm(value);
    if (noResults && value.trim()) {
      setNoResults(false);
    }
  };

  // Auto-filter when category or author changes
  useEffect(() => {
    performSearch();
  }, [selectedCategory, selectedAuthor]);

  if (loading) return <div className="loading">Loading posts...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div>
      {/* Header */}
      <Header />

      {/* Masthead */}
      <MastheadPosts />

      {/* Main Content */}
      <div className="posts-container">
        {/* Search and Filter Section */}
        <div className="search-section">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSearchSubmit()}
              className="search-input"
            />
            <button onClick={handleSearchSubmit} className="search-button">
              🔍
            </button>
          </div>

          <div className="filters-container">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="filter-select"
            >
              <option value="">Category</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <select
              value={selectedAuthor}
              onChange={(e) => setSelectedAuthor(e.target.value)}
              className="filter-select"
            >
              <option value="">Author</option>
              {authors.map((author) => (
                <option key={author} value={author}>
                  {author}
                </option>
              ))}
            </select>

            <select className="filter-select">
              <option value="">Sort by Date</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </div>

        {/* Loading/Error/No Results States */}
        {isSearching && <div className="loading">Searching...</div>}

        {noResults && (
          <div className="no-results">
            No posts found matching your search criteria.
          </div>
        )}

        {/* Posts Grid */}
        {!isSearching && !noResults && (
          <div className="posts-grid">
            {filteredPosts.map((post) => (
              <div className="post-card" key={post.slug}>
                {post.metadata?.featured_image && (
                  <Link href={`/post/${post.slug}`}>
                    <img
                      src={
                        post.metadata.featured_image.imgix_url ||
                        post.metadata.featured_image.url
                      }
                      alt={post.metadata?.title || post.title}
                      className="post-featured-image"
                    />
                  </Link>
                )}
                <div className="post-card-content">
                  <Link href={`/post/${post.slug}`}>
                    <h2 className="post-title">
                      {post.metadata?.title || post.title}
                    </h2>
                  </Link>
                  <p className="post-excerpt">{post.metadata?.excerpt}</p>
                  <div className="post-meta">
                    <div className="post-meta-left">
                      <div className="bryte-star-wrap">
                        <img
                          src="/post-star.svg"
                          alt=""
                          className="bryte-star"
                        />
                      </div>
                      <div className="post-meta-text">
                        <div className="post-author">
                          {post.metadata?.author?.metadata?.name ||
                            post.metadata?.author?.title ||
                            "Anonymous"}
                        </div>
                        <div className="post-date">
                          {new Date(
                            post.metadata?.published_date || post.created_at
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {post.metadata?.categories && (
                      <div className="post-categories">
                        {post.metadata.categories
                          .slice(0, 3)
                          .map(
                            (
                              category:
                                | string
                                | { title: string; slug: string },
                              index: number
                            ) => {
                              const categoryName =
                                typeof category === "string"
                                  ? category
                                  : category.title;
                              const categoryClass =
                                categoryName
                                  ?.toLowerCase()
                                  .replace(/\s+/g, "-") || "default";
                              return (
                                <span
                                  key={index}
                                  className={`category-tag ${categoryClass}`}
                                >
                                  {categoryName}
                                </span>
                              );
                            }
                          )}
                        {post.metadata.categories.length > 3 && (
                          <span className="category-tag plus">+</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
