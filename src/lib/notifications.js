// notifications.js
import { db as firestore } from '@/lib/firebase';
import { collection, onSnapshot, query } from 'firebase/firestore';

export function setupNotifications(userId, setNotifications) {
  const notificationsRef = collection(firestore, 'users', userId, 'notifications');
  const q = query(notificationsRef);
  return onSnapshot(q, (snapshot) => {
    const notificationsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setNotifications(notificationsData);
  });
}
