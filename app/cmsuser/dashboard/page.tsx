'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface DashboardStats {
  caseStudies: number;
  blogs: number;
  publishedCaseStudies: number;
  publishedBlogs: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    caseStudies: 0,
    blogs: 0,
    publishedCaseStudies: 0,
    publishedBlogs: 0,
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [caseStudiesRes, blogsRes] = await Promise.all([
          fetch('/api/case-studies'),
          fetch('/api/blogs'),
        ]);

        const caseStudies = await caseStudiesRes.json();
        const blogs = await blogsRes.json();

        setStats({
          caseStudies: caseStudies.length,
          blogs: blogs.length,
          publishedCaseStudies: caseStudies.filter((cs: any) => cs.status === 'published').length,
          publishedBlogs: blogs.filter((blog: any) => blog.status === 'published').length,
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
      router.push('/cmsuser/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex-shrink-0">
            <Image
              src="/images/logo.png"
              alt="Orixs Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
            />
          </Link>
          <h1 className="text-3xl font-bold">Dashboard</h1>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Case Studies</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.caseStudies}</p>
            </div>
            <div>
              <p className="text-gray-600">Published</p>
              <p className="text-2xl font-bold">{stats.publishedCaseStudies}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/cmsuser/case-studies"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Manage Case Studies →
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Blogs</h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600">Total</p>
              <p className="text-2xl font-bold">{stats.blogs}</p>
            </div>
            <div>
              <p className="text-gray-600">Published</p>
              <p className="text-2xl font-bold">{stats.publishedBlogs}</p>
            </div>
          </div>
          <div className="mt-4">
            <Link
              href="/cmsuser/blogs"
              className="text-indigo-600 hover:text-indigo-800"
            >
              Manage Blogs →
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Link
            href="/cmsuser/case-studies/new"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Case Study
          </Link>
          <Link
            href="/cmsuser/blogs/new"
            className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Create New Blog
          </Link>
        </div>
      </div>
    </div>
  );
} 