'use client';
import { useEffect, useState } from 'react';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [userMaterials, setUserMaterials] = useState([]);
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newMaterial, setNewMaterial] = useState({
    title: '',
    description: '',
    subject: '',
    level: 'Beginner'
  });

  // Fetch user's materials and requests
  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = auth.currentUser;
        if (!user) return;

        // Fetch user's posted materials
        const materialsRes = await fetch(`/api/materials?userId=${user.uid}`);
        const materialsData = await materialsRes.json();
        setUserMaterials(materialsData);

        // Fetch requests for user's materials
        const requestsRes = await fetch(`/api/requests?ownerId=${user.uid}`);
        const requestsData = await requestsRes.json();
        setRequests(requestsData);

      } catch (error) {
        console.error('Dashboard error:', error);
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = auth.onAuthStateChanged(user => {
      if (!user) {
        router.push('/login');
      } else {
        fetchData();
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handlePostMaterial = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      const res = await fetch('/api/materials', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await user.getIdToken()
        },
        body: JSON.stringify({
          ...newMaterial,
          ownerId: user.uid,
          ownerEmail: user.email
        })
      });

      if (res.ok) {
        const newMaterialData = await res.json();
        setUserMaterials([...userMaterials, newMaterialData]);
        setNewMaterial({ title: '', description: '', subject: '', level: 'Beginner' });
      }
    } catch (error) {
      console.error('Posting error:', error);
    }
  };

  const handleRequestUpdate = async (requestId, status) => {
    try {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': await auth.currentUser.getIdToken()
        },
        body: JSON.stringify({ status })
      });

      if (res.ok) {
        setRequests(requests.map(req => 
          req._id === requestId ? { ...req, status } : req
        ));
      }
    } catch (error) {
      console.error('Update error:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Welcome to Your Dashboard</h1>

        {/* Post New Material Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Post New Material</h2>
          <form onSubmit={handlePostMaterial} className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              className="w-full p-2 border rounded"
              value={newMaterial.title}
              onChange={(e) => setNewMaterial({...newMaterial, title: e.target.value})}
              required
            />
            <textarea
              placeholder="Description"
              className="w-full p-2 border rounded"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({...newMaterial, description: e.target.value})}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Subject (e.g., Mathematics)"
                className="p-2 border rounded"
                value={newMaterial.subject}
                onChange={(e) => setNewMaterial({...newMaterial, subject: e.target.value})}
                required
              />
              <select
                className="p-2 border rounded"
                value={newMaterial.level}
                onChange={(e) => setNewMaterial({...newMaterial, level: e.target.value})}
              >
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Post Material
            </button>
          </form>
        </div>

        {/* Posted Materials Section */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Posted Materials</h2>
          {userMaterials.length === 0 ? (
            <p className="text-gray-500">No materials posted yet</p>
          ) : (
            <div className="space-y-4">
              {userMaterials.map(material => (
                <div key={material._id} className="border p-4 rounded">
                  <h3 className="font-semibold">{material.title}</h3>
                  <p className="text-gray-600">{material.description}</p>
                  <div className="flex gap-2 mt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {material.subject}
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded text-sm">
                      {material.level}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Material Requests Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Material Requests</h2>
          {requests.length === 0 ? (
            <p className="text-gray-500">No requests yet</p>
          ) : (
            <div className="space-y-4">
              {requests.map(request => (
                <div key={request._id} className="border p-4 rounded">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold">{request.materialTitle}</p>
                      <p className="text-gray-600">From: {request.requesterEmail}</p>
                      <p className="text-sm">Message: {request.message}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleRequestUpdate(request._id, 'approved')}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded text-sm"
                        disabled={request.status !== 'pending'}
                      >
                        {request.status === 'approved' ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleRequestUpdate(request._id, 'rejected')}
                        className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm"
                        disabled={request.status !== 'pending'}
                      >
                        {request.status === 'rejected' ? 'Rejected' : 'Reject'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Dashboard Links */}
        <div className="mt-8 flex gap-4">
          <Link 
            href="/materials" 
            className="text-green-600 hover:text-green-700 font-medium"
          >
            Browse All Materials →
          </Link>
          <button 
            onClick={() => auth.signOut()}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}