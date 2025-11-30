const app = require('./app');
const sequelize = require('./config/database');
const { Categoria } = require('./models');

const PORT = process.env.PORT || 4000;

// Função para inicializar dados padrão
async function inicializarDados() {
  try {
    // Criar categorias padrão se não existirem
    const categoriasPadrao = [
      { nome: 'Tecnologia', descricao: 'Oportunidades na área de tecnologia e TI' },
      { nome: 'Marketing', descricao: 'Oportunidades na área de marketing digital' },
      { nome: 'Design', descricao: 'Oportunidades na área de design e UX/UI' },
      { nome: 'Educação', descricao: 'Oportunidades na área de educação e ensino' },
      { nome: 'Saúde', descricao: 'Oportunidades na área de saúde e bem-estar' },
      { nome: 'Voluntariado', descricao: 'Trabalho voluntário e causas sociais' },
      { nome: 'Estágio', descricao: 'Oportunidades de estágio para estudantes' }
    ];

    for (const categoria of categoriasPadrao) {
      await Categoria.findOrCreate({
        where: { nome: categoria.nome },
        defaults: categoria
      });
    }
    
    console.log('✅ Dados padrão inicializados');
  } catch (error) {
    console.error('❌ Erro ao inicializar dados padrão:', error);
  }
}

// Inicializar servidor
async function startServer() {
  try {
    // Testar conexão com banco
    await sequelize.authenticate();
    console.log('✅ Conectado ao banco de dados SQLite');

    // Sincronizar modelos
    await sequelize.sync({ 
      force: false, // NUNCA usar true em produção
      alter: true 
    });
    console.log('✅ Modelos sincronizados com o banco');

    // Inicializar dados padrão
    await inicializarDados();

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`🚀 Servidor rodando na porta ${PORT}`);
      console.log(`📚 API disponível em: http://localhost:${PORT}`);
      console.log(`🔑 Endpoints de auth: http://localhost:${PORT}/api/auth`);
      console.log(`🎯 Endpoints principais: http://localhost:${PORT}/api`);
    });

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Inicializar aplicação
startServer();