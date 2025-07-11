/**
 * Servidor back-end utilizando o módulo Express que cria uma API Rest que realiza as operações de CRUD envolvendo os métodos HTTP (GET, PUT, DELETE, POST)
 * separados nas rotas Cliente e Produto
 */

// Importar o módulo Express
// Este módulo é instalado através do comando 'npm install express'
const express = require('express');

// criação do aplicativo servidor
const app = express();

require('dotenv').config();

// configuração de acesso ao servidor
const hostname = process.env.APP_HOST;
const port = process.env.APP_PORT;

const db = require('./db/connect');

app.use(express.json());

// importar as configurações de rotas
const clienteRotas = require('./routes/cliente');
const produtoRotas = require('./routes/produto');

// Rotear a raiz do projeto
app.get('/', (req, res) => {
    //emite uma mensagem com a funcionalidade do servidor
    res.status(200).send('Servidor API Rest que manipula as rotas /produto e /cliente')
})

// expondo as rotas configuradas em Cliente.js e Produto.js
app.use('/cliente', clienteRotas);
app.use('/produto', produtoRotas);

// rodar o servidor
app.listen(port, hostname, async () => {
  try{
    await db.query('SELECT 1');
    console.log(`Servidor rodando em http://${hostname}:${port}/`);
    console.log('conexão estabelecida com sucesso com o banco de dados');
  }
  catch(error) {
    console.error('Erro ao conectar com o banco de dados', error.message);
  }
});