// Configuration de l'application
// Pour Android Emulator, utilisez : 10.0.2.2
// Pour device physique, utilisez votre IP locale (trouvez avec 'ipconfig')

export const config = {
  // Changez cette URL selon votre cas :
  // Option 1: Android Emulator
  // API_URL: 'http://10.105.208.232:8000/api/mobile',
  
  // Option 2: Device physique (décommentez et mettez votre IP)
  API_URL: 'http://192.168.1.31:8000/api/mobile',
  
  // Timeout pour les requêtes API (en millisecondes)
  API_TIMEOUT: 10000,
};

export default config;
