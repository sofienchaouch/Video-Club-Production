import express from "express";
import path from "path";
import crypto from "crypto";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs/promises";

dotenv.config();

// Security & Authentication Helpers
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";
const ADMIN_SECRET = process.env.ADMIN_SECRET || process.env.ADMIN_PASSWORD || "video-club-vault-secret-2026-key";

// In-Memory Rate Limiting for Admin Login
const loginFailures = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = loginFailures.get(ip);
  if (!record) return false;
  if (now > record.resetTime) {
    loginFailures.delete(ip);
    return false;
  }
  return record.count >= 5; // Lock out after 5 failures in 15 minutes
}

function recordLoginFailure(ip: string) {
  const now = Date.now();
  const record = loginFailures.get(ip) || { count: 0, resetTime: now + 15 * 60 * 1000 };
  record.count += 1;
  loginFailures.set(ip, record);
}

function clearLoginFailure(ip: string) {
  loginFailures.delete(ip);
}

// Timing-safe password comparison
function checkAdminPassword(input: string): boolean {
  if (!input || typeof input !== "string") return false;
  const inputBuf = Buffer.from(input, "utf-8");
  const expectedBuf = Buffer.from(ADMIN_PASSWORD, "utf-8");
  if (inputBuf.length !== expectedBuf.length) return false;
  return crypto.timingSafeEqual(inputBuf, expectedBuf);
}

// Signed session token creation and verification
function createAdminToken(): string {
  const expiresAt = Date.now() + 7 * 24 * 60 * 60 * 1000; // 7 days expiration
  const payload = `${expiresAt}`;
  const signature = crypto.createHmac("sha256", ADMIN_SECRET).update(payload).digest("hex");
  return `${payload}.${signature}`;
}

function isValidAdminToken(token: any): boolean {
  if (!token || typeof token !== "string") return false;

  // Backward compatibility with legacy token format
  if (token === `auth-${ADMIN_PASSWORD}`) return true;

  const parts = token.split(".");
  if (parts.length !== 2) return false;

  const [expiresAtStr, signature] = parts;
  const expiresAt = parseInt(expiresAtStr, 10);
  if (isNaN(expiresAt) || Date.now() > expiresAt) return false;

  const expectedSignature = crypto.createHmac("sha256", ADMIN_SECRET).update(expiresAtStr).digest("hex");
  
  try {
    const sigBuf = Buffer.from(signature, "hex");
    const expBuf = Buffer.from(expectedSignature, "hex");
    if (sigBuf.length !== expBuf.length) return false;
    return crypto.timingSafeEqual(sigBuf, expBuf);
  } catch {
    return false;
  }
}

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Helper to check if a buffer is a valid image or media file
function isValidMediaBuffer(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 4) return false;
  // JPEG: FF D8 FF
  if (buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF) return true;
  // PNG: 89 50 4E 47
  if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4E && buffer[3] === 0x47) return true;
  // GIF: GIF8
  if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) return true;
  // WebP/RIFF
  if (buffer[0] === 0x52 && buffer[1] === 0x49 && buffer[2] === 0x46 && buffer[3] === 0x46) return true;
  // SVG or XML
  const headStr = buffer.slice(0, 100).toString("utf-8").toLowerCase();
  if (headStr.includes("<svg") || headStr.includes("<?xml")) return true;
  // MP4 or video header (ftyp or zero bytes)
  if (headStr.includes("ftyp") || buffer[0] === 0x00) return true;
  return false;
}

// Fallback Unsplash image URLs for self-healing standard upload assets
const DEFAULT_MEDIA_FALLBACKS: Record<string, string> = {
  "hero-1.jpg": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1920&q=80",
  "p8.jpg": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80",
  "p10.jpg": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
  "p11.jpg": "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=1200&q=80",
  "p12.jpg": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
  "studio-plateau.jpg": "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1600&q=80",
  "studio-podcast.jpg": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1600&q=80",
  "team-female.jpg": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  "team-male.jpg": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80"
};

// Self-healing check for standard upload assets
async function verifyAndRepairUploadAssets() {
  const folders = [
    path.join(process.cwd(), "uploads"),
    path.join(process.cwd(), "public", "uploads")
  ];

  for (const folder of folders) {
    await fs.mkdir(folder, { recursive: true }).catch(() => {});
    for (const [filename, fallbackUrl] of Object.entries(DEFAULT_MEDIA_FALLBACKS)) {
      const filePath = path.join(folder, filename);
      let isValid = false;
      try {
        const stats = await fs.stat(filePath);
        if (stats.size > 1000) {
          const handle = await fs.open(filePath, "r");
          const buf = Buffer.alloc(100);
          await handle.read(buf, 0, 100, 0);
          await handle.close();
          isValid = isValidMediaBuffer(buf);
        }
      } catch (err) {
        isValid = false;
      }

      if (!isValid) {
        console.warn(`[Image System] File ${filePath} is missing or corrupt. Restoring from fallback...`);
        try {
          const resp = await fetch(fallbackUrl, { headers: { "User-Agent": "Mozilla/5.0" } });
          if (resp.ok) {
            const arrayBuf = await resp.arrayBuffer();
            const buffer = Buffer.from(arrayBuf);
            await fs.writeFile(filePath, buffer);
            console.log(`[Image System] Successfully restored ${filename} in ${folder}`);
          }
        } catch (downloadErr) {
          console.error(`[Image System] Failed to restore ${filename}:`, downloadErr);
        }
      }
    }
  }
}

// Run self-healing check on boot (only in non-serverless environments)
if (!process.env.VERCEL) {
  verifyAndRepairUploadAssets().catch((err) => {
    console.error("Error in verifyAndRepairUploadAssets:", err);
  });
}

// Serve uploaded files statically from both uploads and public/uploads
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/uploads", express.static(path.join(process.cwd(), "public", "uploads")));

