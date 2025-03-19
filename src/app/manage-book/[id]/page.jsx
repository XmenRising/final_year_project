'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter, useParams } from 'next/navigation';
import {
  doc,
  getDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  updateDoc
} from 'firebase/firestore';

export default function ManageBook() {
  const router = useRouter();
  const { id } = useParams(); // Get the dynamic route parameter
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('available');

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }

      // Fetch book data using the "id" from useParams() and modular functions
      const bookDocRef = doc(db, 'books', id);
      const bookDocSnap = await getDoc(bookDocRef);
      if (!bookDocSnap.exists()) {
        router.push('/dashboard');
        return;
      }
      
      const bookData = bookDocSnap.data();
      setBook({ id: bookDocSnap.id, ...bookData });
      setStatus(bookData.status);

      // Setup real-time comments listener using modular functions
      const commentsRef = collection(db, 'books', id, 'comments');
      const q = query(commentsRef, orderBy('createdAt', 'asc'));
      const unsubscribeComments = onSnapshot(q, (snapshot) => {
        const commentsData = snapshot.docs.map(docSnap => ({
          id: docSnap.id,
          ...docSnap.data()
        }));
        setComments(commentsData);
      });

      setLoading(false);
      return () => unsubscribeComments();
    });

    return () => unsubscribe();
  }, [id, router]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      const bookDocRef = doc(db, 'books', id);
      await updateDoc(bookDocRef, {
        status: newStatus,
        updatedAt: new Date().toISOString()
      });
      setStatus(newStatus);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handleRequestResponse = async (commentId, response) => {
    try {
      const commentDocRef = doc(db, 'books', id, 'comments', commentId);
      await updateDoc(commentDocRef, { status: response });

      if (response === 'approved') {
        await handleStatusUpdate('claimed');
      }
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button 
          onClick={() => router.back()}
          className="mb-8 text-gray-600 hover:text-gray-800"
        >
          ← Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold mb-6">Manage {book.title}</h1>
        
        {/* Status Management */}
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <h2 className="text-lg font-semibold mb-4">Book Status</h2>
          <div className="flex gap-4 items-center">
            <select
              value={status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="px-4 py-2 border rounded"
            >
              <option value="available">Available</option>
              <option value="pending">Pending</option>
              <option value="claimed">Claimed</option>
            </select>
            <p className="text-sm text-gray-600">
              Last updated: {new Date(book.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* Requests and Comments */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-6">Requests & Comments ({comments.length})</h2>
          
          <div className="space-y-6">
            {comments.map(comment => (
              <div key={comment.id} className="border-b pb-6 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-medium">
                      {comment.userId === auth.currentUser?.uid ? 'You' : 'User'}:
                    </p>
                    <p className="text-gray-600">{comment.message}</p>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {comment.isRequest && (
                  <div className="mt-4">
                    <div className="flex gap-4 items-center">
                      <span className="text-sm font-medium">
                        Request Status: {comment.status || 'pending'}
                      </span>
                      {!comment.status && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleRequestResponse(comment.id, 'approved')}
                            className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleRequestResponse(comment.id, 'rejected')}
                            className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
