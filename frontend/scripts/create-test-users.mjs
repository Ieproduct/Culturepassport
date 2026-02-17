/**
 * Create test employee & manager accounts via the create-user Edge Function.
 * Usage: node scripts/create-test-users.mjs
 */

const SUPABASE_URL = 'https://aqfctxjwcaqijvqcxuso.supabase.co'
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFxZmN0eGp3Y2FxaWp2cWN4dXNvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA2MzI3NDMsImV4cCI6MjA4NjIwODc0M30.bnDYe22qPannHyNkO1bodWa44wnGgPIUQLAIHPazMOw'

const ADMIN_EMAIL = 'admin@culturepassport.com'
const ADMIN_PASSWORD = 'password1234'

const USERS_TO_CREATE = [
  {
    email: 'employee@culturepassport.com',
    password: 'password1234',
    full_name: 'พนักงาน ทดสอบ',
    role: 'employee',
  },
  {
    email: 'manager@culturepassport.com',
    password: 'password1234',
    full_name: 'Manager ทดสอบ',
    role: 'manager',
  },
]

async function main() {
  // 1. Sign in as admin to get JWT
  console.log('🔑 Signing in as admin...')
  const loginRes = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: SUPABASE_ANON_KEY,
    },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  })

  if (!loginRes.ok) {
    const err = await loginRes.json()
    console.error('Admin login failed:', err)
    process.exit(1)
  }

  const { access_token } = await loginRes.json()
  console.log('Admin login OK')

  // 2. Create each user via Edge Function
  for (const user of USERS_TO_CREATE) {
    console.log(`\n📝 Creating ${user.role}: ${user.email}...`)

    const res = await fetch(`${SUPABASE_URL}/functions/v1/create-user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
        apikey: SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(user),
    })

    const data = await res.json()

    if (res.ok) {
      console.log(`  ✅ Created: ${data.email} (${data.role}) — id: ${data.user_id}`)
    } else {
      console.log(`  ⚠️  ${res.status}: ${data.error}`)
    }
  }

  console.log('\n🎉 Done!')
}

main()
