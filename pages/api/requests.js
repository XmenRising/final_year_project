import { connectToDatabase } from '@src//lib/dbconnect';
import { auth } from '@/lib/firebase-admin';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  const { db } = await connectToDatabase();

  // GET Requests for User's Materials
  if (req.method === 'GET') {
    try {
      const { ownerId } = req.query;
      const requests = await db
        .collection('requests')
        .aggregate([
          { $match: { ownerId } },
          {
            $lookup: {
              from: 'materials',
              localField: 'materialId',
              foreignField: '_id',
              as: 'material'
            }
          },
          { $unwind: '$material' }
        ])
        .toArray();

      return res.status(200).json(requests);
    } catch (error) {
      return res.status(500).json({ error: 'Failed to fetch requests' });
    }
  }

  // PATCH Update Request Status
  if (req.method === 'PATCH') {
    try {
      const { id } = req.query;
      const { status } = req.body;
      const authorization = req.headers.authorization;

      if (!authorization) {
        return res.status(401).json({ error: 'Authorization required' });
      }

      const token = authorization.split(' ')[1];
      const { uid } = await auth.verifyIdToken(token);

      const request = await db.collection('requests').findOne({
        _id: new ObjectId(id),
        ownerId: uid
      });

      if (!request) {
        return res.status(404).json({ error: 'Request not found' });
      }

      const result = await db.collection('requests').updateOne(
        { _id: new ObjectId(id) },
        { $set: { status, updatedAt: new Date() } }
      );

      return res.status(200).json({ ...request, status });

    } catch (error) {
      return res.status(500).json({ error: 'Failed to update request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}