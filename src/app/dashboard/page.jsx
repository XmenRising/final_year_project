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

export default function Dashboard() {
  const router = useRouter();
  const [userDoc, setUserDoc] = useState(null);
  const [books, setBooks] = useState([]);
  const [comments, setComments] = useState({});
  const [newComment, setNewComment] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  // New state for displaying request success message
  const [requestMessage, setRequestMessage] = useState('');

  // Fetch current user's document (for role, name, etc.)
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

  // Fetch books based on user's role (requester sees only available books)
  useEffect(() => {
    const fetchBooks = async () => {
      const booksColRef = collection(db, 'books');
      let booksQuery;
      if (userDoc?.role === 'requester') {
        booksQuery = query(
          booksColRef,
          where('status', '==', 'available'),
          orderBy('createdAt', 'desc')
        );
      } else {
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

  // Listen for notifications
  useEffect(() => {
    let unsubscribeNotifications;
    const unsubscribeAuth = auth.onAuthStateChanged(user => {
      if (user) {
        unsubscribeNotifications = setupNotifications(user.uid, setNotifications);
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

  // For requesters: Add a book request (only add a comment)
  const handleBookRequest = async (bookId) => {
    const commentsColRef = collection(db, 'books', bookId, 'comments');
    const newCommentRef = doc(commentsColRef);
  
    await setDoc(newCommentRef, {
      userId: userDoc.id,
      requesterName: userDoc.name,
      message: "I would like to request this book",
      isRequest: true,
      createdAt: new Date().toISOString()
    });
  
    // Show a success message for 3 seconds
    setRequestMessage("Your request has been sent successfully!");
    setTimeout(() => setRequestMessage(''), 3000);
  };

  // For donors: Update a request comment (approve/reject)
  const handleRequestResponse = async (bookId, commentId, response) => {
    try {
      const commentDocRef = doc(db, 'books', bookId, 'comments', commentId);
      await updateDoc(commentDocRef, { status: response });
  
      if (response === 'approved') {
        const bookDocRef = doc(db, 'books', bookId);
        await updateDoc(bookDocRef, {
          status: 'claimed',
          updatedAt: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error("Error updating request:", error);
    }
  };

  // For donors: Optionally, submit a reply comment
  const handleCommentSubmit = async (bookId) => {
    if (!newComment.trim()) return;
  
    const commentsColRef = collection(db, 'books', bookId, 'comments');
    const newCommentRef = doc(commentsColRef);
  
    await setDoc(newCommentRef, {
      userId: userDoc.id,
      message: newComment.trim(),
      isRequest: false,
      createdAt: new Date().toISOString()
    });
  
    setNewComment('');
    // Refresh comments for this book
    const updatedCommentsSnapshot = await getDocs(collection(db, 'books', bookId, 'comments'));
    setComments(prev => ({
      ...prev,
      [bookId]: updatedCommentsSnapshot.docs.map(docSnap => ({ id: docSnap.id, ...docSnap.data() }))
    }));
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
        <nav className="p-4 mt-44 w-52">
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
                onClick={() => router.push('/profile')}
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

        {/* Show request success message for requesters */}
        {requestMessage && (
          <div className="mb-4 p-4 bg-green-100 text-green-800 rounded">
            {requestMessage}
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
                
                {/* Action Buttons */}
                {userDoc?.role === 'requester' && (
                  <button
                    onClick={() => handleBookRequest(book.id)}
                    className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                  >
                    I want this book
                  </button>
                )}
                {userDoc?.role === 'donor' && book.owner === userDoc.id && (
                  <button
                    onClick={() => router.push(`/manage-book/${book.id}`)}
                    className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
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
