import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase/index.js'; 

export const getTasks = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, 'tasks'));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return [];
  }
};
