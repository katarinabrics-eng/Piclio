import { google } from 'googleapis'
import { Readable } from 'stream'

// ---------------------------------------------------------------------------
// Auth — lazy singleton so credentials are parsed once per process
// ---------------------------------------------------------------------------

let _auth: InstanceType<typeof google.auth.GoogleAuth> | null = null

function getAuth() {
  if (_auth) return _auth

  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY
  if (!raw) throw new Error('GOOGLE_SERVICE_ACCOUNT_KEY env var is not set')

  const credentials = JSON.parse(raw)
  _auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/drive'],
  })
  return _auth
}

function getDrive() {
  return google.drive({ version: 'v3', auth: getAuth() })
}

// ---------------------------------------------------------------------------
// Root folder ID
// ---------------------------------------------------------------------------

export function getRootFolderId(): string {
  const id = process.env.GOOGLE_DRIVE_FOLDER_ID
  if (!id) throw new Error('GOOGLE_DRIVE_FOLDER_ID env var is not set')
  return id.trim()
}

// ---------------------------------------------------------------------------
// uploadFile
// ---------------------------------------------------------------------------

/**
 * Upload a file buffer to a specific Drive folder.
 * @returns Drive file ID of the uploaded file.
 */
export async function uploadFile(
  buffer: Buffer,
  filename: string,
  mimeType: string,
  folderId: string,
): Promise<string> {
  const drive = getDrive()

  const stream = new Readable()
  stream.push(buffer)
  stream.push(null)

  const res = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name: filename,
      parents: [folderId],
    },
    media: {
      mimeType,
      body: stream,
    },
    fields: 'id',
  })

  const fileId = res.data.id
  if (!fileId) throw new Error(`Drive upload failed for "${filename}" — no id returned`)
  return fileId
}

// ---------------------------------------------------------------------------
// getOrCreateFolder
// ---------------------------------------------------------------------------

/**
 * Return the ID of an existing subfolder with `name` inside `parentId`,
 * or create it if it doesn't exist.
 */
export async function getOrCreateFolder(
  name: string,
  parentId: string,
): Promise<string> {
  const drive = getDrive()

  // Search for an existing folder with this name under the parent
  const q = [
    `name = '${name.replace(/'/g, "\\'")}'`,
    `'${parentId}' in parents`,
    `mimeType = 'application/vnd.google-apps.folder'`,
    `trashed = false`,
  ].join(' and ')

  const list = await drive.files.list({
    q,
    fields: 'files(id, name)',
    spaces: 'drive',
    pageSize: 1,
    supportsAllDrives: true,
    includeItemsFromAllDrives: true,
  })

  const existing = list.data.files?.[0]
  if (existing?.id) return existing.id

  // Create the folder
  const created = await drive.files.create({
    supportsAllDrives: true,
    requestBody: {
      name,
      mimeType: 'application/vnd.google-apps.folder',
      parents: [parentId],
    },
    fields: 'id',
  })

  const folderId = created.data.id
  if (!folderId) throw new Error(`Failed to create Drive folder "${name}"`)
  return folderId
}

// ---------------------------------------------------------------------------
// makeFilePublic
// ---------------------------------------------------------------------------

/**
 * Grant public read access to a Drive file.
 * @returns The webContentLink (direct download URL).
 */
export async function makeFilePublic(fileId: string): Promise<string> {
  const drive = getDrive()

  await drive.permissions.create({
    fileId,
    supportsAllDrives: true,
    requestBody: {
      role: 'reader',
      type: 'anyone',
    },
  })

  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2000`
}
