import { initializeApp } from 'firebase/app'
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { getFunctions, httpsCallable } from 'firebase/functions'

// TODO: Replace with your actual Firebase config
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'YOUR_API_KEY',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'YOUR_PROJECT.firebaseapp.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'YOUR_PROJECT_ID',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'YOUR_PROJECT.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '',
}

const app = initializeApp(firebaseConfig)
const storage = getStorage(app)
const functions = getFunctions(app)

/**
 * Upload the generated card image to Firebase Storage.
 * Returns the public download URL.
 */
export async function uploadCardImage(blob: Blob, id: string): Promise<string> {
  const storageRef = ref(storage, `cards/${id}.png`)
  await uploadBytes(storageRef, blob, { contentType: 'image/png' })
  return getDownloadURL(storageRef)
}

/**
 * Call Cloud Function to create OG share page.
 * Returns the share page URL.
 */
export async function createSharePage(imageUrl: string, id: string): Promise<string> {
  const createOgPage = httpsCallable<
    { imageUrl: string; id: string },
    { shareUrl: string }
  >(functions, 'createSharePage')

  const result = await createOgPage({ imageUrl, id })
  return result.data.shareUrl
}

/**
 * Open Twitter share intent with pre-filled caption.
 */
export function openTwitterShare(shareUrl: string, appUrl: string) {
  const caption = encodeURIComponent(
    `I'm building at HH Goa 2026 🌴 #FrameInGoa — make yours: ${appUrl}`
  )
  const url = encodeURIComponent(shareUrl)
  window.open(
    `https://twitter.com/intent/tweet?text=${caption}&url=${url}`,
    '_blank',
    'noopener,noreferrer',
  )
}

export { storage, functions }
