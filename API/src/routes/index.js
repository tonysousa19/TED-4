const express = require('express');
const router = express.Router();
const { Usuario, Organizacao, Oportunidade, Categoria, Favorito } = require('../models');
const authMiddleware = require('../middleware/auth');



// GET /api/ - Rota raiz
router.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API da Plataforma de Oportunidades está funcionando!',
    versao: '2.0.0',
    timestamp: new Date().toISOString()
  });
});

// GET /api/oportunidades - Listar todas as oportunidades
router.get('/oportunidades', async (req, res) => {
  try {
    const oportunidades = await Oportunidade.findAll({
      where: { is_active: true },
      include: [
        { 
          model: Organizacao,
          include: [Usuario]
        },
        { 
          model: Categoria 
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 20
    });

    res.json(oportunidades);
  } catch (error) {
    console.error('Erro ao buscar oportunidades:', error);
    res.status(500).json({ erro: 'Erro ao buscar oportunidades' });
  }
});

// POST /api/oportunidades - Criar nova oportunidade (PROTEGIDO)
router.post('/oportunidades', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    
    // Verificar se o usuário é uma organização
    if (user.role !== 'organization') {
      return res.status(403).json({ erro: 'Somente organizações podem criar oportunidades.' });
    }

    // Buscar ou criar organização para o usuário
    let organizacao = await Organizacao.findOne({ 
      where: { usuario_id: user.id } 
    });

    if (!organizacao) {
      organizacao = await Organizacao.create({
        nome: `Organização ${user.nome}`,
        descricao: `Organização de ${user.nome}`,
        website: '',
        telefone: '',
        endereco: '',
        usuario_id: user.id
      });
    }

    // Preparar dados da oportunidade
    const oportunidadeData = {
      ...req.body,
      organizacao_id: organizacao.id
    };

    // Remover categoria_id se for undefined/null
    if (!oportunidadeData.categoria_id) {
      delete oportunidadeData.categoria_id;
    }

    // Criar oportunidade
    const oportunidade = await Oportunidade.create(oportunidadeData);

    // Buscar oportunidade criada com relacionamentos
    const oportunidadeCompleta = await Oportunidade.findByPk(oportunidade.id, {
      include: [
        { 
          model: Organizacao,
          include: [Usuario]
        },
        { 
          model: Categoria 
        }
      ]
    });

    res.status(201).json(oportunidadeCompleta);

  } catch (error) {
    console.error('Erro ao criar oportunidade:', error);
    
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({ 
        erro: 'Dados inválidos', 
        detalhes: error.errors.map(e => e.message) 
      });
    }
    
    res.status(500).json({ 
      erro: 'Erro ao criar oportunidade',
      detalhes: error.message 
    });
  }
});

// GET /api/minhas-oportunidades - Oportunidades da organização logada (PROTEGIDO)
router.get('/minhas-oportunidades', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    if (user.role !== 'organization') {
      return res.status(403).json({ erro: 'Somente organizações podem ver suas oportunidades.' });
    }

    // Buscar organização do usuário
    const organizacao = await Organizacao.findOne({ 
      where: { usuario_id: user.id } 
    });

    if (!organizacao) {
      return res.json([]);
    }

    const oportunidades = await Oportunidade.findAll({
      where: { organizacao_id: organizacao.id },
      include: [
        { 
          model: Organizacao,
          include: [Usuario]
        },
        { 
          model: Categoria 
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(oportunidades);

  } catch (error) {
    console.error('Erro ao buscar minhas oportunidades:', error);
    res.status(500).json({ erro: 'Erro ao buscar oportunidades' });
  }
});

// POST /api/minha-organizacao - Criar organização para usuário (PROTEGIDO)
router.post('/minha-organizacao', authMiddleware, async (req, res) => {
  try {
    const { nome, descricao, website, telefone, endereco } = req.body;
    const user = req.user;

    // Verificar se usuário é organização
    if (user.role !== 'organization') {
      return res.status(403).json({ erro: 'Somente usuários organização podem criar organização.' });
    }

    // Verificar se já existe organização
    const organizacaoExistente = await Organizacao.findOne({
      where: { usuario_id: user.id }
    });

    if (organizacaoExistente) {
      return res.status(400).json({ erro: 'Usuário já possui uma organização.' });
    }

    const organizacao = await Organizacao.create({
      nome,
      descricao,
      website,
      telefone,
      endereco,
      usuario_id: user.id
    });

    res.status(201).json(organizacao);

  } catch (error) {
    console.error('Erro ao criar organização:', error);
    res.status(500).json({ erro: 'Erro ao criar organização' });
  }
});
// ... outras rotas ...

// 🔽 CERTIFIQUE-SE QUE ESTAS ROTAS ESTÃO NO routes/index.js

// GET /api/favoritos - Listar favoritos do usuário
router.get('/favoritos', authMiddleware, async (req, res) => {
  try {
    const user = req.user;

    const favoritos = await Favorito.findAll({
      where: { usuario_id: user.id },
      include: [
        {
          model: Oportunidade,
          include: [
            {
              model: Organizacao,
              include: [Usuario]
            },
            {
              model: Categoria
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const oportunidadesFavoritadas = favoritos.map(favorito => favorito.Oportunidade);
    res.json(oportunidadesFavoritadas);

  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ erro: 'Erro ao buscar favoritos' });
  }
});

// POST /api/favoritos - Adicionar favorito
router.post('/favoritos', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { oportunidade_id } = req.body;

    if (!oportunidade_id) {
      return res.status(400).json({ erro: 'ID da oportunidade é obrigatório' });
    }

    // Verificar se já está favoritada
    const favoritoExistente = await Favorito.findOne({
      where: {
        usuario_id: user.id,
        oportunidade_id: oportunidade_id
      }
    });

    if (favoritoExistente) {
      return res.status(400).json({ erro: 'Oportunidade já está nos favoritos' });
    }

    // Criar favorito
    const favorito = await Favorito.create({
      usuario_id: user.id,
      oportunidade_id: oportunidade_id
    });

    res.status(201).json({
      mensagem: 'Oportunidade adicionada aos favoritos',
      favorito
    });

  } catch (error) {
    console.error('Erro ao favoritar oportunidade:', error);
    res.status(500).json({ erro: 'Erro ao favoritar oportunidade' });
  }
});

// DELETE /api/favoritos/:oportunidade_id - Remover favorito
router.delete('/favoritos/:oportunidade_id', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { oportunidade_id } = req.params;

    const favorito = await Favorito.findOne({
      where: {
        usuario_id: user.id,
        oportunidade_id: oportunidade_id
      }
    });

    if (!favorito) {
      return res.status(404).json({ erro: 'Favorito não encontrado' });
    }

    await favorito.destroy();
    res.json({ mensagem: 'Oportunidade removida dos favoritos' });

  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ erro: 'Erro ao remover favorito' });
  }
});

// GET /api/favoritos/verificar/:oportunidade_id - Verificar se está favoritado
router.get('/favoritos/verificar/:oportunidade_id', authMiddleware, async (req, res) => {
  try {
    const user = req.user;
    const { oportunidade_id } = req.params;

    const favorito = await Favorito.findOne({
      where: {
        usuario_id: user.id,
        oportunidade_id: oportunidade_id
      }
    });

    res.json({ isFavorito: !!favorito });

  } catch (error) {
    console.error('Erro ao verificar favorito:', error);
    res.status(500).json({ erro: 'Erro ao verificar favorito' });
  }
});

module.exports = router;