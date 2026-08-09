import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function: createSharePage
 * 
 * Receives { imageUrl, id } and stores the OG metadata in Firestore.
 * The share page is served by Firebase Hosting rewrites → the sharePage function.
 */
export const createSharePage = functions.https.onCall(
  async (request: functions.https.CallableRequest<{ imageUrl: string; id: string }>) => {
    const { imageUrl, id } = request.data;

    if (!imageUrl || !id) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'imageUrl and id are required',
      );
    }

    // Store share data
    await db.collection('shares').doc(id).set({
      imageUrl,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // The share URL is served by the sharePage function via Hosting rewrite
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || '';
    const shareUrl = `https://${projectId}.web.app/share/${id}`;

    return { shareUrl };
  },
);

/**
 * Cloud Function: sharePage
 * 
 * Serves a minimal HTML page with og:image meta tags for X card previews.
 * Auto-redirects humans to the main app after 1s.
 */
export const sharePage = functions.https.onRequest(async (req, res) => {
  // Extract ID from path: /share/{id}
  const pathParts = req.path.split('/').filter(Boolean);
  const id = pathParts[pathParts.length - 1];

  if (!id) {
    res.redirect('/');
    return;
  }

  try {
    const doc = await db.collection('shares').doc(id).get();
    
    if (!doc.exists) {
      res.redirect('/');
      return;
    }

    const data = doc.data()!;
    const imageUrl = data.imageUrl;

    // Determine the main app URL
    const projectId = process.env.GCLOUD_PROJECT || process.env.GCP_PROJECT || '';
    const appUrl = `https://${projectId}.web.app`;

    res.status(200).send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>I'm building at HH Goa 2026</title>
  <meta property="og:title" content="I'm building at HH Goa 2026" />
  <meta property="og:description" content="Hacker House Goa 2026 · 28–31 Oct · 500 elite builders on the sand. #FrameInGoa" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:image:width" content="720" />
  <meta property="og:image:height" content="960" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="I'm building at HH Goa 2026" />
  <meta name="twitter:description" content="Hacker House Goa 2026 · #FrameInGoa" />
  <meta name="twitter:image" content="${imageUrl}" />
  <meta http-equiv="refresh" content="1;url=${appUrl}" />
  <style>
    body { background: #0B1710; color: #F1E7CE; font-family: monospace; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; }
  </style>
</head>
<body>
  <p>Redirecting to HH Goa 2026…</p>
  <script>setTimeout(function(){ window.location.href = "${appUrl}"; }, 1000);</script>
</body>
</html>`);
  } catch (error) {
    console.error('Error serving share page:', error);
    res.redirect('/');
  }
});
