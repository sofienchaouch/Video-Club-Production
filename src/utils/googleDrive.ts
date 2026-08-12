export function formatGoogleDriveLink(url: string, type: 'video' | 'image' = 'image'): string {
  if (!url || typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  try {
    let fileId = "";

    // 1. Check for explicit id= parameter anywhere in the query string
    const idMatch = trimmed.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (idMatch && idMatch[1]) {
      fileId = idMatch[1];
    } else {
      // 2. Check for path-based file ID (/file/d/FILE_ID, /d/FILE_ID, etc.)
      const pathMatch = trimmed.match(/(?:drive\.google\.com\/(?:file\/d\/|open\?id=)|docs\.google\.com\/(?:document|presentation|spreadsheets)\/d\/|lh3\.googleusercontent\.com\/d\/)([a-zA-Z0-9_-]+)/);
      if (pathMatch && pathMatch[1]) {
        fileId = pathMatch[1];
      }
    }

    if (fileId) {
      if (type === 'image') {
        // High quality thumbnail API that handles CORS cleanly for <img> tags
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w2500`;
      }
      
      // Direct stream export for video elements
      return `https://drive.google.com/uc?export=download&id=${fileId}`;
    }
  } catch (e) {
    console.error("Failed to parse Google Drive link:", e);
  }

  return trimmed;
}
