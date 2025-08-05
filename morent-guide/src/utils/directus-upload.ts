import { api } from './api';

export const uploadFile = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data.data.id;
};

export const uploadMultipleFiles = async (files: File[]): Promise<string[]> => {
  const uploadPromises = files.map(file => uploadFile(file));
  return Promise.all(uploadPromises);
};

export const deleteFile = async (fileId: string): Promise<void> => {
  await api.delete(`/files/${fileId}`);
};

export const getFileUrl = (fileId: string): string => {
  const baseUrl = import.meta.env.VITE_DIRECTUS_URL || 'https://1.cycloscope.online';
  return `${baseUrl}/assets/${fileId}`;
};