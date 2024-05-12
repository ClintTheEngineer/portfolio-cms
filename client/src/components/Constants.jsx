export const Constants = {
    SERVER_URL: (() => {
        const currentBaseUrl = window.location.hostname;
        if (currentBaseUrl === 'cander-portfolio-cms.netlify.app') {
            return 'https://cander-db.com';
        } else {
            return 'http://localhost:3333';
        }
    })(),
    APP_NAME: 'CanderDB'
}