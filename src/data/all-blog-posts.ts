import { blogPosts as corePosts, getPostBySlug as _getPostBySlug, getAllSlugs as _getAllSlugs } from "./blog-posts";
import { extraBlogPosts } from "./extra-blog-posts";
import type { BlogPost } from "./blog-posts";

export type { BlogPost };

export const blogPosts: BlogPost[] = [...corePosts, ...extraBlogPosts];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getAllSlugs(): string[] {
  return blogPosts.map((post) => post.slug);
}
