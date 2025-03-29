'use client';
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { setupNotifications } from '@/lib/notifications';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  orderBy,
  getDocs,
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import Link from 'next/link';

export default function Dashboard() {
  const router = useRouter();
  const [userDoc, setUserDoc] = useState(null);
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [loading, setLoading] = useState(true);
  // State for showing request input for each book (object keyed by book id)
  const [requestInputs, setRequestInputs] = useState({});
  // State for donor replies for each comment (object keyed by comment id)
  const [replyInputs, setReplyInputs] = useState({});
  // Global message (optional success messages)
  const [message, setMessage] = useState('');

  // Fetch current user's document
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) {
        router.push('/login');
        return;
      }
      const userDocRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userDocRef);
      if (userSnap.exists()) {
        setUserDoc({ id: user.uid, ...userSnap.data() });
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Fetch books based on user's role
  useEffect(() => {
    const fetchBooks = async () => {
      const booksColRef = collection(db, 'books');
      let booksQuery;
      if (userDoc?.role === 'requester') {
        // Requesters see only available books
        booksQuery = query(
          booksColRef,
          where('status', '==', 'available'),
          orderBy('createdAt', 'desc')
        );
      } else {
        // Donors see all books
        booksQuery = query(booksColRef, orderBy('createdAt', 'desc'));
      }
      const booksSnapshot = await getDocs(booksQuery);
      const booksData = booksSnapshot.docs.map(docSnap => ({
        id: docSnap.id,
        ...docSnap.data()
      }));
      setBooks(booksData);

      // Load comments for each book
      booksData.forEach(async (book) => {
        const commentsColRef = collection(db, 'books', book.id, 'comments');
        const commentsQuery = query(commentsColRef, orderBy('createdAt', 'asc'));
        const commentsSnapshot = await getDocs(commentsQuery);
        setComments(prev => ({
          ...prev,
          [book.id]: commentsSnapshot.docs.map(c => ({ id: c.id, ...c.data() }))
        }));
      });
      setLoading(false);
    };

    if (userDoc) fetchBooks();
  }, [userDoc]);

  // Listen for notifications (unchanged)
  useEffect(() => {
    let unsubscribeNotifications;
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        unsubscribeNotifications = setupNotifications(user.uid, () => { });
      }
    });
    return () => {
      unsubscribeAuth?.();
      unsubscribeNotifications?.();
    };
  }, []);

  // Logout handler
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/login');
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  // -------------------------------
  // Helper: Submit Request (for Requesters)
  // -------------------------------
  const submitRequest = async (bookId) => {
    const requestMessage = requestInputs[bookId];
    if (!requestMessage || requestMessage.trim() === "") return;
    const commentsColRef = collection(db, 'books', bookId, 'comments');
    const newCommentRef = doc(commentsColRef);
    await setDoc(newCommentRef, {
      userId: userDoc.id,
      requesterName: userDoc.name,
      message: requestMessage,
      isRequest: true,
      createdAt: new Date().toISOString()
    });
    setRequestInputs(prev => ({ ...prev, [bookId]: '' }));
    setMessage("Your request has been sent successfully!");
    setTimeout(() => setMessage(''), 3000);
  };

  // -------------------------------
  // Helper: Submit Reply (for Donors)
  // -------------------------------
  const submitReply = async (bookId, commentId) => {
    const reply = replyInputs[commentId];
    if (!reply || reply.trim() === "") return;
    const commentDocRef = doc(db, 'books', bookId, 'comments', commentId);
    await updateDoc(commentDocRef, { reply });
    setReplyInputs(prev => ({ ...prev, [commentId]: '' }));
    setMessage("Reply sent successfully!");
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="p-8">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar Navigation */}
      <aside className="fixed top-20 left-0 w-64 h-[calc(100vh-5rem)] bg-white shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Book Exchange</h2>
          <p className="text-gray-600">{userDoc?.name}</p>
        </div>
        <nav className="p-4 mt-44">
          <ul className="flex flex-col space-y-2">
            <li>
              <button
                onClick={() => router.push('/dashboard')}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100"
              >
                Dashboard
              </button>
            </li>
            <li>
              <button
                onClick={() => router.push(`/profile/${userDoc.id}`)} // Link to your own profile
                className="block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100"
              >
                Profile
              </button>
            </li>
            {userDoc?.role === 'donor' && (
              <li>
                <button
                  onClick={() => router.push('/post-book')}
                  className="block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100"
                >
                  Post New Book
                </button>
              </li>
            )}
            <li>
              <button
                onClick={handleLogout}
                className="block w-full text-left py-2 px-4 rounded-md transition-colors duration-200 hover:bg-gray-100"
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8 ml-64 pt-16">
        <h1 className="text-3xl font-bold mb-6">
          {userDoc?.role === 'donor'
            ? "Donor Dashboard"
            : "Requester Dashboard"}
        </h1>

        {/* Global Success Message */}
        {message && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {message}
          </div>
        )}

        {/* Books Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {books.map(book => (
            <div key={book.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {/* Book Image */}
              {book.imageURL ? (
                <img src={book.imageURL} alt={book.title} className="h-48 w-full object-cover" />
              ) : (
                <div className="h-48 w-full bg-gray-300 flex items-center justify-center">
                  <span className="text-gray-600">No Image</span>
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-1">{book.title}</h2>
                <p className="text-gray-600 text-sm mb-1">{book.subject} &mdash; {book.level}</p>
                <p className="text-sm text-gray-500 mb-2">Condition: {book.condition}</p>
                {book.quantity && (
                  <p className="text-sm text-gray-500 mb-2">Available: {book.quantity}</p>
                )}
                <p className="text-gray-700 text-sm mb-4 line-clamp-2">{book.description}</p>

                {/* Comments Section */}
                <div className="mb-4">
                  <h3 className="font-medium mb-2 text-sm">Comments:</h3>
                  <div className="space-y-2">
                    {comments[book.id]?.map(comment => (
                      <div key={comment.id} className="p-2 bg-gray-50 rounded border">
                        <p className="font-medium text-sm">
                          <Link href={`/profile/${comment.userId}`} className="text-blue-600 hover:underline">
                            {comment.requesterName || 'User'}
                          </Link>
                          :
                        </p>
                        <p className="text-sm">{comment.message}</p>
                        {comment.isRequest && (
                          <span className="text-xs text-blue-600">
                            (Request - Status: {comment.status || 'pending'})
                          </span>
                        )}
                        {/* Donor Reply Section */}
                        {userDoc?.role === 'donor' && book.owner === userDoc.id && (
                          <>
                            {comment.reply ? (
                              <p className="mt-1 text-sm text-green-600">Reply: {comment.reply}</p>
                            ) : (
                              <div className="mt-2 flex items-center space-x-2">
                                <input
                                  type="text"
                                  placeholder="Type your reply..."
                                  value={replyInputs[comment.id] || ''}
                                  onChange={(e) =>
                                    setReplyInputs(prev => ({
                                      ...prev,
                                      [comment.id]: e.target.value
                                    }))
                                  }
                                  className="flex-1 px-2 py-1 border rounded text-sm"
                                />
                                <button
                                  onClick={() => submitReply(book.id, comment.id)}
                                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                                >
                                  Reply
                                </button>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Requester Comment Input */}
                {userDoc?.role === 'requester' && (
                  <div className="mt-4">
                    <textarea
                      value={requestInputs[book.id] || ''}
                      onChange={(e) =>
                        setRequestInputs(prev => ({
                          ...prev,
                          [book.id]: e.target.value
                        }))
                      }
                      placeholder="Type your request..."
                      className="w-full p-2 border rounded text-sm"
                      rows="2"
                    />
                    <button
                      onClick={() => submitRequest(book.id)}
                      className="mt-2 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm"
                    >
                      Send Request
                    </button>
                  </div>
                )}

                {/* Donor Manage Button */}
                {userDoc?.role === 'donor' && book.owner === userDoc.id && (
                  <button
                    onClick={() => router.push(`/manage-book/${book.id}`)}
                    className="mt-4 w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-sm"
                  >
                    Manage Book
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
