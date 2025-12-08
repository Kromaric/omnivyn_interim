import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert } from 'react-native';
import config from '../config';

const apiClient = axios.create({
  baseURL: config.API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: config.API_TIMEOUT,
});

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 seconde

// Fonction pour attendre
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Intercepteur pour ajouter le token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercepteur pour gérer les erreurs avec retry
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config: any = error.config;

    // Si c'est une erreur 401, déconnexion
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userData');
      return Promise.reject(error);
    }

    // Retry pour les erreurs réseau
    if (!error.response && config && !config._retry) {
      config._retryCount = config._retryCount || 0;

      if (config._retryCount < MAX_RETRIES) {
        config._retryCount += 1;
        console.log(`Tentative ${config._retryCount}/${MAX_RETRIES}...`);
        
        await sleep(RETRY_DELAY * config._retryCount);
        return apiClient(config);
      }

      // Si toutes les tentatives échouent
      Alert.alert(
        'Erreur de connexion',
        'Impossible de se connecter au serveur. Vérifiez votre connexion internet.',
        [{ text: 'OK' }]
      );
    }

    // Erreurs serveur
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as any)?.message || 'Une erreur est survenue';

      switch (status) {
        case 400:
          console.error('Erreur 400:', message);
          break;
        case 403:
          Alert.alert('Accès refusé', 'Vous n\'avez pas les permissions nécessaires');
          break;
        case 404:
          Alert.alert('Erreur', 'Ressource non trouvée');
          break;
        case 422:
          // Erreur de validation - laissé gérer par le composant
          break;
        case 500:
          Alert.alert('Erreur serveur', 'Une erreur est survenue sur le serveur');
          break;
        default:
          if (status >= 500) {
            Alert.alert('Erreur serveur', 'Le serveur rencontre des difficultés');
          }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
