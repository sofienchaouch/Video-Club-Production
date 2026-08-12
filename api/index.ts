import app from "../server";

// Disable Vercel's default body parser so Express can handle it
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  try {
    if (req.url && !req.url.startsWith("/api")) {
      req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
    }
    
    // Vercel Serverless Functions automatically parse the body.
    // We must flag it so Express body-parser doesn't hang waiting for a consumed stream.
    if (req.body && Object.keys(req.body).length > 0) {
      req._body = true; 
    }

    return app(req, res);
  } catch (err: any) {
    console.error("[Vercel Serverless Function Error]:", err);
    return res.status(500).json({
      error: "Internal Server Error",
      message: err?.message || "An unexpected error occurred in serverless function handler."
    });
  }
}

