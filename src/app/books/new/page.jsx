'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { auth } from '@/lib/firebase';

export default function NewBookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    images: []
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const storage = getStorage();
    const storageRef = ref(storage, `books/${Date.now()}-${file.name}`);
    
    setUploading(true);
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, downloadURL]
    }));
    setUploading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    try {
      const response = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          owner: user.uid
        })
      });

      if (response.ok) router.push('/books');
    } catch (error) {
      console.error('Submission error:', error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Post a New Book</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Form fields */}
        <div>
          <label className="block mb-2">Book Images</label>
          <input
            type="file"
            onChange={handleImageUpload}
            disabled={uploading}
            accept="image/*"
          />
          <div className="mt-2 flex gap-2">
            {formData.images.map(url => (
              <img key={url} src={url} className="w-20 h-20 object-cover" />
            ))}
          </div>
        </div>
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          Post Book
        </button>
      </form>
    </div>
  );
}