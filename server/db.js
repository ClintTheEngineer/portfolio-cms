const Pool = require('pg').Pool;
require('dotenv').config();

const devConfig = new Pool({
  user: process.env.USER,
  password: process.env.PASSWORD,
  host: process.env.HOST,
  port: process.env.PORT,
  database: process.env.DATABASE
});

const proConfig = {
  connectionString: process.env.DB_URL
}

const pool = new Pool(process.env.NODE_ENV === "production" ? proConfig : devConfig);

/*    SEPARATION     */
/*
const dbConfig = {
  hostname: process.env.HOST_NAME,
  headers: {
    'Content-Type': 'application/json'
  }
};

const connect = (method, requestBody, callback) => {
  const requestOptions = {
    ...dbConfig,
    method: method
  };

  if (requestBody) {
    requestOptions.path = requestBody.path;
    requestOptions.headers.Authorization = requestBody.headers.Authorization;
  }

  const reqToRemoteServer = https.request(requestOptions, (response) => {
    let data = '';
    response.on('data', (chunk) => {
      data += chunk;
    });
    response.on('end', () => {
      console.log('Response Data:', data);
      if (response.statusCode >= 400) {
        console.error('Error:', data);
        callback(`Error from remote server: ${data}`, null);
      } else {
        callback(null, data);
      }
    });
  });

  reqToRemoteServer.on('error', (error) => {
    console.error('Error:', error);
    callback(`Error communicating with the remote server: ${error}`, null);
  });

  if (requestBody && method !== 'GET') {
    reqToRemoteServer.write(JSON.stringify(requestBody));
  }

  reqToRemoteServer.end();
};
*/
module.exports = pool;
//module.exports = { dbConfig, connect };
