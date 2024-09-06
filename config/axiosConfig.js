const axios = require("axios")

const api = axios.create({
    baseURL: 'localhost:8081', // Defina a URL base da sua API
    timeout: 10000, // Define um tempo limite de 10 segundos
    headers: {
        'Content-Type': 'application/json',
    },
});

module.exports = api