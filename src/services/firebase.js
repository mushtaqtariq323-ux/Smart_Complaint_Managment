import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

// Values come from environment variables (.env) with the project defaults as fallback.
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyC5X7HeMocaovpzhV6sNsH96Mfvh0ocGVE',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'smart-complaint-system-3531b.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'smart-complaint-system-3531b',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'smart-complaint-system-3531b.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '526152639726',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:526152639726:web:c780846d3828e396127fff',
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)
export default app
