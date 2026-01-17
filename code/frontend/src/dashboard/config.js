
const getHostIP = () => {
    // Utilisation de l'IP fixe du serveur
    return '10.115.239.227';
    
    // Si vous avez besoin de revenir à la détection automatique, utilisez ce code :
    /*
    const currentHost = window.location.hostname;
    if (currentHost === 'localhost' || currentHost === '10.162.253.213') {
        return currentHost;
    }
    return '10.162.253.213';
    */
};

const host = getHostIP();

const Config = {
    FRONTEND_URL: `http://${host}:3000`,
    BACKEND_URL: `http://${host}:8000`,
    TIMEOUT: 10000 // 10 secondes de timeout
};

const BACKEND_URL = Config.BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api`;
export const UPLOADS_URL = `${BACKEND_URL}/uploads`;