app.post("/api/admin/upload-image", async (req, res) => {
  try {
    const { token, filename, base64Data } = req.body;

    // Validate admin token
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    if (!base64Data || !filename) {
      return res.status(400).json({ error: "Missing base64Data or filename for upload." });
    }

    // Strip out any base64 header (e.g. "data:image/png;base64,") cleanly
    let pureBase64 = String(base64Data)
      .replace(/^data:[^;]+(;[^;]+)*;base64,/, "")
      .trim()
      .replace(/\s/g, "");

    if (!pureBase64) {
      return res.status(400).json({ error: "Empty base64 image data payload." });
    }

    const buffer = Buffer.from(pureBase64, "base64");
    if (!buffer || buffer.length === 0) {
      return res.status(400).json({ error: "Decoded image file is empty." });
    }

    // Verify magic bytes
    if (!isValidMediaBuffer(buffer)) {
      console.warn(`[Upload Warning] Uploaded file '${filename}' does not have standard media header magic bytes.`);
    }

    // Generate unique name
    const ext = path.extname(filename) || ".png";
    const base = path.basename(filename, ext).replace(/[^a-zA-Z0-9_-]/g, "");
    const uniqueFilename = `${base}_${Date.now()}${ext}`;
    const uploadDir1 = path.join(process.cwd(), "uploads");
    const uploadDir2 = path.join(process.cwd(), "public", "uploads");

    await fs.mkdir(uploadDir1, { recursive: true });
    await fs.mkdir(uploadDir2, { recursive: true });

    const targetPath1 = path.join(uploadDir1, uniqueFilename);
    const targetPath2 = path.join(uploadDir2, uniqueFilename);

    await fs.writeFile(targetPath1, buffer);
    await fs.writeFile(targetPath2, buffer);

    const fileUrl = `/uploads/${uniqueFilename}`;
    console.log(`Image uploaded successfully: ${fileUrl} (${buffer.length} bytes)`);
    return res.json({ success: true, url: fileUrl });
  } catch (err: any) {
    console.error("Error handling image upload:", err);
    return res.status(500).json({ error: "Failed to upload image.", details: err.message });
  }
});

const PORT = 3000;

