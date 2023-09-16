require("dotenv").config();

const authsecret = process.env.AUTH0_SECRET_KEY;

// secret: '8xE3j_R0AkQhupOwOcCN0oLRHIB3RtsI1bnVRGAVhnJ9ClgTn00tE239v6dhq_a3',
const config = {
    authRequired: false,
    auth0Logout: true,
    secret: authsecret,
    baseURL: 'http://localhost:3000',
    clientID: process.env.AUTH0_CLIENT_ID,
    issuerBaseURL: 'https://dev-ueu8pgmosxm48d8z.us.auth0.com',
};


module.exports = config;