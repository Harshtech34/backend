export function generateRequestId(): string {
  // Generate a random string of 8 characters
  const randomPart = Math.random().toString(36).substring(2, 10)

  // Add timestamp for uniqueness
  const timestamp = Date.now().toString(36)

  return `req_${timestamp}_${randomPart}`
}
