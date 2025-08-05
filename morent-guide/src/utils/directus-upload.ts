import { api } from './api';

export const uploadFile = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/files', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.data.id;
  } catch (error) {
    console.error('Upload error:', error);
    throw new Error('Ошибка при загрузке файла. Проверьте подключение к Directus и права доступа.');
  }
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadFile(file));
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    throw new Error('Ошибка при загрузке файлов. Проверьте подключение к Directus.');
  }
};

export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    await api.delete(`/files/${fileId}`);
  } catch (error) {
    console.error('Delete error:', error);
    throw new Error('Ошибка при удалении файла.');
  }
};

export const getFileUrl = (fileId: string): string => {
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'https://1.cycloscope.online';
  return `${baseUrl}/assets/${fileId}`;
};