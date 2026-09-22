export const isValidEmail = (email) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(email || '').trim())

export const passwordChecks = (pw) => ({
  length: String(pw || '').length >= 8,
  letter: /[a-zA-Z]/.test(pw || ''),
  number: /\d/.test(pw || ''),
})

export const isStrongPassword = (pw) => {
  const c = passwordChecks(pw)
  return c.length && c.letter && c.number
}

export const nameValid = (name) => String(name || '').trim().length >= 2
