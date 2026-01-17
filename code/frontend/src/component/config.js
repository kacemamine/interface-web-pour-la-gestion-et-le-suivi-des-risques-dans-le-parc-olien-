const getHostIP = () => {
    // IP fixe du serveur
    return '10.115.239.227';
};

const host = getHostIP();

const Config = {
    FRONTEND_URL: `http://${host}:3000`,
    BACKEND_URL: `http://${host}:8000`
};

const BACKEND_URL = Config.BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api`;
export const UPLOADS_URL = `${BACKEND_URL}/uploads`;