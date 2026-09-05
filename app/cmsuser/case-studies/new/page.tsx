'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { slugify } from '@/lib/utils';

interface CaseStudyFormData {
  title: string;
  slug: string;
  category: string;
  content: string;
  summary: string;
  status: string;
  publishedDate: string;
  image: string;
  description: string;
  testimonial: string;
  metrics: {
    efficiencyIncrease: number;
    operationalCostSavings: number;
    customerSatisfactionIncrease: number;
  };
  keyBenefits: string[];
  challenges: string[];
  implementationPlan: string[];
  results: string;
}

export default function NewCaseStudyPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState<CaseStudyFormData>({
    title: '',
    slug: '',
    category: '',
    content: '',
    summary: '',
    status: 'draft',
    publishedDate: new Date().toISOString().split('T')[0],
    image: '',
    description: '',
    testimonial: '',
    metrics: {
      efficiencyIncrease: 0,
      operationalCostSavings: 0,
      customerSatisfactionIncrease: 0
    },
    keyBenefits: [''],
    challenges: [''],
    implementationPlan: [''],
    results: '',
  });
  const [error, setError] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'title') {
      setFormData(prev => ({
        ...prev,
        title: value,
        slug: slugify(value)
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleMetricsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      metrics: {
        ...prev.metrics,
        [name]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Validate required fields
      const requiredFields = {
        title: 'Title',
        slug: 'Slug',
        category: 'Category',
        content: 'Content',
        description: 'Description',
        summary: 'Summary',
        results: 'Results'
      };

      for (const [field, label] of Object.entries(requiredFields)) {
        const value = formData[field as keyof CaseStudyFormData];
        if (!value || (typeof value === 'string' && !value.trim())) {
          throw new Error(`${label} is required`);
        }
      }

      // Validate slug format
      const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
      if (!slugRegex.test(formData.slug)) {
        throw new Error('Slug must contain only lowercase letters, numbers, and hyphens. Please check the format.');
      }

      // Validate metrics
      const metrics = formData.metrics;
      if (!metrics.efficiencyIncrease || !metrics.operationalCostSavings || !metrics.customerSatisfactionIncrease) {
        throw new Error('All metrics fields are required');
      }

      // Validate metrics are numbers
      if (isNaN(metrics.efficiencyIncrease) || isNaN(metrics.operationalCostSavings) || isNaN(metrics.customerSatisfactionIncrease)) {
        throw new Error('Metrics must be valid numbers');
      }

      // Validate metrics are between 0 and 100
      if (metrics.efficiencyIncrease < 0 || metrics.efficiencyIncrease > 100 ||
          metrics.operationalCostSavings < 0 || metrics.operationalCostSavings > 100 ||
          metrics.customerSatisfactionIncrease < 0 || metrics.customerSatisfactionIncrease > 100) {
        throw new Error('Metrics must be between 0 and 100');
      }

      // Validate arrays are not empty
      if (formData.keyBenefits.length === 0 || formData.keyBenefits[0].trim() === '') {
        throw new Error('At least one key benefit is required');
      }
      if (formData.challenges.length === 0 || formData.challenges[0].trim() === '') {
        throw new Error('At least one challenge is required');
      }
      if (formData.implementationPlan.length === 0 || formData.implementationPlan[0].trim() === '') {
        throw new Error('At least one implementation plan item is required');
      }

      const formDataToSend = new FormData();
      
      // Add basic fields
      formDataToSend.append('title', formData.title);
      formDataToSend.append('slug', formData.slug);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('content', formData.content);
      formDataToSend.append('status', formData.status);
      formDataToSend.append('publishedDate', formData.publishedDate);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('summary', formData.summary);
      formDataToSend.append('results', formData.results);
      formDataToSend.append('testimonial', formData.testimonial);

      // Add metrics as a JSON string
      formDataToSend.append('metrics', JSON.stringify(formData.metrics));

      // Add arrays as JSON strings
      formDataToSend.append('keyBenefits', JSON.stringify(formData.keyBenefits));
      formDataToSend.append('challenges', JSON.stringify(formData.challenges));
      formDataToSend.append('implementationPlan', JSON.stringify(formData.implementationPlan));

      // Add the image file if it exists
      const imageInput = document.querySelector('input[type="file"]') as HTMLInputElement;
      if (imageInput?.files?.[0]) {
        formDataToSend.append('image', imageInput.files[0]);
      }

      console.log('Submitting form data...');
      const response = await fetch('/api/case-studies', {
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
        const errorMessage = data.details || data.error || 'Failed to create case study';
        console.error('Server error:', errorMessage);
        throw new Error(errorMessage);
      }

      if (data.success) {
        router.push('/cmsuser/case-studies');
      } else {
        throw new Error(data.error || data.details || 'Failed to create case study');
      }
    } catch (error) {
      console.error('Error creating case study:', error);
      setError(error instanceof Error ? error.message : 'An error occurred while creating the case study');
    } finally {
      setLoading(false);
    }
  };

  const handleArrayChange = (
    index: number,
    value: string,
    field: 'keyBenefits' | 'challenges' | 'implementationPlan'
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => (i === index ? value : item))
    }));
  };

  const addArrayItem = (field: 'keyBenefits' | 'challenges' | 'implementationPlan') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (index: number, field: 'keyBenefits' | 'challenges' | 'implementationPlan') => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Case Study</h1>

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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="e.g., my-case-study"
              />
              <p className="mt-1 text-sm text-gray-500">
                Use only lowercase letters, numbers, and hyphens
              </p>
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
                onChange={handleInputChange}
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
                onChange={handleInputChange}
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

        {/* Description and Content */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Content</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                Summary
              </label>
              <textarea
                id="summary"
                name="summary"
                value={formData.summary}
                onChange={handleInputChange}
                required
                rows={4}
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                placeholder="Enter a brief summary of the case study"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                Main Content
              </label>
              <textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
                rows={10}
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="efficiencyIncrease" className="block text-sm font-medium text-gray-700">
                Efficiency Increase (%)
              </label>
              <input
                type="number"
                id="efficiencyIncrease"
                name="metrics.efficiencyIncrease"
                value={formData.metrics.efficiencyIncrease}
                onChange={handleMetricsChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="operationalCostSavings" className="block text-sm font-medium text-gray-700">
                Operational Cost Savings (%)
              </label>
              <input
                type="number"
                id="operationalCostSavings"
                name="metrics.operationalCostSavings"
                value={formData.metrics.operationalCostSavings}
                onChange={handleMetricsChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>

            <div>
              <label htmlFor="customerSatisfactionIncrease" className="block text-sm font-medium text-gray-700">
                Customer Satisfaction Increase (%)
              </label>
              <input
                type="number"
                id="customerSatisfactionIncrease"
                name="metrics.customerSatisfactionIncrease"
                value={formData.metrics.customerSatisfactionIncrease}
                onChange={handleMetricsChange}
                min="0"
                max="100"
                className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        {/* Key Benefits */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Key Benefits</h2>
          <div className="space-y-4">
            {formData.keyBenefits.map((benefit, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={benefit}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'keyBenefits')}
                  className="flex-1 rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter key benefit"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'keyBenefits')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('keyBenefits')}
              className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800"
            >
              Add Benefit
            </button>
          </div>
        </div>

        {/* Challenges */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Challenges</h2>
          <div className="space-y-4">
            {formData.challenges.map((challenge, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={challenge}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'challenges')}
                  className="flex-1 rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter challenge"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'challenges')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('challenges')}
              className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800"
            >
              Add Challenge
            </button>
          </div>
        </div>

        {/* Implementation Plan */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Implementation Plan</h2>
          <div className="space-y-4">
            {formData.implementationPlan.map((plan, index) => (
              <div key={index} className="flex gap-2">
                <input
                  type="text"
                  value={plan}
                  onChange={(e) => handleArrayChange(index, e.target.value, 'implementationPlan')}
                  className="flex-1 rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  placeholder="Enter implementation step"
                />
                <button
                  type="button"
                  onClick={() => removeArrayItem(index, 'implementationPlan')}
                  className="px-3 py-2 text-red-600 hover:text-red-800"
                >
                  Remove
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('implementationPlan')}
              className="px-4 py-2 text-sm text-purple-600 hover:text-purple-800"
            >
              Add Step
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Results</h2>
          <textarea
            id="results"
            name="results"
            value={formData.results}
            onChange={handleInputChange}
            required
            rows={6}
            className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Testimonial */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Testimonial</h2>
          <textarea
            id="testimonial"
            name="testimonial"
            value={formData.testimonial}
            onChange={handleInputChange}
            rows={4}
            className="mt-1 block w-full rounded-md border-2 border-purple-600/60 shadow-sm focus:border-purple-500 focus:ring-purple-500"
          />
        </div>

        {/* Status */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Status</h2>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
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
            {loading ? 'Creating...' : 'Create Case Study'}
          </button>
        </div>
      </form>
    </div>
  );
} 