// Lazy-initialized Gemini client
let aiClient: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in environment variables.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Helper for resilient generation with automatic retries and model fallback to handle 503 high demand errors
async function generateContentWithFallback(
  ai: GoogleGenAI,
  contents: string,
  config: any,
  retries = 2
) {
  const models = ["gemini-3.5-flash", "gemini-flash-latest"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 0; attempt <= retries; attempt++) {
      try {
        console.log(`[Gemini API] Requesting ${model} (Attempt ${attempt + 1}/${retries + 1})...`);
        const response = await ai.models.generateContent({
          model,
          contents,
          config,
        });
        if (response && response.text) {
          console.log(`[Gemini API] Success with ${model}`);
          return response;
        }
        throw new Error("Empty response received from Gemini.");
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[Gemini API] Warning: ${model} failed on attempt ${attempt + 1}:`,
          err.message || err
        );

        // If it's a client error (like 400 Bad Request / Schema validation), retrying won't help
        const status = err.status || err.statusCode || (err.error && err.error.code);
        if (status === 400) {
          console.warn("[Gemini API] Bad Request error (400), skipping retries.");
          break;
        }

        if (attempt < retries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff starting at 1000ms
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  throw lastError;
}

// Helper to check file existence
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

const DYNAMIC_TRANSLATIONS_PATH = process.env.VERCEL
  ? path.join("/tmp", "dynamic_translations.json")
  : path.join(process.cwd(), "dynamic_translations.json");
const DYNAMIC_ESTIMATOR_PATH = process.env.VERCEL
  ? path.join("/tmp", "dynamic_estimator.json")
  : path.join(process.cwd(), "dynamic_estimator.json");
const DYNAMIC_AGENCY_SETTINGS_PATH = process.env.VERCEL
  ? path.join("/tmp", "dynamic_agency_settings.json")
  : path.join(process.cwd(), "dynamic_agency_settings.json");

// Admin Login Route
app.post("/api/admin/login", (req, res) => {
  const clientIp = (req.headers["x-forwarded-for"] as string) || req.socket?.remoteAddress || req.ip || "client-ip";
  
  if (isRateLimited(clientIp)) {
    return res.status(429).json({ error: "Too many failed login attempts. Please try again in 15 minutes." });
  }

  const { password } = req.body;
  if (checkAdminPassword(password)) {
    clearLoginFailure(clientIp);
    const token = createAdminToken();
    return res.json({ token, success: true });
  }

  recordLoginFailure(clientIp);
  return res.status(401).json({ error: "Invalid password. Access denied." });
});

// GET Dynamic Estimator Config
app.get("/api/estimator/config", async (req, res) => {
  try {
    if (await fileExists(DYNAMIC_ESTIMATOR_PATH)) {
      const data = await fs.readFile(DYNAMIC_ESTIMATOR_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    return res.json({}); // Return empty if no custom configurations yet
  } catch (err: any) {
    console.error("Error reading custom estimator config:", err);
    return res.status(500).json({ error: "Failed to load custom estimator config." });
  }
});

// POST Dynamic Estimator Config
app.post("/api/estimator/config", async (req, res) => {
  try {
    const { token, config } = req.body;

    // Auth validation
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    if (!config || typeof config !== "object") {
      return res.status(400).json({ error: "Invalid estimator config object." });
    }

    await fs.writeFile(DYNAMIC_ESTIMATOR_PATH, JSON.stringify(config, null, 2), "utf-8");
    return res.json({ success: true, message: "Estimator configuration updated successfully." });
  } catch (err: any) {
    console.error("Error saving custom estimator config:", err);
    return res.status(500).json({ error: "Failed to save custom estimator config.", details: err.message });
  }
});

// Helper to read agency settings
async function readAgencySettings(): Promise<any> {
  const defaultSettings = {
    heroImages: [
      "/uploads/VA_1302227-scaled_1786452312112.jpg",
      "/uploads/hero-1.jpg",
      "/uploads/studio-podcast.jpg"
    ],
    mapsLocation: {
      iframeQuery: "Video Club Production Ennasr 2 Ariana Tunisia",
      directionsUrl: "https://maps.app.goo.gl/wpghGfG57A8rkCd2A",
      addressTextAr: "24 نهج خليج القمر، النصر 2، أريانة 2037، تونس",
      addressTextEn: "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia",
      addressTextFr: "24 Rue Khalij El Kamar, Ennasr 2, Ariana 2037, Tunisia"
    },
    contactInfo: {
      phone: "(+216) 54 610 546",
      phoneTel: "+21654610546",
      email: "videoclubproduction11@gmail.com",
      whatsapp: "https://wa.me/21654610546?text=Bonjour%20Video%20Club%20Production",
      instagram: "https://instagram.com/videoclubproduction",
      facebook: "https://facebook.com/videoclubproduction",
      linkedin: "https://linkedin.com/company/videoclubproduction"
    },
    portfolioImages: {
      "company-presentation": "/uploads/two-diverse-businessmen-making-a-pitch-during-a-meeting-with-shareholders-after-hours-presenting-budget-numbers-and-other-resources-discussing-multinational-company-growth-strategy-camera-a-video_1786452512234.jpg",
      "instagram-reels": "/uploads/reels-logo_1786452504898.webp",
      "fashion-videos": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
      "youtube-videos": "/uploads/yt_1786452504238.jpeg",
      "padel-videos": "/uploads/GettyImages-1423558556_1786452503737.avif",
      "interview-videos": "https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80",
      "elyssar-haute-couture": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
      "cartagina-heritage-film": "https://images.unsplash.com/photo-1533105079780-92b9be482077?auto=format&fit=crop&w=1200&q=80",
      "video-club-showcase-svZNfyC6C78": "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
      "auguste-lookbook": "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80"
    },
    teamImages: {},
    studioTourImages: {
      "plateau": "/uploads/Firefly_surcetteimageenlevezlesfilsnonsouhaitsacotelevezlesboutsdescotch4327291_1786452883842.png",
      "podcast": "/uploads/studio-podcast.jpg"
    },
    agencyLogo: "/uploads/Fichier-42x_1786452239382.png",
    presentationVideoUrl: "/uploads/presentation-video.mp4",
    customProjects: [],
    customTeam: [],
    customFaqs: [],
    partnerLogos: [],
    googleConnection: {
      accessToken: "",
      adminEmail: "",
      connectedAt: ""
    }
  };

  try {
    if (await fileExists(DYNAMIC_AGENCY_SETTINGS_PATH)) {
      const data = await fs.readFile(DYNAMIC_AGENCY_SETTINGS_PATH, "utf-8");
      const parsed = JSON.parse(data);
      return {
        ...defaultSettings,
        ...parsed,
        mapsLocation: { ...defaultSettings.mapsLocation, ...(parsed.mapsLocation || {}) },
        contactInfo: { ...defaultSettings.contactInfo, ...(parsed.contactInfo || {}) },
        portfolioImages: { ...defaultSettings.portfolioImages, ...(parsed.portfolioImages || {}) },
        teamImages: { ...defaultSettings.teamImages, ...(parsed.teamImages || {}) },
        studioTourImages: { ...defaultSettings.studioTourImages, ...(parsed.studioTourImages || {}) },
        customProjects: parsed.customProjects || [],
        customTeam: parsed.customTeam || [],
        customFaqs: parsed.customFaqs || [],
        partnerLogos: parsed.partnerLogos || [],
        googleConnection: { ...defaultSettings.googleConnection, ...(parsed.googleConnection || {}) }
      };
    }
  } catch (err) {
    console.error("Error loading agency settings file:", err);
  }
  return defaultSettings;
}

// GET Dynamic Agency Settings (Images and Map)
app.get("/api/agency-settings", async (req, res) => {
  try {
    const settings = await readAgencySettings();
    return res.json(settings);
  } catch (err: any) {
    console.error("Error reading agency settings:", err);
    return res.status(500).json({ error: "Failed to load agency settings." });
  }
});

// POST Dynamic Agency Settings (Updates)
app.post("/api/agency-settings", async (req, res) => {
  try {
    const { token, settings } = req.body;
    
    // Auth validation
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    if (!settings || typeof settings !== "object") {
      return res.status(400).json({ error: "Invalid settings object." });
    }

    await fs.writeFile(DYNAMIC_AGENCY_SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
    return res.json({ success: true, message: "Agency settings updated successfully." });
  } catch (err: any) {
    console.error("Error saving custom agency settings:", err);
    return res.status(500).json({ error: "Failed to save agency settings.", details: err.message });
  }
});

// GET Dynamic Translations
app.get("/api/translations", async (req, res) => {
  try {
    if (await fileExists(DYNAMIC_TRANSLATIONS_PATH)) {
      const data = await fs.readFile(DYNAMIC_TRANSLATIONS_PATH, "utf-8");
      return res.json(JSON.parse(data));
    }
    return res.json({}); // Default empty if no customized translations exist yet
  } catch (err: any) {
    console.error("Error reading custom translations:", err);
    return res.status(500).json({ error: "Failed to load custom translations." });
  }
});

// POST Dynamic Translations (Updates)
app.post("/api/translations", async (req, res) => {
  try {
    const { token, translations } = req.body;
    
    // Auth validation
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    if (!translations || typeof translations !== "object") {
      return res.status(400).json({ error: "Invalid translations object." });
    }

    await fs.writeFile(DYNAMIC_TRANSLATIONS_PATH, JSON.stringify(translations, null, 2), "utf-8");
    return res.json({ success: true, message: "Translations updated successfully." });
  } catch (err: any) {
    console.error("Error saving custom translations:", err);
    return res.status(500).json({ error: "Failed to save custom translations.", details: err.message });
  }
});

// POST Auto-Translate Endpoint
app.post("/api/translate", async (req, res) => {
  try {
    const { text, from, targets } = req.body;
    if (!text || !from || !targets || !Array.isArray(targets)) {
      return res.status(400).json({ error: "Missing required translation fields: text, from, and targets (array)." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (keyErr: any) {
      console.warn("Gemini client initialization failed:", keyErr.message);
      return res.status(503).json({
        error: "Gemini API key is missing. Please add your GEMINI_API_KEY in the Secrets panel in the Settings menu."
      });
    }

    // Prepare system instructions for precise, minimal translation
    const systemInstruction = `
      You are an expert translator at a professional boutique video production agency.
      Translate the given text from language code "${from}" to the target language codes: ${targets.join(", ")}.
      Return the output as a clean, valid JSON object where the keys are the target language codes and the values are the exact translations. Do not include any extra text, thoughts, explanations, or formatting. Only return the JSON object.
      Example structure:
      {
        "fr": "Translation in French",
        "ar": "Translation in Arabic"
      }
    `;

    const prompt = `Translate this text: "${text}"`;

    const response = await generateContentWithFallback(ai, prompt, {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.1, // Low temperature for high precision and exact translation
    });

    let jsonText = response.text || "";
    if (jsonText.startsWith("```")) {
      jsonText = jsonText.replace(/^```[a-zA-Z]*\n/, "").replace(/\n```$/, "").trim();
    }

    const parsedTranslations = JSON.parse(jsonText);
    return res.json({ success: true, translations: parsedTranslations });
  } catch (err: any) {
    console.error("Error in translation API:", err);
    return res.status(500).json({
      error: "Failed to auto-translate content.",
      details: err.message
    });
  }
});

