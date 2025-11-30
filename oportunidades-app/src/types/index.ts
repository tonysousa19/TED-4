export interface Usuario {
  id: number;
  nome: string;
  email: string;
  role: 'student' | 'organization' | 'admin';
}

export interface Organizacao {
  id?: number;
  nome: string;
  descricao: string;
  website: string;
  telefone: string;
  endereco: string;
  usuario_id?: number;
}

export interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  register: (dados: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  nome: string;
  email: string;
  senha: string;
  role: 'student' | 'organization';
  organizacao?: {
    nome: string;
    descricao: string;
    website: string;
    telefone: string;
    endereco: string;
  };
}
export interface Oportunidade {
  id: number;
  titulo: string;
  descricao: string;
  localizacao: string;
  area: string;
  vagas: number;
  data_inicio: string;
  data_fim: string;
  prazo_inscricao: string;
  max_participantes: number;
  requires_approval: boolean;
  link: string;
  is_active: boolean;
  imagem: string;
  organizacao_id: number;
  categoria_id?: number;
  createdAt: string;
  updatedAt: string;
  Organizacao?: Organizacao;
  Categoria?: Categoria;
}

export interface NovaOportunidade {
  titulo: string;
  descricao: string;
  localizacao: string;
  area: string;
  vagas: number;
  data_inicio: string;
  data_fim: string;
  prazo_inscricao: string;
  max_participantes: number;
  requires_approval: boolean;
  link: string;
  imagem: string;
  categoria_id?: number;
}

export interface Favorito {
  id: number;
  usuario_id: number;
  oportunidade_id: number;
  createdAt: string;
  updatedAt: string;
  Oportunidade?: Oportunidade;
}