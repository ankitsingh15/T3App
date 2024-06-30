"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '~/trpc/react';
import Header from '../_components/Header';

const Categories: React.FC = () => {
  const [page, setPage] = useState(1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const router = useRouter();

  const { data, isLoading } = api.auth.getCategories.useQuery({ page, limit: 6 });
  const updateCategoriesMutation = api.auth.updateUserCategories.useMutation({
    onSuccess: () => {
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000); // Hide message after 3 seconds
    },
  });

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev =>
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSavePreferences = () => {
    updateCategoriesMutation.mutate({ categoryIds: selectedCategories });
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <Header />
      <main className="container mx-auto mt-8 p-4">
        <h2 className="text-2xl mb-4">Select Categories</h2>
        <div className="grid grid-cols-2 gap-4 mb-4">
          {data?.categories.map(category => (
            <label key={category.id} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(category.id)}
                onChange={() => handleCategoryToggle(category.id)}
              />
              <span>{category.name}</span>
            </label>
          ))}
        </div>
        <div className="flex justify-between items-center">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage(prev => prev + 1)}
            disabled={!data || data.categories.length < 6}
            className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <button
          onClick={handleSavePreferences}
          className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
        >
          Save Preferences
        </button>
        {updateSuccess && (
          <p className="mt-2 text-green-600">Categories updated successfully!</p>
        )}
        <button
          onClick={handleLogout}
          className="mt-4 ml-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Logout
        </button>
      </main>
    </div>
  );
};

export default Categories;