const DYNAMIC_LEADS_PATH = process.env.VERCEL
  ? path.join("/tmp", "dynamic_leads.json")
  : path.join(process.cwd(), "dynamic_leads.json");

// Helper to read leads
async function readLeads(): Promise<any[]> {
  try {
    if (await fileExists(DYNAMIC_LEADS_PATH)) {
      const data = await fs.readFile(DYNAMIC_LEADS_PATH, "utf-8");
      return JSON.parse(data);
    }
    return [];
  } catch (err) {
    console.error("Error reading leads file, returning empty array:", err);
    return [];
  }
}

// Helper to write leads
async function writeLeads(leads: any[]): Promise<void> {
  await fs.writeFile(DYNAMIC_LEADS_PATH, JSON.stringify(leads, null, 2), "utf-8");
}

// Helper to get or dynamically create the Google Sheets leads database
async function getOrCreateLeadsSpreadsheet(accessToken: string): Promise<string> {
  const settings = await readAgencySettings();
  if (settings.googleConnection?.leadsSpreadsheetId) {
    return settings.googleConnection.leadsSpreadsheetId;
  }

  try {
    // 1. Search for existing sheet in Drive
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Video%20Club%20Production%20-%20Leads%20Database'%20and%20mimeType='application/vnd.google-apps.spreadsheet'%20and%20trashed=false`;
    const searchRes = await fetch(searchUrl, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const existingId = searchData.files[0].id;
        // Persist spreadsheet ID in agency settings
        settings.googleConnection.leadsSpreadsheetId = existingId;
        await fs.writeFile(DYNAMIC_AGENCY_SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
        return existingId;
      }
    }

    // 2. Not found, create a new one using Google Sheets API
    const createRes = await fetch("https://sheets.googleapis.com/v1/spreadsheets", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        properties: { title: "Video Club Production - Leads Database" }
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Failed to create Google Spreadsheet: ${errText}`);
    }

    const newSheet = await createRes.json();
    const newId = newSheet.spreadsheetId;

    // Persist spreadsheet ID
    settings.googleConnection.leadsSpreadsheetId = newId;
    await fs.writeFile(DYNAMIC_AGENCY_SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");

    // 3. Write header row
    const headers = [
      "Inquiry ID",
      "Created At",
      "Name",
      "Email",
      "Phone",
      "Status",
      "Pack ID",
      "Estimated Total",
      "Booking Date",
      "Booking Time",
      "Message"
    ];

    await fetch(`https://sheets.googleapis.com/v1/spreadsheets/${newId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: [headers] })
    });

    return newId;
  } catch (err) {
    console.error("Error in getOrCreateLeadsSpreadsheet:", err);
    throw err;
  }
}

// Helper to sync lead rows to Google Sheets dynamically
async function syncLeadToGoogleSheets(lead: any) {
  try {
    const settings = await readAgencySettings();
    const google = settings.googleConnection;
    if (!google || !google.accessToken) {
      console.log("Google Connection not configured. Skipping Sheets sync.");
      return;
    }

    const spreadsheetId = await getOrCreateLeadsSpreadsheet(google.accessToken);
    
    let displayDate = lead.bookingDate || "";
    let displayTime = lead.bookingTime || "";
    if (lead.bookingSessions && Array.isArray(lead.bookingSessions) && lead.bookingSessions.length > 0) {
      displayDate = lead.bookingSessions.map((s: any) => s.date).join(", ");
      displayTime = lead.bookingSessions.map((s: any) => s.time).join(", ");
    }

    const row = [
      lead.id,
      lead.createdAt,
      lead.name,
      lead.email,
      lead.phone || "",
      lead.status,
      lead.packId || "",
      lead.estimatedTotal ? `${lead.estimatedTotal} TND` : "",
      displayDate,
      displayTime,
      lead.message || ""
    ];

    const response = await fetch(`https://sheets.googleapis.com/v1/spreadsheets/${spreadsheetId}/values/Sheet1!A1:append?valueInputOption=USER_ENTERED`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${google.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ values: [row] })
    });

    if (response.ok) {
      console.log(`Lead ${lead.id} synced to Google Sheets successfully.`);
    } else {
      const errDetails = await response.json().catch(() => ({}));
      console.error("Failed to sync lead to Google Sheets:", errDetails);
    }
  } catch (err) {
    console.error("Error in syncLeadToGoogleSheets:", err);
  }
}

