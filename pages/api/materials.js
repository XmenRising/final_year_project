// pages/api/materials.js
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  // GET User's Materials
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      
      if (!userId) {
        return res.status(400).json({ error: 'Missing user ID' });
      }

      const snapshot = await adminDb.collection('materials')
        .where('ownerId', '==', userId)
        .orderBy('createdAt', 'desc')
        .get();

      const materials = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Convert Firestore timestamps to ISO strings
        createdAt: doc.data().createdAt.toDate().toISOString(),
        updatedAt: doc.data().updatedAt.toDate().toISOString()
      }));

      return res.status(200).json(materials);
    } catch (error) {
      console.error('GET Materials Error:', error);
      return res.status(500).json({ 
        error: 'Failed to fetch materials',
        code: error.code || 'INTERNAL_ERROR'
      });
    }
  }

  // POST New Material
  if (req.method === 'POST') {
    try {
      const { title, description, subject, level } = req.body;
      const authorization = req.headers.authorization;

      // Validate request
      if (!authorization) {
        return res.status(401).json({ error: 'Authorization required' });
      }

      const token = authorization.split(' ')[1];
      const { uid, email } = await adminAuth.verifyIdToken(token);

      // In POST handler, update validation and document creation:
    if (!title || !description || !subject || !level || !condition) {
        return res.status(400).json({
        error: 'Missing required fields',
        required: ['title', 'description', 'subject', 'level', 'condition']
      });
    }

    const newMaterial = {
      title: title.trim(),
      description: description.trim(),
      subject: subject.trim(),
      level: level.trim(),
      condition: condition.trim(), // Add condition field
      ownerId: uid,
      ownerEmail: email,
      createdAt: adminFirestore.FieldValue.serverTimestamp(),
      updatedAt: adminFirestore.FieldValue.serverTimestamp()
    };

      // Add to Firestore
      const docRef = await adminDb.collection('materials').add(newMaterial);
      const materialDoc = await docRef.get();

      return res.status(201).json({
        id: docRef.id,
        ...materialDoc.data(),
        createdAt: materialDoc.data().createdAt.toDate().toISOString(),
        updatedAt: materialDoc.data().updatedAt.toDate().toISOString()
      });

    } catch (error) {
      console.error('POST Material Error:', error);
      return res.status(500).json({ 
        error: 'Failed to create material',
        code: error.code || 'INTERNAL_ERROR'
      });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}