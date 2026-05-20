// ONE-TIME migration route — DELETE after running
// GET /api/migrate?secret=piclio-secret-token-2026
import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase/admin'

const SQL_STATEMENTS = [
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS slideshow_pin text DEFAULT '1234'`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS slideshow_playlist jsonb DEFAULT '[]'`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS public_gallery boolean DEFAULT false`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS overlay_approved boolean DEFAULT false`,
  `ALTER TABLE events ADD COLUMN IF NOT EXISTS overlay_notes text`,
]

export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  if (secret !== process.env.PHOTOGRAPHER_TOKEN) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const results: string[] = []

  for (const sql of SQL_STATEMENTS) {
    const { error } = await supabaseAdmin.rpc('exec_sql', { sql }).maybeSingle()
    if (error) {
      // Try direct via REST if exec_sql not available
      results.push(`SKIP (no exec_sql): ${sql.substring(0, 60)}`)
    } else {
      results.push(`OK: ${sql.substring(0, 60)}`)
    }
  }

  // Verify columns exist by querying
  const { data, error: checkErr } = await supabaseAdmin
    .from('events')
    .select('slideshow_pin, slideshow_playlist, public_gallery, overlay_approved, overlay_notes')
    .limit(1)

  const columnsExist = !checkErr

  return NextResponse.json({
    results,
    columnsExist,
    message: columnsExist
      ? 'Migration complete — columns verified ✓'
      : `Columns missing — run SQL manually in Supabase Dashboard: ${checkErr?.message}`,
  })
}
