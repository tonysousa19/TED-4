const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();
const { Usuario, Organizacao } = require('../models');

const JWT_SECRET = 'minha_chave_super_secreta_123';

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, role, organizacao } = req.body;

    // Validar dados obrigatórios
    if (!nome || !email || !senha || !role) {
      return res.status(400).json({ erro: 'Todos os campos obrigatórios devem ser preenchidos.' });
    }

    // Verificar se usuário já existe
    const userExists = await Usuario.findOne({ where: { email } });
    if (userExists) {
      return res.status(400).json({ erro: 'Email já cadastrado.' });
    }

    // Criar usuário
    const novoUsuario = await Usuario.create({ 
      nome, 
      email, 
      senha, 
      role 
    });

    let organizacaoCriada = null;

    // Se for organização, criar organização automaticamente
    if (role === 'organization') {
      try {
        organizacaoCriada = await Organizacao.create({
          nome: organizacao?.nome || `Organização ${nome}`,
          descricao: organizacao?.descricao || `Organização de ${nome}`,
          website: organizacao?.website || '',
          telefone: organizacao?.telefone || '',
          endereco: organizacao?.endereco || '',
          usuario_id: novoUsuario.id
        });
      } catch (orgError) {
        console.error('Erro ao criar organização:', orgError);
        // Continuar mesmo com erro na organização
      }
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: novoUsuario.id, 
        role: novoUsuario.role, 
        nome: novoUsuario.nome 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      mensagem: 'Usuário criado com sucesso!',
      token,
      usuario: {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        role: novoUsuario.role
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ erro: 'Erro interno do servidor ao registrar usuário.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ erro: 'Email e senha são obrigatórios.' });
    }

    // Buscar usuário
    const usuario = await Usuario.findOne({ where: { email } });
    if (!usuario) {
      return res.status(404).json({ erro: 'Usuário não encontrado.' });
    }

    // Verificar senha
    const senhaValida = await bcrypt.compare(senha, usuario.senha);
    if (!senhaValida) {
      return res.status(401).json({ erro: 'Senha incorreta.' });
    }

    // Gerar token JWT
    const token = jwt.sign(
      { 
        id: usuario.id, 
        role: usuario.role, 
        nome: usuario.nome 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      mensagem: 'Login realizado com sucesso!',
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        role: usuario.role
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ erro: 'Erro interno do servidor ao fazer login.' });
  }
});

// GET /api/auth/perfil
router.get('/perfil', async (req, res) => {
  try {
    // Este endpoint precisaria do authMiddleware
    // Por enquanto retornamos um placeholder
    res.json({ mensagem: 'Endpoint de perfil - implementar com auth' });
  } catch (error) {
    console.error('Erro no perfil:', error);
    res.status(500).json({ erro: 'Erro ao buscar perfil' });
  }
});

module.exports = router;