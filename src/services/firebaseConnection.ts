import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyB817OPsZz3VtgXeDKQlNKn8Z8ke94q2A0',
  authDomain: 'boardapp-e799f.firebaseapp.com',
  projectId: 'boardapp-e799f',
  storageBucket: 'boardapp-e799f.appspot.com',
  messagingSenderId: '212315395928',
  appId: '1:212315395928:web:d7249f792d9825c5cd772d',
  measurementId: 'G-MG63MFJDLB',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
