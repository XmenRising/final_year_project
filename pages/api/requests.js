import { adminDb, adminAuth,adminFirestore } from '@/lib/firebase-admin';

export default async function handler(req, res) {
  // GET Requests for User's Materials
  if (req.method === 'GET') {
    try {
      const { ownerId } = req.query;
      
      if (!ownerId) {
        return res.status(400).json({ error: 'Missing owner ID' });
      }

      const snapshot = await adminDb.collection('requests')
        .where('ownerId', '==', ownerId)
        .orderBy('createdAt', 'desc')
        .get();
      const requests = [];
      for (const doc of snapshot.docs) {
        const request = doc.data();
        const materialDoc = await adminDb.collection('materials').doc(request.materialId).get();
        requests.push({
          id: doc.id,
          ...request,
          material: materialDoc.exists ? materialDoc.data() : null
        });
      }

      return res.status(200).json(requests);
    } catch (error) {
      console.error('Error fetching requests:', error);
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
      const decodedToken = await adminAuth.verifyIdToken(token);

      const requestRef = adminDb.collection('requests').doc(id);
      const requestDoc = await requestRef.get();

      if (!requestDoc.exists || requestDoc.data().ownerId !== decodedToken.uid) {
        return res.status(404).json({ error: 'Request not found' });
      }

      
      await requestRef.update({
        status,
        updatedAt: adminFirestore.FieldValue.serverTimestamp()
      });

      return res.status(200).json({
        id: requestDoc.id,
        ...requestDoc.data(),
        status
      });

    } catch (error) {
      console.error('Error updating request:', error);
      return res.status(500).json({ error: 'Failed to update request' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
}