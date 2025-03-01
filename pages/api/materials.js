import { connectToDatabase } from '@/src/lib/dbconnect';
import { auth } from '@/lib/firebase-admin'; // You'll need to set up Firebase Admin

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // GET User's Materials
  if (req.method === 'GET') {
    try {
      const { userId } = req.query;
      const materials = await db
        .collection('materials')
        .find({ ownerId: userId })
        .sort({ createdAt: -1 })
        .toArray();

      return res.status(200).json(materials);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch materials' });
    }
  }

  // POST New Material
  if (req.method === 'POST') {
    try {
      const { title, description, subject, level } = req.body;
      const authorization = req.headers.authorization;

      if (!authorization) {
        return res.status(401).json({ error: 'Authorization required' });
      }

      const token = authorization.split(' ')[1];
      const { uid } = await auth.verifyIdToken(token);

      const newMaterial = {
        title,
        description,
        subject,
        level,
        ownerId: uid,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = await db.collection('materials').insertOne(newMaterial);
      return res.status(201).json({ ...newMaterial, _id: result.insertedId });

    } catch (error) {
      return res.status(500).json({ error: 'Failed to create material' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}