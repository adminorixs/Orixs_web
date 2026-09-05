'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface BlogFormData {
  title: string;
  slug: string;
  author: string;
  category: string;
  content: string;
  status: string;
  publishedDate: string;
  image: string;
  summary: string;
  tags: string[];
  readingTime: number;
  sections: {
    id: string;
    title: string;
    text: string;
  }[];
}

export default function NewBlogPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    slug: '',
    author: '',
    category: '',
    content: '',
    status: 'draft',
    publishedDate: new Date().toISOString().split('T')[0],
    image: '',
    summary: '',
    tags: [],
    readingTime: 5,
    sections: [
      { id: 'introduction', title: 'Introduction', text: '' },
      { id: 'challenge', title: 'Understanding The Challenge', text: '' },
      { id: 'approach', title: 'The Orixs Approach', text: '' },
      { id: 'strategy', title: 'Implementation Strategy', text: '' },
      { id: 'measuring', title: 'Measuring Success', text: '' },
      { id: 'conclusion', title: 'Conclusion', text: '' },
    ],
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create a preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    // Here you would typically upload the image to your storage service
    // For now, we'll just store the file name
    setFormData(prev => ({
      ...prev,
      image: file.name
    }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name === 'slug') {
      // Auto-format slug: lowercase, replace spaces with hyphens, remove special characters
      const formattedSlug = value
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
        .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens

      setFormData(prev => ({
        ...prev,
        [name]: formattedSlug
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }
      if (!formData.author.trim()) {
        throw new Error('Author is required');
      }
      if (!formData.category.trim()) {
        throw new Error('Category is required');
      }
      if (!formData.summary.trim()) {
        throw new Error('Summary is required');
      }
      if (!formData.content.trim()) {
        throw new Error('Content is required');
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(formData.slug)) {
        throw new Error('Slug must contain only lowercase letters, numbers, and hyphens. Please check the format.');
      }

      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('author', formData.author);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('publishedDate', formData.publishedDate);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('readingTime', formData.readingTime.toString());

      // Add sections as a single JSON string
      formDataToSend.append('sections', JSON.stringify(formData.sections));

      // Add tags as a JSON string
      formDataToSend.append('tags', JSON.stringify(formData.tags));

      // Add the image file if it exists
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        formDataToSend.append('image', imageInput.files[0]);
      }

      console.log('Submitting form data...');
      const response = await fetch('/api/blogs', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Response received:', response.status, response.statusText);
      const contentType = response.headers.get('content-type');
      console.log('Response content type:', contentType);

      if (!contentType || !contentType.includes('application/json')) {
        const text = await response.text();
        console.error('Non-JSON response received:', text);
        throw new Error('Server returned non-JSON response. Please try again.');
      }

      const data = await response.json();
      console.log('Response data:', data);

      if (!response.ok) {
        throw new Error(data.error || data.details || 'Failed to create blog');
      }

      if (data.success) {
        router.push('/cmsuser/blogs');
      } else {
        throw new Error(data.error || data.details || 'Failed to create blog');
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the blog');
    } finally {
      setLoading(false);
    }
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim());
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleSectionChange = (index: number, field: 'title' | 'text', value: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map((section, i) => 
        i === index ? { ...section, [field]: value } : section
      )
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Blog</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        {/* Basic Information */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                Slug
              </label>
              <input
                type="text"
                id="slug"
                name="slug"
                value={formData.slug}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="e.g., my-blog-post"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use only lowercase letters, numbers, and hyphens
              </p>
            </div>

            <div>
              <label htmlFor="author" className="block text-sm font-medium text-gray-700">
                Author
              </label>
              <input
                type="text"
                id="author"
                name="author"
                value={formData.author}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">
                Published Date
              </label>
              <input
                type="date"
                id="publishedDate"
                name="publishedDate"
                value={formData.publishedDate}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="readingTime" className="block text-sm font-medium text-gray-700">
                Reading Time (minutes)
              </label>
              <input
                type="number"
                id="readingTime"
                name="readingTime"
                value={formData.readingTime}
                onChange={handleChange}
                min="1"
                required
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Image Upload */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Featured Image</h2>
          <div className="space-y-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
            />
            {imagePreview && (
              <div className="relative w-full h-64">
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
            )}
          </div>
        </div>

        {/* Summary */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Summary</h2>
          <textarea
            id="summary"
            name="summary"
            value={formData.summary}
            onChange={handleChange}
            required
            rows={4}
            className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter a brief summary of the blog post"
          />
        </div>

        {/* Tags */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Tags</h2>
          <input
            type="text"
            id="tags"
            name="tags"
            value={formData.tags.join(', ')}
            onChange={handleTagsChange}
            className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Blog Sections */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Blog Sections</h2>
          <div className="space-y-6">
            {formData.sections.map((section, index) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-medium">{section.title}</h3>
                <textarea
                  value={section.text}
                  onChange={(e) => handleSectionChange(index, 'text', e.target.value)}
                  required
                  rows={6}
                  className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder={`Enter content for ${section.title}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 border-2 border-purple-600/60 rounded-md text-purple-600 hover:bg-purple-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
} 