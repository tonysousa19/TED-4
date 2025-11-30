const express = require('express');
const cors = require('cors');
const app = express();

// Configuração do CORS
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

// Middleware para parsing JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Log de requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});

// Importar e usar rotas
const authRoutes = require('./routes/auth');
const mainRoutes = require('./routes/index');

app.use('/api/auth', authRoutes);
app.use('/api', mainRoutes);

// Rota de saúde
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API funcionando perfeitamente',
    timestamp: new Date().toISOString()
  });
});

// 🔽 CORRIGIDO: Rota não encontrada (sem usar *)
app.use((req, res, next) => {
  res.status(404).json({ 
    erro: 'Rota não encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Middleware de erro global
app.use((error, req, res, next) => {
  console.error('Erro global:', error);
  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
});

module.exports = app;