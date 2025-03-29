'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

export default function ProfilePage() {
  const router = useRouter();
  const { id } = useParams(); // Get user ID from URL
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({ name: '', location: '' });
  const [loading, setLoading] = useState(true); // Show loading state

  console.log("User ID from URL:", id); // Debugging

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Wait for authentication state to be loaded
        const user = auth.currentUser;
        console.log("Current Auth User:", user); // Debugging

        if (!user) {
          console.warn("User not authenticated. Redirecting...");
          router.push('/login');
          return;
        }

        if (!id) {
          console.error("Error: User ID is missing.");
          return;
        }

        if (user.uid !== id) {
          console.warn("Unauthorized access attempt.");
          router.push('/403'); // Redirect to 403 Forbidden page
          return;
        }

        const userDocRef = doc(db, "users", id);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const data = userSnap.data();
          setUserData(data);
          setFormData({
            name: data.name || "",
            location: data.location || "",
          });
        } else {
          console.warn("User not found, redirecting...");
          router.push("/404");
        }
      } catch (error) {
        console.error("Firestore error:", error.message);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;

    if (!user || user.uid !== id) {
      console.error("Unauthorized update attempt.");
      return;
    }

    try {
      await updateDoc(doc(db, 'users', id), {
        ...formData,
        updatedAt: new Date().toISOString(),
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center">Your Profile</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded shadow-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full px-4 py-2 border rounded shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
}
