import { adminAuth, adminFirestore } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  // Verify authentication by checking for a valid Bearer token in the Authorization header.
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    // Verify the Firebase token using adminAuth. This returns the user's UID.
    const { uid } = await adminAuth.verifyIdToken(token);

    if (req.method === 'POST') {
      // Spread the request body into newBook.
      // NOTE: The client should handle image uploading to Firebase Storage.
      // If an image has been uploaded on the client, its URL is sent in req.body.imageURL.
      // This API simply stores that URL with the rest of the book details.
      const newBook = {
        ...req.body, // This includes the imageURL field if provided.
        owner: uid,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        requests: [] // initialize the requests array for future use.
      };

      // Add the new book document to Firestore in the "books" collection.
      const docRef = await adminFirestore.collection('books').add(newBook);

      return res.status(201).json({
        id: docRef.id,
        message: 'Book posted successfully'
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: error.message });
  }
}
