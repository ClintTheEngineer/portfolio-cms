export const Constants = {
    SERVER_URL: (() => {
        const currentBaseUrl = window.location.hostname;
        if (currentBaseUrl === 'cander-portfolio-cms.netlify.app') {
            return 'https://portfolio-cms-server-eiwk.onrender.com';
        } else {
            return 'https://portfolio-cms-server-eiwk.onrender.com';
        }
    })(),
    APP_NAME: 'Cander CMS 🗝️'
}