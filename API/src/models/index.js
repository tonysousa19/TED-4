const Usuario = require('./Usuario');
const Organizacao = require('./Organizacao');
const Categoria = require('./Categoria');
const Oportunidade = require('./Oportunidade');
const Inscricao = require('./Inscricao');
const Favorito = require('./Favorito');

// Associações
Usuario.hasOne(Organizacao, { foreignKey: 'usuario_id', onDelete: 'CASCADE' });
Organizacao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Organizacao.hasMany(Oportunidade, { foreignKey: 'organizacao_id' });
Oportunidade.belongsTo(Organizacao, { foreignKey: 'organizacao_id' });

Categoria.hasMany(Oportunidade, { foreignKey: 'categoria_id' });
Oportunidade.belongsTo(Categoria, { foreignKey: 'categoria_id' });

Usuario.hasMany(Inscricao, { foreignKey: 'usuario_id' });
Inscricao.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Oportunidade.hasMany(Inscricao, { foreignKey: 'oportunidade_id' });
Inscricao.belongsTo(Oportunidade, { foreignKey: 'oportunidade_id' });

Usuario.hasMany(Favorito, { foreignKey: 'usuario_id' });
Favorito.belongsTo(Usuario, { foreignKey: 'usuario_id' });

Oportunidade.hasMany(Favorito, { foreignKey: 'oportunidade_id' });
Favorito.belongsTo(Oportunidade, { foreignKey: 'oportunidade_id' });

module.exports = {
  Usuario,
  Organizacao,
  Categoria,
  Oportunidade,
  Inscricao,
  Favorito
};