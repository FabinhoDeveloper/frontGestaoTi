// Configuração das variáveis de ambiente

require("dotenv").config()

// Importação das dependencias

const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require("body-parser")
const session = require("express-session")
const cors = require("cors")

const app = express();

// Importação das rotas

const loginRoutes = require("./routes/loginRoutes")
const cadastroRoutes = require("./routes/cadastroRoutes")
const vizualizarRoutes = require("./routes/vizualizarRoutes")

// Importação das funcoes helper
require('./views/helpers/helpers');

// Configurando o Handlebars como motor de templates
app.engine('handlebars', exphbs.engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.json());

app.use(cors());

// Middleware para servir arquivos estáticos (CSS, JS)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));

// Configuração de sessão
app.use(session({
    secret: process.env.SESSION_SECRET, // chave secreta para criptografia da sessão
    resave: true,
    saveUninitialized: false,
    cookie: { secure: false } // Em produção, isso deve ser 'true' se usar HTTPS
}));

// Configuração do uso das rotas

app.use("/", loginRoutes)
app.use("/vizualizar", vizualizarRoutes)
app.use("/cadastrar", cadastroRoutes)

app.get('/', (req, res) => {
    res.render('login', { title: 'Login - Gestão TI', layout: 'login' });
});

// Iniciar o servidor
const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0' ,() => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
