import React, { useState } from 'react';

interface MediaUploaderProps {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
  accept?: string;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ 
  label, 
  value, 
  onChange, 
  accept = "*" 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    
    try {
      // Здесь будет логика загрузки файла в Directus
      // Пока что просто симулируем загрузку
      console.log('Uploading file:', file.name);
      
      // Симуляция загрузки
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Генерируем fake ID файла
      const fakeFileId = `file_${Date.now()}`;
      onChange(fakeFileId);
      
    } catch (error) {
      console.error('Upload error:', error);
      alert('Ошибка при загрузке файла');
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = () => {
    onChange(null);
  };

  return (
    <div className="space-y-2">
      <label className="form-label">
        {label}
      </label>
      
      <div className="flex items-center space-x-4">
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
          id={`file-${label}`}
          disabled={isUploading}
        />
        
        <label
          htmlFor={`file-${label}`}
          className="btn-secondary cursor-pointer"
          style={{ pointerEvents: isUploading ? 'none' : 'auto' }}
        >
          {isUploading ? 'Загрузка...' : 'Выбрать файл'}
        </label>
        
        {value && (
          <button
            type="button"
            onClick={handleRemove}
            className="text-red-600 hover:text-red-800 text-sm"
            disabled={isUploading}
          >
            Удалить
          </button>
        )}
      </div>
      
      {value && (
        <div className="text-sm text-gray-600">
          Файл загружен: {value}
        </div>
      )}
    </div>
  );
};

export default MediaUploader; 