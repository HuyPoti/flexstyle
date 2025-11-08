import Image from "next/image";
import React, { useRef } from "react";

interface ImageUploadCardProps {
  label: string;
  onImageChange: (file: File | null) => void;
  previewUrl: string | null;
  className?: string;
  disabled?: boolean;
}

const ImageUploadCard: React.FC<ImageUploadCardProps> = ({
  label,
  onImageChange,
  previewUrl,
  className,
  disabled,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      onImageChange(event.target.files[0]);
    } else {
      onImageChange(null);
    }
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-lg shadow-sm bg-white ${
        className || ""
      }`}
    >
      <label className="text-lg font-semibold text-gray-700 mb-4">
        {label}
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        id={`file-upload-${label.replace(/\s/g, "-")}`}
        disabled={disabled}
      />
      <label
        htmlFor={`file-upload-${label.replace(/\s/g, "-")}`}
        className={`flex cursor-pointer bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full transition-colors duration-200 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {previewUrl ? "Change Image" : "Upload Image"}
      </label>

      {previewUrl && (
        <div className="mt-6 w-full max-w-xs flex flex-col items-center">
          <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
          <Image
            src={previewUrl}
            alt="Preview"
            className="max-w-full h-auto rounded-md shadow-md object-contain max-h-48 md:max-h-64"
            width={100}
            height={100}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadCard;
