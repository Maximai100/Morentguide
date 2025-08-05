import React, { useState, useRef } from 'react';
import { uploadMultipleFiles, deleteFile, getFileUrl } from '../utils/directus-upload';

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
  accept = 'image/*',
  multiple = true,
  label = 'Выбрать файл'
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles || selectedFiles.length === 0) return;

    setUploading(true);
    try {
      const uploadedFileIds = await uploadMultipleFiles(Array.from(selectedFiles));
      
      if (multiple) {
        onFilesChange([...files, ...uploadedFileIds]);
      } else {
        onFilesChange(uploadedFileIds.slice(0, 1));
      }
    } catch (error) {
      console.error('Error uploading files:', error);
      alert('Ошибка при загрузке файлов');
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = async (fileId: string) => {
    try {
      await deleteFile(fileId);
      onFilesChange(files.filter(f => f !== fileId));
    } catch (error) {
      console.error('Error deleting file:', error);
      alert('Ошибка при удалении файла');
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />
      
      <button
        type="button"
        onClick={() => fileInputRef.current?.click()}
        disabled={uploading}
        className="btn-secondary"
      >
        {uploading ? 'Загрузка...' : label}
      </button>

      {files.length > 0 && (
        <div className="border rounded p-2 space-y-2">
          {files.map((fileId) => (
            <div key={fileId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">Файл загружен: {fileId}</span>
              <button
                type="button"
                onClick={() => handleRemove(fileId)}
                className="text-red-600 hover:text-red-700 text-sm"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MediaUploader;