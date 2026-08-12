import app from "../server";

export default function handler(req: any, res: any) {
  try {
    return app(req, res);
  } catch (err: any) {
    console.error("Fatal error in Vercel API Handler:", err);
    if (!res.headersSent) {
      res.status(500).json({ error: "Internal server error in API function", details: err?.message });
    }
  }
}
