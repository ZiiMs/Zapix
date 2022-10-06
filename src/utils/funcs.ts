export default function refreshSession () {
  const message = { event: 'session', data: { trigger: "getSession" } }
  localStorage.setItem(
    "nextauth.message",
    JSON.stringify({ ...message, timestamp: Math.floor(Date.now() / 1000) })
  )
}