// Helper to get or dynamically create the Google Drive folders for Production briefs
async function getOrCreateDriveFolder(accessToken: string): Promise<string> {
  const settings = await readAgencySettings();
  if (settings.googleConnection?.briefsFolderId) {
    return settings.googleConnection.briefsFolderId;
  }

  try {
    // 1. Search for existing folder in Drive
    const searchUrl = `https://www.googleapis.com/drive/v3/files?q=name='Video%20Club%20Production%20Briefs'%20and%20mimeType='application/vnd.google-apps.folder'%20and%20trashed=false`;
    const searchRes = await fetch(searchUrl, {
      headers: { "Authorization": `Bearer ${accessToken}` }
    });

    if (searchRes.ok) {
      const searchData = await searchRes.json();
      if (searchData.files && searchData.files.length > 0) {
        const existingId = searchData.files[0].id;
        settings.googleConnection.briefsFolderId = existingId;
        await fs.writeFile(DYNAMIC_AGENCY_SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");
        return existingId;
      }
    }

    // 2. Not found, create folder
    const createRes = await fetch("https://www.googleapis.com/drive/v3/files", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: "Video Club Production Briefs",
        mimeType: "application/vnd.google-apps.folder"
      })
    });

    if (!createRes.ok) {
      const errText = await createRes.text();
      throw new Error(`Failed to create Google Drive folder: ${errText}`);
    }

    const folder = await createRes.json();
    const folderId = folder.id;

    // Persist briefs folder ID
    settings.googleConnection.briefsFolderId = folderId;
    await fs.writeFile(DYNAMIC_AGENCY_SETTINGS_PATH, JSON.stringify(settings, null, 2), "utf-8");

    return folderId;
  } catch (err) {
    console.error("Error in getOrCreateDriveFolder:", err);
    throw err;
  }
}

function formatFullDateWithDayName(dateStr: string, customDayLabel?: string): string {
  if (customDayLabel && customDayLabel.length > 2) {
    if (customDayLabel.includes(dateStr)) return customDayLabel;
    return `${customDayLabel} (${dateStr})`;
  }
  if (!dateStr) return "";
  try {
    const d = new Date(`${dateStr}T00:00:00`);
    if (isNaN(d.getTime())) return dateStr;
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const dayName = weekdays[d.getDay()];
    const dateNum = d.getDate();
    const monthName = months[d.getMonth()];
    const year = d.getFullYear();
    return `${dayName}, ${dateNum} ${monthName} ${year} (${dateStr})`;
  } catch (err) {
    return dateStr;
  }
}

// Helper to upload a text-based creative/production brief directly to Google Drive
async function uploadBriefToGoogleDrive(lead: any) {
  try {
    const settings = await readAgencySettings();
    const google = settings.googleConnection;
    if (!google || !google.accessToken) {
      console.log("Google Connection not configured. Skipping Drive Brief upload.");
      return;
    }

    const folderId = await getOrCreateDriveFolder(google.accessToken);
    
    // Construct brief content text
    const dateStr = new Date(lead.createdAt).toLocaleString("en-US", { timeZone: "Africa/Tunis" });
    const briefContent = `==================================================================
VIDEO CLUB PRODUCTION BRIEF
==================================================================
Inquiry ID      : ${lead.id}
Created At      : ${dateStr} (Africa/Tunis Time)
Status          : ${lead.status.toUpperCase()}

CLIENT INFORMATION:
-------------------
Name            : ${lead.name}
Email           : ${lead.email}
Phone           : ${lead.phone || "Not specified"}

PRODUCTION DETAILS:
-------------------
Selected Pack   : ${lead.packId ? lead.packId.toUpperCase() : "Custom Estimation"}
Estimated Total : ${lead.estimatedTotal ? `${lead.estimatedTotal} TND` : "Custom"}
${lead.bookingSessions && Array.isArray(lead.bookingSessions) && lead.bookingSessions.length > 0 
  ? `Booked Sessions :\n${lead.bookingSessions.map((s: any, idx: number) => `  [Session ${idx + 1}] ${formatFullDateWithDayName(s.date, s.dayLabel)} @ ${s.time}`).join("\n")}`
  : `Booking Date    : ${formatFullDateWithDayName(lead.bookingDate, lead.bookingDayLabel) || "No session scheduled"}\nBooking Time    : ${lead.bookingTime || ""}`
}

SELECTED COMPONENTS BREAKDOWN:
------------------------------
${lead.selectedItems && Array.isArray(lead.selectedItems) 
  ? lead.selectedItems.map((item: any, idx: number) => {
      if (typeof item === 'object') {
        return `[${idx + 1}] ${item.name || item.id} (Qty: ${item.quantity || 1}, Unit: ${item.unitType || "N/A"}, Price: ${item.basePrice || 0} TND, Total: ${item.cost || 0} TND)`;
      }
      return `[${idx + 1}] ${item}`;
    }).join("\n") 
  : "None Specified"}

CLIENT BRIEF NOTES & MESSAGE:
-----------------------------
${lead.message || "No custom message or brief notes were added."}

==================================================================
End of Brief. Thank you for choosing Video Club Production.
==================================================================`;

    const fileName = `Brief_${lead.name.replace(/\s+/g, "_")}_${lead.id}.txt`;

    // Multipart/related POST for metadata and payload
    const boundary = "314159265358979323846";
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const metadata = {
      name: fileName,
      parents: [folderId],
      mimeType: "text/plain"
    };

    const multipartBody = 
      delimiter +
      "Content-Type: application/json; charset=UTF-8\r\n\r\n" +
      JSON.stringify(metadata) +
      delimiter +
      "Content-Type: text/plain; charset=UTF-8\r\n\r\n" +
      briefContent +
      closeDelimiter;

    const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${google.accessToken}`,
        "Content-Type": `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    });

    if (response.ok) {
      const fileData = await response.json();
      console.log(`Brief successfully uploaded to Google Drive. File ID: ${fileData.id}`);
    } else {
      const errDetails = await response.json().catch(() => ({}));
      console.error("Failed to upload brief to Google Drive:", errDetails);
    }
  } catch (err) {
    console.error("Error in uploadBriefToGoogleDrive:", err);
  }
}

