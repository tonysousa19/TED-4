const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Oportunidade = sequelize.define('Oportunidade', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  titulo: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  descricao: DataTypes.TEXT,
  localizacao: DataTypes.STRING,
  area: DataTypes.STRING,
  vagas: { 
    type: DataTypes.INTEGER, 
    allowNull: false, 
    defaultValue: 1 
  },
  data_inicio: DataTypes.DATE,
  data_fim: DataTypes.DATE,
  prazo_inscricao: DataTypes.DATE,
  max_participantes: { 
    type: DataTypes.INTEGER, 
    defaultValue: 50 
  },
  requires_approval: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: false 
  },
  link: DataTypes.STRING,
  is_active: { 
    type: DataTypes.BOOLEAN, 
    defaultValue: true 
  },
  imagem: { 
    type: DataTypes.STRING, 
    defaultValue: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=400'
  },
  organizacao_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'organizacoes',
      key: 'id'
    }
  },
  categoria_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'categorias',
      key: 'id'
    }
  }
}, {
  tableName: 'oportunidades'
});

module.exports = Oportunidade;