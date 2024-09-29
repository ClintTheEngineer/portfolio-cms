export const Constants = {
    SERVER_URL: (() => {
        const currentBaseUrl = window.location.hostname;
        if (currentBaseUrl === 'cander-portfolio-cms.netlify.app' || currentBaseUrl ==='https://66f8c7b71465edade6106d19--cander-portfolio-cms.netlify.app/login') {
            return 'https://portfolio-cms-server-eiwk.onrender.com';
        } else {
            return 'http://localhost:5000';
        }
    })(),
    APP_NAME: 'Cander CMS 🗝️'
}