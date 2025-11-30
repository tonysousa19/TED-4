import React from 'react';

interface BarraBuscaProps {
  termo: string;
  onTermoChange: (termo: string) => void;
}

export const BarraBusca: React.FC<BarraBuscaProps> = ({
  termo,
  onTermoChange
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <input
        type="text"
        placeholder="Buscar oportunidades..."
        value={termo}
        onChange={(e) => onTermoChange(e.target.value)}
        style={{
          width: '100%',
          padding: '12px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          fontSize: '16px'
        }}
      />
    </div>
  );
};