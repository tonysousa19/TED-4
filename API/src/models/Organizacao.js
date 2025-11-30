const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Organizacao = sequelize.define('Organizacao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  nome: { 
    type: DataTypes.STRING, 
    allowNull: false 
  },
  descricao: DataTypes.TEXT,
  website: DataTypes.STRING,
  telefone: DataTypes.STRING,
  endereco: DataTypes.STRING,
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  }
}, {
  tableName: 'organizacoes'
});

module.exports = Organizacao;