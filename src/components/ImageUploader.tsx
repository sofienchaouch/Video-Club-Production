import React, { useState, useRef } from "react";
import { UploadCloud, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

interface ImageUploaderProps {
  onUploadSuccess: (url: string) => void;
  currentImageUrl?: string;
  label?: string;
  acceptType?: "image" | "video" | "any";
  maxSizeMB?: number;
}

export default function ImageUploader({
  onUploadSuccess,
  currentImageUrl,
  label = "Upload Image",
  acceptType = "image",
  maxSizeMB
}: ImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const adminToken = localStorage.getItem("video-club-admin-token") || "";

  const handleFile = async (file: File) => {
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/") || /\.(mp4|webm|mov|m4v|mkv|avi)$/i.test(file.name);

    if (acceptType === "image" && !isImage) {
      setUploadState("error");
      setErrorMessage("Please select an image file (PNG, JPG, WEBP).");
      return;
    }

    if (acceptType === "video" && !isVideo) {
      setUploadState("error");
      setErrorMessage("Please select a video file (MP4, WebM, MOV).");
      return;
    }

    if (!isImage && !isVideo) {
      setUploadState("error");
      setErrorMessage("Please select a valid image or video file.");
      return;
    }

    const limitMB = maxSizeMB || (acceptType === "video" ? 100 : 15);
    if (file.size > limitMB * 1024 * 1024) {
      setUploadState("error");
      setErrorMessage(`File size exceeds ${limitMB}MB limit.`);
      return;
    }

    setUploadState("uploading");
    setErrorMessage("");

    try {
      // Read file as base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Post to backend upload endpoint
        const response = await fetch("/api/admin/upload-image", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: adminToken,
            filename: file.name,
            base64Data,
          }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setUploadState("success");
          onUploadSuccess(data.url);
        } else {
          setUploadState("error");
          setErrorMessage(data.error || "Failed to upload file.");
        }
      };

      reader.onerror = () => {
        setUploadState("error");
        setErrorMessage("Error reading file.");
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setUploadState("error");
      setErrorMessage(err.message || "An error occurred during upload.");
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="block text-4xs font-mono text-zinc-500 uppercase tracking-widest">
          {label}
        </span>
        {currentImageUrl && (
          <span className="text-[9px] font-mono text-emerald-400 uppercase">
            ● Local {acceptType === "video" ? "Video" : "Asset"} Configured
          </span>
        )}
      </div>

      <div
        onDragEnter={handleDrag}
        onDragOver={handleDrag}
        onDragLeave={handleDrag}
        onDrop={handleDrop}
        onClick={onButtonClick}
        className={`relative flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-lg transition-all cursor-pointer h-24 ${
          dragActive
            ? "border-gold-500 bg-gold-500/5"
            : "border-slate-800 hover:border-zinc-700 bg-slate-950/20"
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          accept={
            acceptType === "video"
              ? "video/*,.mp4,.webm,.mov,.mkv,.avi"
              : acceptType === "any"
              ? "image/*,video/*"
              : "image/*"
          }
          onChange={handleChange}
        />

        {uploadState === "idle" && (
          <div className="flex flex-col items-center space-y-1 text-center">
            <UploadCloud className="w-5 h-5 text-zinc-500 hover:text-gold-400 transition-colors" />
            <p className="text-[10px] font-medium text-zinc-400">
              Drag & drop or <span className="text-gold-400 font-bold hover:underline">browse</span>
            </p>
            <p className="text-[8px] font-mono text-zinc-600 uppercase">
              {acceptType === "video"
                ? `MP4, WEBM, MOV (MAX. ${maxSizeMB || 100}MB)`
                : `PNG, JPG, WEBP, SVG (MAX. ${maxSizeMB || 15}MB)`}
            </p>
          </div>
        )}

        {uploadState === "uploading" && (
          <div className="flex flex-col items-center space-y-1.5">
            <Loader2 className="w-5 h-5 text-gold-500 animate-spin" />
            <p className="text-[10px] font-mono text-gold-400 uppercase tracking-wider animate-pulse">
              Uploading {acceptType === "video" ? "video" : "file"}...
            </p>
          </div>
        )}

        {uploadState === "success" && (
          <div className="flex flex-col items-center space-y-1 text-center">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <p className="text-[10px] font-mono font-bold text-emerald-400 uppercase">
              Upload Successful!
            </p>
            <p className="text-[8px] text-zinc-500 font-mono">
              Saved locally on server
            </p>
          </div>
        )}

        {uploadState === "error" && (
          <div className="flex flex-col items-center space-y-1 text-center px-2">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <p className="text-[10px] font-mono font-bold text-red-400 uppercase">
              Upload Failed
            </p>
            <p className="text-[8px] text-zinc-400 font-sans truncate max-w-full">
              {errorMessage}
            </p>
          </div>
        )}

        {/* Thumbnail Preview overlay in the corner if active */}
        {currentImageUrl && uploadState !== "uploading" && (
          <div className="absolute right-2.5 bottom-2.5 w-10 h-10 rounded border border-zinc-800 overflow-hidden bg-slate-950 pointer-events-none">
            {currentImageUrl.endsWith(".mp4") || currentImageUrl.endsWith(".webm") || currentImageUrl.includes("/uploads/") && acceptType === "video" ? (
              <video
                src={currentImageUrl}
                className="w-full h-full object-cover"
                muted
                playsInline
              />
            ) : (
              <img
                src={currentImageUrl}
                alt="Preview"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.style.display = "none";
                }}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
