import apiClient from './apiClient';

export const login = (email: string, password: string) => 
  apiClient.post('/login', { email, password });

export const register = (data: any) => 
  apiClient.post('/register', data);

export const logout = () => 
  apiClient.post('/logout');

export const getProfile = () => 
  apiClient.get('/profile');

export const updateProfile = (data: any) => 
  apiClient.put('/profile', data);

export const getDashboard = () => 
  apiClient.get('/dashboard');

export const getMissionsDisponibles = () => 
  apiClient.get('/missions/disponibles');

export const getMissionDetails = (id: number) => 
  apiClient.get(`/missions/${id}`);

export const postulerMission = (id: number) => 
  apiClient.post(`/missions/${id}/postuler`);

export const getMesMissions = () => 
  apiClient.get('/mes-missions');

export const getMesContrats = () => 
  apiClient.get('/contrats');

export const getContratDetails = (id: number) => 
  apiClient.get(`/contrats/${id}`);

export const signerContrat = (id: number, signature: string) => 
  apiClient.post(`/contrats/${id}/signer`, { signature });

export const getMesPaiements = () => 
  apiClient.get('/paiements');

export const getMesDocuments = () => 
  apiClient.get('/documents');

export const uploadDocument = (formData: FormData) => 
  apiClient.post('/documents/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