// Helper to insert a premium session event directly into the connected Admin's Google Calendar
async function createGoogleCalendarEvent(lead: any) {
  try {
    const settings = await readAgencySettings();
    const google = settings.googleConnection;
    if (!google || !google.accessToken) {
      console.log("Google Connection not configured. Skipping Calendar Event creation.");
      return;
    }

    const sessions = lead.bookingSessions && Array.isArray(lead.bookingSessions) && lead.bookingSessions.length > 0
      ? lead.bookingSessions
      : (lead.bookingDate && lead.bookingTime ? [{ date: lead.bookingDate, time: lead.bookingTime }] : []);

    if (sessions.length === 0) {
      return;
    }

    for (const s of sessions) {
      const startHour = s.time.includes(" - ") ? s.time.split(" - ")[0] : s.time;
      const [sh, sm] = startHour.split(":");
      
      let eh = String(Number(sh) + 1).padStart(2, "0");
      let em = sm;
      if (s.time.includes(" - ")) {
        const endHourPart = s.time.split(" - ")[1];
        if (endHourPart.includes(":")) {
          [eh, em] = endHourPart.split(":");
        }
      }

      const selectedItemsText = lead.selectedItems && Array.isArray(lead.selectedItems)
        ? lead.selectedItems.map((item: any, idx: number) => {
            if (typeof item === 'object') {
              return `  - ${item.name || item.id} (Qty: ${item.quantity || 1}, Price: ${item.basePrice || 0} TND, Total: ${item.cost || 0} TND)`;
            }
            return `  - ${item}`;
          }).join("\n")
        : "  None";

      const eventBody = {
        summary: `🎥 Video Club Session: ${lead.name} - ${lead.packId ? lead.packId.toUpperCase() : "Custom Estimation"}`,
        description: `Video Club Production Booking Details:\n\nClient: ${lead.name}\nEmail: ${lead.email}\nPhone: ${lead.phone || "N/A"}\nPack: ${lead.packId ? lead.packId.toUpperCase() : "Custom Estimation"}\nEstimated Total: ${lead.estimatedTotal ? `${lead.estimatedTotal} TND` : "Custom"}\n\nSelected Budget Components:\n${selectedItemsText}\n\nMessage/Brief Notes:\n${lead.message || "No message provided."}`,
        start: {
          dateTime: `${s.date}T${startHour}:00`,
          timeZone: "Africa/Tunis"
        },
        end: {
          dateTime: `${s.date}T${eh}:${em}:00`,
          timeZone: "Africa/Tunis"
        },
        reminders: {
          useDefault: true
        }
      };

      const response = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${google.accessToken}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(eventBody)
      });

      if (response.ok) {
        const event = await response.json();
        console.log(`Successfully created Google Calendar event: ${event.htmlLink}`);
      } else {
        const errDetails = await response.json().catch(() => ({}));
        console.error("Failed to create Google Calendar event:", errDetails);
      }
    }
  } catch (err) {
    console.error("Error creating Google Calendar event:", err);
  }
}

