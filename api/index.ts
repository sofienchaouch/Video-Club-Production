import app from "../server";

export default async function handler(req: any, res: any) {
  try {
    if (req.url && !req.url.startsWith("/api")) {
      req.url = `/api${req.url.startsWith("/") ? "" : "/"}${req.url}`;
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

