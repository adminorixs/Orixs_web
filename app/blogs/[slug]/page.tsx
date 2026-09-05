'use client';

import { useParams } from 'next/navigation';
import { blogs } from '../../../components/blogData';
import { Navbar } from '../../../components/Navbar';
import { FooterSection } from '../../../components/FooterSection';
import BlogDetailsClient from '../../../components/BlogDetailsClient';

export default function BlogDetailsPage() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : Array.isArray(params.slug) ? params.slug[0] : '';
  
  // Find the blog by slug from the static data
  const blog = blogs.find((b) => b.slug === slug);
  
  // Handle not found case
  if (!blog) {
    return (
      <main className="min-h-screen bg-white pt-20 pb-0">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold mb-4">Blog not found</h1>
          <p>The blog you're looking for doesn't exist.</p>
        </div>
        <FooterSection />
      </main>
    );
  }
  
  // Get related blogs
  const related = blogs.filter((b) => blog.related.includes(b.slug));
  
  return (
    <main className="min-h-screen bg-white pt-20 pb-0">
      <Navbar />
      <div className="pt-8">
        <BlogDetailsClient blog={blog} related={related} />
      </div>
      <FooterSection />
    </main>
  );
} 