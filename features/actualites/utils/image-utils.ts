// Fonction utilitaire pour formater les URLs d'images
export const formatImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";
  
  // Si c'est déjà une URL complète, la retourner
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Déterminer l'URL de base selon l'environnement
  const getBaseUrl = () => {
    // En production, utilise l'URL de l'API
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://api.ambassade-tchad.com';
    }
    
    // En développement, utiliser localhost avec le port 8081
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
  };
  
  const baseUrl = getBaseUrl();
  
  // Si c'est un chemin relatif, ajouter le préfixe de base
  if (imageUrl.startsWith('uploads/') || imageUrl.startsWith('uploads\\')) {
    // Remplacer les backslashes par des forward slashes pour la compatibilité
    const normalizedPath = imageUrl.replace(/\\/g, '/');
    const finalUrl = `${baseUrl}/${normalizedPath}`;
    return finalUrl;
  }
  
  // Si c'est un chemin qui commence par /, ajouter le préfixe de base
  if (imageUrl.startsWith('/')) {
    return `${baseUrl}${imageUrl}`;
  }
  // Par défaut, ajouter le préfixe de base
  return `${baseUrl}/${imageUrl}`;
};

// Fonction pour gérer les images stockées en base de données
export const formatDatabaseImageUrl = (imageUrl: string): string => {
  if (!imageUrl) return "";
  
  // Si c'est déjà une URL complète, la retourner
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }
  
  // Déterminer l'URL de base selon l'environnement
  const getBaseUrl = () => {
    // En production, utilise l'URL de l'API
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_API_URL || 'https://api.ambassade-tchad.com';
    }
    
    // En développement, utiliser localhost avec le port 8081
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8081';
  };
  
  const baseUrl = getBaseUrl();
  
  // Pour les images stockées en base de données, utiliser une route API spécifique
  // Supposons que l'API a une route pour servir les images depuis la base de données
  return `${baseUrl}/api/images/${encodeURIComponent(imageUrl)}`;
}; 