"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { generateSHA256Hash } from "@/lib/utils";

interface ReceiptUploaderProps {
  onFileSelected: (file: File, base64: string, hash: string) => void;
  defaultPreview?: string | null;
  label?: string;
}

export const ReceiptUploader: React.FC<ReceiptUploaderProps> = ({
  onFileSelected,
  defaultPreview = null,
  label = "Till Slip or Invoice Photo",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(defaultPreview);
  const [hash, setHash] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    setFileName(file.name);

    // 1. Generate real Web Crypto SHA-256 Hash locally on-device
    const calculatedHash = await generateSHA256Hash(file);
    setHash(calculatedHash);

    // 2. Read base64 for preview and OCR submission
    const reader = new FileReader();
    reader.onload = () => {
      const base64Str = reader.result as string;
      setPreview(base64Str);
      setIsProcessing(false);
      onFileSelected(file, base64Str, calculatedHash);
    };
    reader.readAsDataURL(file);
  };

  const handleClear = () => {
    setPreview(null);
    setHash(null);
    setFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
        id="receipt-file-input"
      />

      {isProcessing ? (
        <div className="border-2 border-dashed border-primary/40 rounded-2xl p-6 flex flex-col items-center justify-center text-center bg-surface-container-low/70">
          <span className="material-symbols-outlined text-[28px] text-primary animate-spin mb-2">sync</span>
          <span className="font-headline text-sm font-bold text-on-surface">Computing Cryptographic Hash...</span>
        </div>
      ) : !preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-primary/40 hover:border-primary rounded-2xl p-5 flex flex-col items-center justify-center text-center bg-surface-container-low/70 hover:bg-surface-container-high transition-all cursor-pointer group shadow-sm"
        >
          <div className="w-12 h-12 rounded-xl bg-primary-fixed flex items-center justify-center text-primary group-hover:scale-110 transition-transform mb-2">
            <span className="material-symbols-outlined text-[28px]">add_a_photo</span>
          </div>
          <span className="font-headline text-sm font-bold text-on-surface">
            {label}
          </span>
          <span className="font-body text-xs text-on-surface-variant mt-0.5">
            Take camera snapshot or choose from gallery
          </span>
          <span className="font-label text-[10px] text-primary bg-primary-fixed/50 px-2 py-0.5 rounded-full mt-2 font-semibold">
            Auto SHA-256 Hash Calculated Instantly
          </span>
        </div>
      ) : (
        <div className="flex flex-col rounded-2xl bg-surface-container-lowest border border-outline-variant/40 p-3 shadow-sm gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-12 h-12 rounded-xl overflow-hidden relative bg-surface-container flex-shrink-0 border border-outline-variant/30">
                <Image
                  src={preview}
                  alt="Receipt Preview"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <span className="font-headline text-xs font-semibold text-on-surface truncate block">
                  {fileName || "Receipt Document Attached"}
                </span>
                <span className="font-label text-[11px] text-secondary font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px]">verified</span>
                  SHA-256 Cryptographic Integrity Active
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleClear}
              className="p-1.5 rounded-lg text-outline hover:text-error hover:bg-error-container/20 transition-colors"
              title="Remove slip photo"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          {/* Cryptographic Hash Bar */}
          {hash && (
            <div className="flex items-center justify-between bg-surface-container-low px-2.5 py-1.5 rounded-xl border border-outline-variant/30 text-[10px]">
              <span className="font-label text-on-surface-variant uppercase font-semibold">
                SHA-256 Hash:
              </span>
              <span className="font-mono text-primary font-bold truncate max-w-[200px]" title={hash}>
                {hash}
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