// Helper to send a Gmail notification to the admin using Google Gmail API
async function sendGmailNotification(lead: any) {
  try {
    const settings = await readAgencySettings();
    const google = settings.googleConnection;
    if (!google || !google.accessToken || !google.adminEmail) {
      console.log("Google Connection not configured or missing parameters. Skipping email notification.");
      return;
    }

    // Prepare email HTML content
    const hasSessions = lead.bookingSessions && Array.isArray(lead.bookingSessions) && lead.bookingSessions.length > 0;
    const isBooking = (lead.bookingDate && lead.bookingTime) || hasSessions;
    const title = isBooking ? "New Session Booking" : "New Contact Inquiry";
    
    let htmlContent = `
      <div style="font-family: sans-serif; padding: 25px; color: #1e293b; max-width: 600px; margin: auto; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);">
        <h2 style="color: #ca8a04; border-bottom: 2px solid #ca8a04; padding-bottom: 12px; margin-top: 0; font-size: 20px;">🎥 ${title} - Video Club Production</h2>
        <p style="font-size: 14px; line-height: 1.5; color: #475569;">A new submission has been captured from your website. Below are the registered inquiry parameters:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px; font-size: 13px;">
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; width: 35%; color: #64748b;">Client Name:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a; font-weight: 500;">${lead.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">Email Address:</td>
            <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #ca8a04; font-weight: 500;"><a href="mailto:${lead.email}" style="color: #ca8a04; text-decoration: none;">${lead.email}</a></td>
          </tr>
    `;

    if (lead.phone) {
      htmlContent += `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">Phone Number:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #0f172a;">${lead.phone}</td>
        </tr>
      `;
    }

    if (lead.packId) {
      htmlContent += `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">Selected Pack:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #ca8a04; font-weight: bold; text-transform: uppercase;">${lead.packId}</td>
        </tr>
      `;
    }

    if (lead.estimatedTotal) {
      htmlContent += `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b;">Estimated Budget:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #16a34a; font-weight: bold; font-size: 15px;">${lead.estimatedTotal} TND</td>
        </tr>
      `;
    }

    if (isBooking) {
      if (hasSessions) {
        htmlContent += `
          <tr style="background-color: #fef08a;">
            <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #854d0e; border-radius: 6px 0 0 6px; vertical-align: top;">📅 Booked Sessions:</td>
            <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #854d0e; border-radius: 0 6px 6px 0;">
              <ul style="margin: 0; padding-left: 15px; font-family: monospace;">
                ${lead.bookingSessions.map((s: any) => {
                  const formattedDayDate = formatFullDateWithDayName(s.date, s.dayLabel);
                  const slotLabel = s.time === "09:00 - 18:00" ? "Full Day (09:00 - 18:00)" : s.time;
                  return `<li style="margin-bottom: 6px;"><strong>${formattedDayDate}</strong> &mdash; <span style="color: #a16207; font-weight: bold;">${slotLabel}</span></li>`;
                }).join("")}
              </ul>
            </td>
          </tr>
        `;
      } else {
        const formattedDayDate = formatFullDateWithDayName(lead.bookingDate, lead.bookingDayLabel);
        htmlContent += `
          <tr style="background-color: #fef08a;">
            <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #854d0e; border-radius: 6px 0 0 6px;">📅 Session Slot:</td>
            <td style="padding: 12px; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #854d0e; border-radius: 0 6px 6px 0;">
              <strong>${formattedDayDate}</strong> @ ${lead.bookingTime}
            </td>
          </tr>
        `;
      }
    }

    if (lead.message) {
      htmlContent += `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; font-weight: bold; color: #64748b; vertical-align: top;">Message Notes:</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f1f5f9; color: #334155; white-space: pre-wrap; line-height: 1.4;">${lead.message}</td>
        </tr>
      `;
    }

    if (lead.selectedItems && Array.isArray(lead.selectedItems)) {
      htmlContent += `
        <tr>
          <td style="padding: 15px 0 5px 0; font-weight: bold; color: #1e293b; font-size: 14px;" colspan="2">📋 Selected Budget Estimation Details:</td>
        </tr>
        <tr>
          <td colspan="2" style="padding: 0;">
            <table style="width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 5px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
              <thead>
                <tr style="background-color: #f8fafc; text-align: left; border-bottom: 1px solid #e2e8f0;">
                  <th style="padding: 10px; color: #475569; font-weight: 600;">Service/Item</th>
                  <th style="padding: 10px; color: #475569; font-weight: 600; text-align: right;">Unit Price</th>
                  <th style="padding: 10px; color: #475569; font-weight: 600; text-align: center;">Qty</th>
                  <th style="padding: 10px; color: #475569; font-weight: 600; text-align: right;">Total Cost</th>
                </tr>
              </thead>
              <tbody>
                ${lead.selectedItems.map((item: any) => {
                  if (typeof item === 'object') {
                    const priceStr = item.basePrice ? `${item.basePrice} TND` : "-";
                    const costStr = item.cost ? `${item.cost} TND` : "-";
                    const unitLabel = item.unitType ? `/${item.unitType}` : "";
                    return `
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td style="padding: 10px; color: #0f172a; font-weight: 500;">${item.name || item.id}</td>
                        <td style="padding: 10px; color: #475569; text-align: right;">${priceStr}${unitLabel}</td>
                        <td style="padding: 10px; color: #475569; text-align: center;">${item.quantity || 1}</td>
                        <td style="padding: 10px; color: #16a34a; font-weight: bold; text-align: right;">${costStr}</td>
                      </tr>
                    `;
                  } else {
                    return `
                      <tr style="border-bottom: 1px solid #f1f5f9;">
                        <td colspan="3" style="padding: 10px; color: #0f172a;">${item}</td>
                        <td style="padding: 10px; color: #16a34a; font-weight: bold; text-align: right;">-</td>
                      </tr>
                    `;
                  }
                }).join("")}
                <tr style="background-color: #f8fafc; font-weight: bold; border-top: 2px solid #e2e8f0;">
                  <td colspan="3" style="padding: 10px; text-align: right; color: #475569;">Grand Total:</td>
                  <td style="padding: 10px; text-align: right; color: #16a34a; font-size: 14px;">${lead.estimatedTotal} TND</td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
      `;
    }

    htmlContent += `
        </table>
        <div style="margin-top: 30px; text-align: center; font-size: 11px; color: #94a3b8; border-top: 1px solid #e2e8f0; padding-top: 15px;">
          This is an automated notification from your Video Club Control Vault.
        </div>
      </div>
    `;

    const emailTo = google.adminEmail;
    const emailSubject = `🎥 Video Club Production: ${title} from ${lead.name}`;
    
    const emailParts = [
      `To: ${emailTo}`,
      `Subject: ${emailSubject}`,
      "Content-Type: text/html; charset=utf-8",
      "MIME-Version: 1.0",
      "",
      htmlContent
    ];
    
    const emailStr = emailParts.join("\r\n");
    const rawMessage = Buffer.from(emailStr, "utf-8")
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const response = await fetch("https://gmail.googleapis.com/gmail/v1/users/me/messages/send", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${google.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ raw: rawMessage })
    });

    if (response.ok) {
      console.log(`Notification email successfully sent to ${emailTo}`);
    } else {
      const errorData = await response.json().catch(() => ({}));
      console.error("Failed to send email via Gmail API:", errorData);
    }
  } catch (err) {
    console.error("Error in sendGmailNotification:", err);
  }
}

// GET Google Calendar Free/Busy Busy Times
app.get("/api/google/calendar-freebusy", async (req, res) => {
  try {
    const settings = await readAgencySettings();
    const google = settings.googleConnection;
    
    if (!google || !google.accessToken) {
      return res.json({ busy: [], connected: false });
    }

    const response = await fetch("https://www.googleapis.com/calendar/v3/freeBusy", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${google.accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        timeMin: new Date().toISOString(),
        timeMax: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // next 14 days
        items: [{ id: "primary" }]
      })
    });

    if (!response.ok) {
      if (response.status === 401) {
        return res.json({ busy: [], connected: true, expired: true });
      }
      const errDetails = await response.json().catch(() => ({}));
      console.error("Google Calendar API error response:", errDetails);
      return res.json({ busy: [], connected: true, expired: true });
    }

    const data = await response.json();
    const busySlots = data.calendars?.primary?.busy || [];
    return res.json({ busy: busySlots, connected: true, expired: false });
  } catch (err: any) {
    console.error("Error fetching Google Calendar FreeBusy:", err);
    return res.json({ busy: [], connected: false, error: err.message });
  }
});

