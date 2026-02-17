/**
 * Reset passwords for employee & manager accounts via Supabase Auth Admin API.
 * This calls the Edge Function approach won't work — we need the service role key.
 * Instead, we'll use the admin session to list users and update via REST.
 *
 * Usage: SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/reset-test-passwords.mjs
 *   OR:  node scripts/reset-test-passwords.mjs  (will prompt)
 */

const SUPABASE_URL = 'https://aqfctxjwcaqijvqcxuso.supabase.co'

const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SERVICE_ROLE_KEY) {
  console.error('❌ Set SUPABASE_SERVICE_ROLE_KEY environment variable first.')
  console.error('   Find it in Supabase Dashboard → Settings → API → service_role key')
  process.exit(1)
}

const NEW_PASSWORD = 'password1234'

const EMAILS = [
  'employee@culturepassport.com',
  'manager@culturepassport.com',
]

async function main() {
  // 1. List all users to find IDs
  console.log('📋 Fetching users...')
  const listRes = await fetch(`${SUPABASE_URL}/auth/v1/admin/users?per_page=50`, {
    headers: {
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      apikey: SERVICE_ROLE_KEY,
    },
  })

  if (!listRes.ok) {
    console.error('Failed to list users:', await listRes.text())
    process.exit(1)
  }

  const { users } = await listRes.json()
  console.log(`Found ${users.length} users total`)

  // 2. Reset passwords
  for (const email of EMAILS) {
    const user = users.find((u) => u.email === email)
    if (!user) {
      console.log(`⚠️  ${email} — not found in auth.users`)
      continue
    }

    console.log(`\n🔑 Resetting password for ${email} (id: ${user.id})...`)

    const res = await fetch(`${SUPABASE_URL}/auth/v1/admin/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
        apikey: SERVICE_ROLE_KEY,
      },
      body: JSON.stringify({ password: NEW_PASSWORD }),
    })

    if (res.ok) {
      console.log(`  ✅ Password reset to "${NEW_PASSWORD}"`)
    } else {
      const err = await res.text()
      console.log(`  ❌ Failed: ${err}`)
    }
  }

  console.log('\n🎉 Done! Try logging in with password:', NEW_PASSWORD)
}

main()
