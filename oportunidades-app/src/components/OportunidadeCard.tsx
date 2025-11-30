
import React from 'react';
import "../styles/OportunidadeCard.css"
interface Oportunidade {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  localizacao: string;
  data: string;
}

interface OportunidadeCardProps {
  oportunidade: Oportunidade;
}

export const OportunidadeCard: React.FC<OportunidadeCardProps> = ({ oportunidade }) => {
  return (
    <div style={{
      border: '1px solid #ddd',
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '15px',
      backgroundColor: 'white'
    }}>
      <h3 style={{ margin: '0 0 10px 0', color: '#333' }}>{oportunidade.titulo}</h3>
      <p style={{ margin: '0 0 10px 0', color: '#666' }}>{oportunidade.descricao}</p>
      <div style={{ display: 'flex', gap: '15px', fontSize: '14px', color: '#888' }}>
        <span>Categoria: {oportunidade.categoria}</span>
        <span>Local: {oportunidade.localizacao}</span>
        <span>Data: {oportunidade.data}</span>
      </div>
    </div>
  );

};