// PUBLIC: Submit a new Lead/Inquiry
app.post("/api/leads", async (req, res) => {
  try {
    const leadData = req.body;
    if (!leadData || !leadData.name || !leadData.email) {
      return res.status(400).json({ error: "Name and Email are required fields." });
    }

    const leads = await readLeads();
    const newLead = {
      id: "lead-" + Math.random().toString(36).substr(2, 9),
      createdAt: new Date().toISOString(),
      status: "new",
      ...leadData
    };

    leads.unshift(newLead); // Add to the top (most recent)
    await writeLeads(leads);

    // Fire & Forget email notification via Gmail API
    sendGmailNotification(newLead).catch((err) => {
      console.error("Async sendGmailNotification failure:", err);
    });

    // Fire & Forget Google Calendar event creation
    if ((newLead.bookingDate && newLead.bookingTime) || (newLead.bookingSessions && newLead.bookingSessions.length > 0)) {
      createGoogleCalendarEvent(newLead).catch((err) => {
        console.error("Async createGoogleCalendarEvent failure:", err);
      });
    }

    // Fire & Forget Google Sheets sync
    syncLeadToGoogleSheets(newLead).catch((err) => {
      console.error("Async syncLeadToGoogleSheets failure:", err);
    });

    // Fire & Forget Google Drive Brief upload
    uploadBriefToGoogleDrive(newLead).catch((err) => {
      console.error("Async uploadBriefToGoogleDrive failure:", err);
    });

    return res.json({ success: true, leadId: newLead.id, message: "Your inquiry has been received!" });
  } catch (err: any) {
    console.error("Error processing incoming lead:", err);
    return res.status(500).json({ error: "Failed to submit inquiry. Please try again." });
  }
});

// ADMIN: Get all Leads
app.get("/api/admin/leads", async (req, res) => {
  try {
    const { token } = req.query;
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    const leads = await readLeads();
    return res.json(leads);
  } catch (err: any) {
    console.error("Error retrieving leads for admin:", err);
    return res.status(500).json({ error: "Failed to load leads registry." });
  }
});

// ADMIN: Update Lead Status
app.post("/api/admin/leads/update-status", async (req, res) => {
  try {
    const { token, leadId, status } = req.body;
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    if (!leadId || !status) {
      return res.status(400).json({ error: "Lead ID and status are required." });
    }

    const leads = await readLeads();
    const index = leads.findIndex((l) => l.id === leadId);
    if (index === -1) {
      return res.status(404).json({ error: "Lead not found." });
    }

    leads[index].status = status;
    await writeLeads(leads);

    return res.json({ success: true, message: `Lead status updated to ${status}.` });
  } catch (err: any) {
    console.error("Error updating lead status:", err);
    return res.status(500).json({ error: "Failed to update lead status." });
  }
});

// ADMIN: Delete a Lead
app.post("/api/admin/leads/delete", async (req, res) => {
  try {
    const { token, leadId } = req.body;
    if (!isValidAdminToken(token)) {
      return res.status(401).json({ error: "Unauthorized. Invalid admin token." });
    }

    if (!leadId) {
      return res.status(400).json({ error: "Lead ID is required." });
    }

    const leads = await readLeads();
    const filtered = leads.filter((l) => l.id !== leadId);
    await writeLeads(filtered);

    return res.json({ success: true, message: "Lead removed from inquiry vault." });
  } catch (err: any) {
    console.error("Error deleting lead:", err);
    return res.status(500).json({ error: "Failed to delete lead from repository." });
  }
});

// Creative Script & Concept Planner API
app.post("/api/script-planner", async (req, res) => {
  try {
    const { videoType, genre, brandName, mood, audience, description } = req.body;

    if (!description) {
      return res.status(400).json({ error: "A prompt or description is required." });
    }

    let ai;
    try {
      ai = getGeminiClient();
    } catch (keyErr: any) {
      console.warn("Gemini client initialization failed:", keyErr.message);
      return res.status(503).json({
        error: "Gemini API key is missing. Please add your GEMINI_API_KEY in the Secrets panel in the Settings menu.",
        fallback: true
      });
    }

    const systemInstruction = `
      You are an award-winning Creative Director and Scriptwriter at Video Club Production, a premier boutique agency specializing in high-end cinematic commercials, music videos, documentaries, and corporate branding.
      Your task is to craft a premium, high-impact production treatment and full 3-act script based on the client's brief.
      Deliver the response as a valid JSON object matching this TypeScript structure:
      {
        "title": string (an evocative, premium working title),
        "concept": string (a concise 1-2 sentence core artistic theme or high-concept logline),
        "moodboardKeywords": string[] (5 evocative aesthetic or visual terms),
        "visualStyle": {
          "lighting": string,
          "colorPalette": string,
          "cameraMovement": string,
          "soundDesign": string
        },
        "scriptActs": [
          { "actName": string, "scenes": [ { "timecode": string, "visuals": string, "audio": string, "directorsNote": string } ] }
        ],
        "storyboardBrief": [
          { "panelNumber": number, "description": string, "shotType": string, "aestheticPrompt": string }
        ],
        "productionTips": string[] (3 unique, practical director tips to achieve this exact look)
      }
    `;

    const prompt = `
      Create a detailed creative treatment and shooting script for a project with the following specifications:
      - Project Type: ${videoType || "Commercial"}
      - Genre/Aesthetic: ${genre || "Cinematic / Avant-Garde"}
      - Brand/Product Name: ${brandName || "Luxury Brand"}
      - Mood: ${mood || "Dramatic and Atmospheric"}
      - Target Audience: ${audience || "Global tastemakers and design enthusiasts"}
      - Brief Description: ${description}

      Ensure the treatment is highly detailed, original, visually poetic, and sounds like a professional treatment submitted to an executive producer. Be extremely creative and cinematic.
    `;

    const response = await generateContentWithFallback(ai, prompt, {
      systemInstruction,
      responseMimeType: "application/json",
      temperature: 0.85,
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response text received from Gemini.");
    }

    const parsedData = JSON.parse(text);
    return res.json(parsedData);

  } catch (err: any) {
    console.error("Error in script planner API:", err);
    return res.status(500).json({
      error: "Failed to generate script treatment. Please try again.",
      details: err.message
    });
  }
});

// Configure Vite or Serve Static Production assets
async function bootstrapServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Video Club Server] running on http://localhost:${PORT} in ${process.env.NODE_ENV || "development"} mode`);
  });
}

if (!process.env.VERCEL) {
  bootstrapServer();
}

export default app;
