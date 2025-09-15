export default defineEventHandler(async (event) => {
  // Clear the admin token cookie
  setCookie(event, 'admin-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 0
  })

  return {
    success: true,
    message: 'Logged out successfully'
  }
})
