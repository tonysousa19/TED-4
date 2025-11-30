const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Favorito = sequelize.define('Favorito', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
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
  tableName: 'favoritos',
  indexes: [
    {
      unique: true,
      fields: ['usuario_id', 'oportunidade_id']
    }
  ]
});

module.exports = Favorito;