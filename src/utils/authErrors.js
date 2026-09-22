/** Friendly messages for Firebase Auth error codes */
const MAP = {
  'auth/email-already-in-use': 'An account with this email already exists. Try logging in instead.',
  'auth/invalid-email': 'That email address doesn’t look right. Please check and try again.',
  'auth/weak-password': 'Your password is too weak. Use at least 8 characters with a letter and a number.',
  'auth/missing-password': 'Please enter your password.',
  'auth/user-not-found': 'No account found with this email address.',
  'auth/wrong-password': 'Incorrect password. Please try again.',
  'auth/invalid-credential': 'Incorrect email or password. Please try again.',
  'auth/invalid-login-credentials': 'Incorrect email or password. Please try again.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed': 'Network error. Please check your internet connection and try again.',
  'auth/requires-recent-login': 'For security, please log out and log back in before doing this.',
  'auth/user-disabled': 'This account has been disabled.',
  'auth/operation-not-allowed': 'Email/password sign-in is not enabled for this Firebase project.',
}

export const authErrorMessage = (error) => {
  if (!error) return 'Something went wrong. Please try again.'
  return MAP[error.code] || error.message?.replace('Firebase: ', '').replace(/\(auth.*\)\.?/, '').trim() || 'Something went wrong. Please try again.'
}
