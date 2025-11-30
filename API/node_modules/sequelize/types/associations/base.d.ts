const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Inscricao = sequelize.define('Inscricao', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  status: {
    type: DataTypes.ENUM('pending', 'approved', 'rejected', 'completed'),
    allowNull: false,
    defaultValue: 'pending'
  },
  notas: DataTypes.TEXT,
  usuario_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'usuarios',
      key: 'id'
    }
  },
  oportunidade_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'oportunidades',
      key: 'id'
    }
  }
}, {
  tableName: 'inscricoes'
});

module.exports = Inscricao;