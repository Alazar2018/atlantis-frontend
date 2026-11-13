"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import Cropper, { Area } from "react-easy-crop";
import { Upload, X } from "lucide-react";

import Dialog from "./Dialog";
import { cropImageWithFocus } from "@/lib/imageUtils";

interface ImageUploadProps {
  label?: string;
  value?: string | string[];
  onChange: (files: File[] | null) => void;
  onRemove?: (index: number) => void; // Callback for when an image is removed
  multiple?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  enableCropping?: boolean;
  cropAspect?: number;
  focusGuideText?: string;
}

export default function ImageUpload({
  label,
  value,
  onChange,
  onRemove,
  multiple = false,
  accept = "image/*",
  maxSize = 5,
  enableCropping = false,
  cropAspect = 1,
  focusGuideText = "Adjust the frame to set the visible focus area.",
}: ImageUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [processedFiles, setProcessedFiles] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [isCropping, setIsCropping] = useState(false);
  const [currentCropFile, setCurrentCropFile] = useState<File | null>(null);
  const [currentCropPreview, setCurrentCropPreview] = useState<string>("");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  useEffect(() => {
    // Initialize with existing value if provided
    if (value) {
      if (Array.isArray(value)) {
        setPreviews(value);
      } else if (typeof value === "string") {
        setPreviews([value]);
      }
    } else {
      // If value is empty or undefined, clear previews
      setPreviews([]);
    }
    setProcessedFiles([]);
  }, [value]);

  const cleanupCropState = useCallback(() => {
    if (currentCropPreview && currentCropPreview.startsWith("blob:")) {
      URL.revokeObjectURL(currentCropPreview);
    }
    setCurrentCropFile(null);
    setCurrentCropPreview("");
    setCroppedAreaPixels(null);
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setIsCropping(false);
  }, [currentCropPreview]);

  const startCropping = useCallback(
    (file: File) => {
      if (!enableCropping) return;

      if (currentCropPreview && currentCropPreview.startsWith("blob:")) {
        URL.revokeObjectURL(currentCropPreview);
      }

      const previewUrl = URL.createObjectURL(file);
      setCurrentCropFile(file);
      setCurrentCropPreview(previewUrl);
      setCrop({ x: 0, y: 0 });
      setZoom(1);
      setCroppedAreaPixels(null);
      setIsCropping(true);
    },
    [currentCropPreview, enableCropping]
  );

  useEffect(() => {
    if (!enableCropping) return;
    if (!isCropping && pendingFiles.length > 0) {
      const [nextFile, ...remaining] = pendingFiles;
      startCropping(nextFile);
      setPendingFiles(remaining);
    }
  }, [enableCropping, isCropping, pendingFiles, startCropping]);

  const handleCropComplete = useCallback((_area: Area, areaPixels: Area) => {
    setCroppedAreaPixels(areaPixels);
  }, []);

  const handleCropConfirm = useCallback(async () => {
    if (!currentCropFile || !currentCropPreview || !croppedAreaPixels) {
      cleanupCropState();
      return;
    }

    try {
      const { file, dataUrl } = await cropImageWithFocus(
        currentCropPreview,
        croppedAreaPixels,
        currentCropFile
      );

      setPreviews((prev) => (multiple ? [...prev, dataUrl] : [dataUrl]));

      setProcessedFiles((prev) => {
        const updated = multiple ? [...prev, file] : [file];
        onChange(updated.length ? updated : null);
        return updated;
      });
    } catch (error) {
      console.error("Error while cropping image:", error);
      alert("We couldn't crop that image. Please try again.");
    } finally {
      cleanupCropState();
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  }, [
    cleanupCropState,
    croppedAreaPixels,
    currentCropFile,
    currentCropPreview,
    multiple,
    onChange,
  ]);

  const handleCropCancel = useCallback(() => {
    cleanupCropState();
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, [cleanupCropState]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Validate file sizes
    const validFiles = files.filter((file) => {
      if (file.size > maxSize * 1024 * 1024) {
        alert(`File ${file.name} is too large. Maximum size is ${maxSize}MB.`);
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    if (enableCropping) {
      const selection = multiple ? validFiles : [validFiles[0]!];
      if (!multiple) {
        setProcessedFiles([]);
        setPreviews([]);
      }
      setPendingFiles((prev) => [...prev, ...selection]);
    } else {
      const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
      setPreviews((prev) => (multiple ? [...prev, ...newPreviews] : newPreviews));
      setProcessedFiles((prev) => {
        const updated = multiple ? [...prev, ...validFiles] : validFiles;
        onChange(updated.length ? updated : null);
        return updated;
      });
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemove = (index: number) => {
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setProcessedFiles((prev) => {
      const updated = prev.filter((_, i) => i !== index);
      if (onRemove) {
        onRemove(index);
      } else {
        onChange(updated.length ? updated : null);
      }
      return updated;
    });
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-medium text-gray-700">{label}</label>
      )}

      <div className="space-y-4">
        {/* Preview Images */}
        {previews.length > 0 && (
          <div className={`grid ${multiple ? "grid-cols-2 md:grid-cols-4" : "grid-cols-1"} gap-4`}>
            {previews.map((preview, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square rounded-lg overflow-hidden border border-gray-300">
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    unoptimized={preview.startsWith("blob:") || preview.startsWith("data:")}
                    className="object-cover"
                  />
                  {enableCropping && (
                    <div className="pointer-events-none absolute inset-2 border-2 border-white/70 rounded-lg shadow-[0_0_0_9999px_rgba(0,0,0,0.35)]" />
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Upload Button */}
        <button
          type="button"
          onClick={handleClick}
          className="w-full border-2 border-dashed border-gray-300 rounded-lg p-8 hover:border-primary transition-all flex flex-col items-center justify-center space-y-2"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            {multiple ? "Upload Images" : "Upload Image"}
          </span>
          <span className="text-xs text-gray-500">Max size: {maxSize}MB</span>
          {enableCropping && (
            <span className="text-xs text-primary font-medium">
              A focus editor will appear after you select an image.
            </span>
          )}
        </button>

        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      {enableCropping && currentCropPreview && (
        <Dialog
          isOpen={isCropping}
          onClose={handleCropCancel}
          title="Adjust Focus"
          size="lg"
        >
          <div className="space-y-6">
            <div className="relative w-full aspect-square bg-gray-900 rounded-xl overflow-hidden">
              <Cropper
                image={currentCropPreview}
                crop={crop}
                zoom={zoom}
                aspect={cropAspect}
                onCropChange={setCrop}
                onZoomChange={setZoom}
                onCropComplete={handleCropComplete}
                showGrid
                objectFit="contain"
              />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 bg-black/60 text-white px-4 py-2 text-xs md:text-sm rounded-lg text-center">
                {focusGuideText}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Zoom</label>
              <input
                type="range"
                min={1}
                max={3}
                step={0.1}
                value={zoom}
                onChange={(event) => setZoom(Number(event.target.value))}
                className="w-full accent-primary"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCropCancel}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCropConfirm}
                className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-all text-sm font-semibold"
              >
                Save Focus
              </button>
            </div>
          </div>
        </Dialog>
      )}
    </div>
  );
}

