// Importar os módulos 
const express = require('express');
const routes = express.Router();
const db = require('../db/connect');

// GET (Read) – Buscar todos os produtos
routes.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM produto');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao buscar produtos', erro: error.message });
  }
});

// POST (Create) – Criar novo produto
routes.post('/', async (req, res) => {
  const { nome, marca, preco, peso } = req.body;
  if (!nome || !marca || !preco || !peso) {
    return res.status(400).json({ mensagem: 'Todos os campos são obrigatórios' });
  }

  try {
    const sql = `INSERT INTO produto(nome, marca, preco, peso) VALUES ($1, $2, $3, $4) RETURNING *`;
    const valores = [nome, marca, preco, peso];
    const result = await db.query(sql, valores);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao criar produto', erro: error.message });
  }
});

// PUT (Update) – Atualizar produto por ID
routes.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, marca, preco, peso } = req.body;
  if (!id || !nome || !marca || !preco || !peso) {
    return res.status(400).json({ mensagem: 'ID e todos os campos são obrigatórios' });
  }

  try {
    const sql = `
      UPDATE produto
      SET nome = $1, marca = $2, preco = $3, peso = $4
      WHERE id = $5
      RETURNING *`;
    const valores = [nome, marca, preco, peso, id];
    const result = await db.query(sql, valores);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao atualizar produto', erro: error.message });
  }
});

// DELETE – Remover produto por ID
routes.delete('/:id', async (req, res) => {
  const { id } = req.params;
  if (!id) {
    return res.status(400).json({ mensagem: 'ID é obrigatório' });
  }

  try {
    const sql = 'DELETE FROM produto WHERE id = $1 RETURNING *';
    const result = await db.query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ mensagem: 'Produto não encontrado' });
    }
    res.status(200).json({ mensagem: `Produto com ID ${id} foi excluído com sucesso`, produto: result.rows[0] });
  } catch (error) {
    res.status(500).json({ mensagem: 'Erro ao excluir produto', erro: error.message });
  }
});

// Exportar as rotas
module.exports = routes;
