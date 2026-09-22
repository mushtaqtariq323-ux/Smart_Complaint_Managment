import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as fbSignOut,
  sendPasswordResetEmail,
  setPersistence,
  browserLocalPersistence,
  browserSessionPersistence,
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from 'firebase/auth'
import { auth } from './firebase'

export const doSignup = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password)

export const doLogin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password)

export const doLogout = () => fbSignOut(auth)

export const doResetPassword = (email) => sendPasswordResetEmail(auth, email)

/** "Remember me" → keep the session across browser restarts, otherwise session-only. */
export const doSetPersistence = (remember) =>
  setPersistence(auth, remember ? browserLocalPersistence : browserSessionPersistence)

export const doUpdateDisplayName = (user, displayName) =>
  updateProfile(user, { displayName })

/** Requires re-authentication with the current password first (Firebase security rule). */
export const doChangePassword = async (user, currentPassword, newPassword) => {
  const credential = EmailAuthProvider.credential(user.email, currentPassword)
  await reauthenticateWithCredential(user, credential)
  await updatePassword(user, newPassword)
}
