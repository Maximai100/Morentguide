import React, { useState } from 'react';

interface MediaUploaderProps {
  files: string[];
  onFilesChange: (files: string[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({
  files,
  onFilesChange,
  accept = '*/*',
  multiple = false,
  label = 'Выбрать файлы'
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setIsUploading(true);
    try {
      // В демо-режиме просто создаем URL для файлов
      const fileUrls: string[] = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const url = URL.createObjectURL(file);
        fileUrls.push(url);
      }

      if (multiple) {
        onFilesChange([...files, ...fileUrls]);
      } else {
        onFilesChange(fileUrls);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onFilesChange(newFiles);
  };

  return (
    <div className="space-y-4">
      <div>
        <input
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
          disabled={isUploading}
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {isUploading ? 'Загрузка...' : label}
        </label>
      </div>

      {files.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {files.map((file, index) => (
            <div key={index} className="relative group">
              {file.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={file}
                  alt={`Uploaded file ${index + 1}`}
                  className="w-full h-24 object-cover rounded-lg"
                />
              ) : file.match(/\.(mp4|webm|ogg)$/i) ? (
                <video
                  src={file}
                  className="w-full h-24 object-cover rounded-lg"
                  controls
                />
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Файл</span>
                </div>
              )}
              
              <button
                onClick={() => removeFile(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;