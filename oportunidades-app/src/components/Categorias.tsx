// src/components/Categorias.tsx
import React from 'react';

interface Categoria {
  id: number;
  nome: string;
  icone: string;
}

interface CategoriasProps {
  categoriaSelecionada: number | null;
  onCategoriaSelecionada: (id: number | null) => void;
}

const categorias: Categoria[] = [
  { id: 1, nome: 'Tecnologia', icone: '💻' },
  { id: 2, nome: 'Saúde', icone: '🏥' },
  { id: 3, nome: 'Educação', icone: '📚' },
  { id: 4, nome: 'Negócios', icone: '💼' },
  { id: 5, nome: 'Artes', icone: '🎨' },
  { id: 6, nome: 'Esportes', icone: '⚽' }
];

export const Categorias: React.FC<CategoriasProps> = ({
  categoriaSelecionada,
  onCategoriaSelecionada
}) => {
  return (
    <div style={{ marginBottom: '20px' }}>
      <h3 style={{ marginBottom: '15px' }}>Categorias</h3>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
        <button
          onClick={() => onCategoriaSelecionada(null)}
          style={{
            padding: '10px 15px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            backgroundColor: categoriaSelecionada === null ? '#007bff' : 'white',
            color: categoriaSelecionada === null ? 'white' : 'black',
            cursor: 'pointer'
          }}
        >
          Todas
        </button>
        
        {categorias.map((categoria) => (
          <button
            key={categoria.id}
            onClick={() => onCategoriaSelecionada(categoria.id)}
            style={{
              padding: '10px 15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: categoriaSelecionada === categoria.id ? '#007bff' : 'white',
              color: categoriaSelecionada === categoria.id ? 'white' : 'black',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px'
            }}
          >
            <span>{categoria.icone}</span>
            <span>{categoria.nome}</span>
          </button>
        ))}
      </div>
    </div>
  );
};