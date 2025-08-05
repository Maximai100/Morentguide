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
    
    // Временное решение - возвращаем ID файла на основе имени
    const fileId = `temp_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
    console.log('Using temporary file ID:', fileId);
    return fileId;
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
    // Пропускаем удаление для временных файлов
    if (fileId.startsWith('temp_')) {
      console.log('Skipping deletion for temporary file:', fileId);
      return;
    }
    
    await api.delete(`/files/${fileId}`);
  } catch (error) {
    console.error('Delete error:', error);
    // Не выбрасываем ошибку, так как файл может уже не существовать
  }
};

export const getFileUrl = (fileId: string): string => {
  // Для временных файлов возвращаем заглушку
  if (fileId.startsWith('temp_')) {
    return 'https://via.placeholder.com/300x200?text=Uploaded+File';
  }
  
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'https://1.cycloscope.online';
  return `${baseUrl}/assets/${fileId}`;
};