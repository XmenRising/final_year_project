'use client';
import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
// Import Firebase Storage functions
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function PostBook() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    level: 'Primary',
    condition: 'Good',
    description: '',
    location: ''
  });
  // State to store the selected image file
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle image selection from file input
  const handleImageChange = (e) => {
    // Check if a file is selected, and store the first file in imageFile state
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  // Handle form submission: upload image (if provided) and then post book details
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('Not authenticated');

      let imageURL = '';
      // If an image file is selected, upload it to Firebase Storage
      if (imageFile) {
        const storage = getStorage();
        // Create a unique reference for the image file
        const storageRef = ref(
          storage,
          `bookImages/${user.uid}/${Date.now()}_${imageFile.name}`
        );
        // Upload the file to the created storage reference
        const snapshot = await uploadBytes(storageRef, imageFile);
        // Get the download URL of the uploaded file
        imageURL = await getDownloadURL(snapshot.ref);
      }

      // Post the book details to your API, including the imageURL if available
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user.getIdToken()}`
        },
        body: JSON.stringify({
          ...formData,
          owner: user.uid,
          status: 'available',
          imageURL // Store the image URL in Firestore
        })
      });

      if (!response.ok) throw new Error('Failed to post book');
      router.push('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-2xl bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-8 text-center">Post a New Book</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Book Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Book Title
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            />
          </div>

          {/* Subject & Education Level */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subject
              </label>
              <select
                required
                value={formData.subject}
                onChange={(e) =>
                  setFormData({ ...formData, subject: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="">Select Subject</option>
                <option value="Mathematics">Mathematics</option>
                <option value="English">English</option>
                <option value="Science">Science</option>
                <option value="Social Studies">Social Studies</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Education Level
              </label>
              <select
                required
                value={formData.level}
                onChange={(e) =>
                  setFormData({ ...formData, level: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="Primary">Primary School</option>
                <option value="Junior">Junior Secondary</option>
                <option value="Secondary">Secondary School</option>
              </select>
            </div>
          </div>

          {/* Condition & Location */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Condition
              </label>
              <select
                required
                value={formData.condition}
                onChange={(e) =>
                  setFormData({ ...formData, condition: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows="4"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:ring-green-500 focus:border-green-500"
            ></textarea>
          </div>

          {/* Book Image Input */}
          {/* This file input allows the user to select an image.
              When an image is selected, handleImageChange updates the imageFile state. */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Book Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-1 block w-full"
            />
          </div>

          {error && <p className="text-red-600">{error}</p>}

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
