export const uploadFile = async (file: File): Promise<string> => {
  // Временное решение - всегда используем локальные ID файлов
  const fileId = `temp_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9]/g, '_')}`;
  console.log('Using temporary file ID:', fileId);
  
  // Сохраняем файл в localStorage для демонстрации
  try {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        localStorage.setItem(`file_${fileId}`, e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  } catch (error) {
    console.log('Could not save file to localStorage:', error);
  }
  
  return fileId;
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
  try {
    const uploadPromises = files.map(file => uploadFile(file));
    return Promise.all(uploadPromises);
  } catch (error) {
    console.error('Multiple upload error:', error);
    // Возвращаем пустой массив вместо ошибки
    return [];
  }
};

export const deleteFile = async (fileId: string): Promise<void> => {
  try {
    // Удаляем файл из localStorage
    localStorage.removeItem(`file_${fileId}`);
    console.log('Deleted temporary file:', fileId);
  } catch (error) {
    console.error('Delete error:', error);
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