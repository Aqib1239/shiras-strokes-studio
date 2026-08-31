"use client";

import React, { useState, useRef } from "react";
import { Upload, X, Image as ImageIcon, Loader2, Link as LinkIcon, Plus } from "lucide-react";
import { api } from "@/lib/api";
import { toast } from "sonner";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
}

export function ImageUploader({ images, onChange, maxImages = 5 }: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [manualUrl, setManualUrl] = useState("");
  const [showUrlInput, setShowUrlInput] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }

    setIsUploading(true);
    try {
      const fileList = Array.from(files);
      const res = await api.uploadImages(fileList);

      if (res.success && res.data) {
        const newUrls = Array.isArray(res.data)
          ? res.data.map((d: any) => d.url)
          : [res.data.url];

        onChange([...images, ...newUrls]);
        toast.success("Image(s) uploaded successfully!");
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to upload image");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleAddManualUrl = () => {
    if (!manualUrl.trim()) return;
    if (images.length >= maxImages) {
      toast.error(`Maximum ${maxImages} images allowed.`);
      return;
    }
    onChange([...images, manualUrl.trim()]);
    setManualUrl("");
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-ink">
        Product Images ({images.length}/{maxImages})
      </label>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {images.map((url, idx) => (
          <div
            key={idx}
            className="group relative aspect-square rounded-2xl overflow-hidden hairline bg-secondary/40"
          >
            <img src={url} alt={`Product ${idx + 1}`} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute right-2 top-2 h-7 w-7 rounded-full bg-destructive text-white flex items-center justify-center shadow-md transition-opacity group-hover:opacity-100 sm:opacity-90 hover:scale-110"
              title="Remove image"
            >
              <X className="h-3.5 w-3.5" />
            </button>
            {idx === 0 && (
              <span className="absolute left-2 bottom-2 rounded-full bg-background/90 backdrop-blur px-2 py-0.5 text-[0.65rem] font-medium text-ink">
                Primary
              </span>
            )}
          </div>
        ))}

        {/* Upload Trigger Box */}
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={`flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-border/80 bg-background/60 hover:bg-secondary/40 cursor-pointer transition-colors p-4 text-center ${
              isUploading ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/svg+xml"
              multiple
              className="hidden"
              onChange={handleFileSelect}
            />
            {isUploading ? (
              <>
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-1" />
                <span className="text-xs text-muted-foreground">Uploading...</span>
              </>
            ) : (
              <>
                <Upload className="h-6 w-6 text-primary/70 mb-1" />
                <span className="text-xs font-medium text-ink">Upload Images</span>
                <span className="text-[0.65rem] text-muted-foreground mt-0.5">JPG, PNG, WebP</span>
              </>
            )}
          </div>
        )}
      </div>

      {/* Manual URL Link Option */}
      <div className="pt-1">
        {showUrlInput ? (
          <div className="flex gap-2">
            <input
              type="url"
              placeholder="Paste image URL (e.g. /assets/cat-crochet.jpg or https://...)"
              value={manualUrl}
              onChange={(e) => setManualUrl(e.target.value)}
              className="flex-1 rounded-xl hairline bg-background px-3 py-2 text-xs text-foreground"
            />
            <button
              type="button"
              onClick={handleAddManualUrl}
              className="rounded-xl bg-primary px-3 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowUrlInput(false)}
              className="rounded-xl border border-border px-3 py-2 text-xs text-muted-foreground hover:bg-secondary"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setShowUrlInput(true)}
            className="inline-flex items-center gap-1.5 text-xs text-primary/80 hover:text-primary transition-colors"
          >
            <LinkIcon className="h-3 w-3" />
            <span>Or add image by URL / asset path</span>
          </button>
        )}
      </div>
    </div>
  );
}
