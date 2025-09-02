import React, { useState } from 'react';
import { getFileUrl } from '../utils/directus-upload';

interface PhotoGalleryProps {
  photos: string[];
  title?: string;
}

const PhotoGallery: React.FC<PhotoGalleryProps> = ({ photos, title = 'Галерея' }) => {
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  if (!photos || photos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-slate-500 dark:text-slate-400">Фотографии не загружены</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-heading font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
      
      {/* Горизонтальный скролл фотографий */}
      <div className="overflow-x-auto">
        <div className="flex space-x-4 pb-4" style={{ minWidth: 'max-content' }}>
          {photos.map((photo, index) => (
            <div 
              key={index} 
              className="flex-shrink-0 cursor-pointer group"
              onClick={() => setSelectedPhoto(photo)}
            >
              <img 
                src={getFileUrl(photo)} 
                alt={`Фото ${index + 1}`}
                className="w-48 h-32 object-cover rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="mt-2 text-center">
                <span className="text-sm text-slate-600 dark:text-slate-400">Фото {index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Модальное окно для увеличенного просмотра */}
      {selectedPhoto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-4xl max-h-full p-4">
            <button
              onClick={() => setSelectedPhoto(null)}
              className="absolute top-4 right-4 text-white text-2xl hover:text-slate-300 z-10"
            >
              ✕
            </button>
            <img 
              src={getFileUrl(selectedPhoto)} 
              alt="Увеличенное фото"
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PhotoGallery; 