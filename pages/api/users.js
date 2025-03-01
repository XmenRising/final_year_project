import { connectToDatabase } from '@/src/lib/dbconnect';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, uid } = req.body;
    const { db } = await connectToDatabase();
    const users = db.collection('users');

    // Check if user exists
    const existingUser = await users.findOne({ uid });
    if (!existingUser) {
      await users.insertOne({
        uid,
        email,
        createdAt: new Date(),
      });
    }

    res.status(200).json({ message: 'User saved' });
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}