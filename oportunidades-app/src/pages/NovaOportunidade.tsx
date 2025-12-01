import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { oportunidadeService } from '../services/oportunidadeService';

const NovaOportunidade: React.FC = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const [enviando, setEnviando] = useState(false);
  const [imagemFile, setImagemFile] = useState<File | null>(null);
  const [imagemPreview, setImagemPreview] = useState<string>('');
  const [erro, setErro] = useState('');

  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    localizacao: '',
    area: '',
    vagas: 1,
    data_inicio: '',
    data_fim: '',
    prazo_inscricao: '',
    max_participantes: 100,
    requires_approval: false,
    link: '',
    imagem: '',
    categoria_id: 1
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleImagemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {

      if (file.size > 5 * 1024 * 1024) {
        setErro('A imagem deve ter no máximo 5MB');
        return;
      }

      setImagemFile(file);
      setErro('');

      const reader = new FileReader();
      reader.onload = (e) => {
        setImagemPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!usuario || usuario.role !== 'organization') {
      setErro('Apenas organizações podem criar oportunidades.');
      return;
    }

    setEnviando(true);
    setErro('');

    try {

      if (!formData.titulo || !formData.descricao || !formData.localizacao || !formData.area) {
        throw new Error('Por favor, preencha todos os campos obrigatórios.');
      }

      const dadosEnvio = {
        ...formData,
        imagem: imagemPreview || formData.imagem
      };

      await oportunidadeService.criarOportunidade(dadosEnvio);

      const successAlert = document.createElement('div');
      successAlert.className = 'alert alert-success position-fixed top-0 start-50 translate-middle-x mt-3 z-3';
      successAlert.innerHTML = `
        <i class="bi bi-check-circle-fill me-2"></i>
        Oportunidade criada com sucesso!
      `;
      document.body.appendChild(successAlert);

      setTimeout(() => {
        successAlert.remove();
        navigate('/');
      }, 2000);

    } catch (error: any) {
      console.error('Erro ao criar oportunidade:', error);
      setErro(error.message || 'Erro ao criar oportunidade. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  };

  const areas = [
    'Tecnologia', 'Saúde', 'Educação', 'Negócios', 'Artes', 'Esportes',
    'Meio Ambiente', 'Direito', 'Engenharia', 'Marketing', 'Design', 'Outros'
  ];

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0">
            <div className="card-header bg-primary text-white py-3">
              <div className="d-flex align-items-center">
                <i className="bi bi-plus-circle-fill fs-3 me-3"></i>
                <div>
                  <h1 className="h3 mb-0">Nova Oportunidade</h1>
                  <p className="mb-0 opacity-75">
                    Compartilhe uma oportunidade educacional ou profissional
                  </p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-md-5">
              {erro && (
                <div className="alert alert-danger alert-dismissible fade show mb-4" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {erro}
                  <button 
                    type="button" 
                    className="btn-close" 
                    onClick={() => setErro('')}
                  ></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                {}
                <div className="mb-5">
                  <h5 className="border-bottom pb-2 mb-4 text-primary">
                    <i className="bi bi-info-circle me-2"></i>
                    Informações Básicas
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="titulo"
                          name="titulo"
                          value={formData.titulo}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Título da oportunidade"
                          required
                        />
                        <label htmlFor="titulo">
                          <i className="bi bi-card-heading me-2"></i>
                          Título *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <select
                          id="area"
                          name="area"
                          value={formData.area}
                          onChange={handleInputChange}
                          className="form-select"
                          required
                        >
                          <option value="">Selecione uma área</option>
                          {areas.map((area) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                        <label htmlFor="area">
                          <i className="bi bi-tags me-2"></i>
                          Área *
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="form-floating mb-3">
                        <textarea
                          id="descricao"
                          name="descricao"
                          value={formData.descricao}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Descrição detalhada"
                          rows={4}
                          required
                          style={{ height: '120px' }}
                        />
                        <label htmlFor="descricao">
                          <i className="bi bi-text-paragraph me-2"></i>
                          Descrição *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-floating mb-3">
                        <input
                          type="text"
                          id="localizacao"
                          name="localizacao"
                          value={formData.localizacao}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="Localização"
                          required
                        />
                        <label htmlFor="localizacao">
                          <i className="bi bi-geo-alt me-2"></i>
                          Localização *
                        </label>
                        <div className="form-text">
                          Ex: São Paulo, Online, Remoto, Híbrido
                        </div>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          id="vagas"
                          name="vagas"
                          value={formData.vagas}
                          onChange={handleInputChange}
                          className="form-control"
                          min="1"
                          required
                        />
                        <label htmlFor="vagas">
                          <i className="bi bi-people me-2"></i>
                          Vagas *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-3">
                      <div className="form-floating mb-3">
                        <input
                          type="number"
                          id="max_participantes"
                          name="max_participantes"
                          value={formData.max_participantes}
                          onChange={handleInputChange}
                          className="form-control"
                          min="1"
                        />
                        <label htmlFor="max_participantes">
                          <i className="bi bi-person-badge me-2"></i>
                          Máx. Participantes
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="mb-5">
                  <h5 className="border-bottom pb-2 mb-4 text-primary">
                    <i className="bi bi-calendar-date me-2"></i>
                    Datas e Prazos
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input
                          type="date"
                          id="data_inicio"
                          name="data_inicio"
                          value={formData.data_inicio}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                        <label htmlFor="data_inicio">
                          <i className="bi bi-calendar-plus me-2"></i>
                          Data de Início *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input
                          type="date"
                          id="data_fim"
                          name="data_fim"
                          value={formData.data_fim}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                        <label htmlFor="data_fim">
                          <i className="bi bi-calendar-check me-2"></i>
                          Data de Término *
                        </label>
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-floating mb-3">
                        <input
                          type="date"
                          id="prazo_inscricao"
                          name="prazo_inscricao"
                          value={formData.prazo_inscricao}
                          onChange={handleInputChange}
                          className="form-control"
                          required
                        />
                        <label htmlFor="prazo_inscricao">
                          <i className="bi bi-clock me-2"></i>
                          Prazo de Inscrição *
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="mb-5">
                  <h5 className="border-bottom pb-2 mb-4 text-primary">
                    <i className="bi bi-image me-2"></i>
                    Mídia e Links
                  </h5>

                  <div className="row g-3">
                    <div className="col-md-8">
                      <div className="form-floating mb-3">
                        <input
                          type="url"
                          id="link"
                          name="link"
                          value={formData.link}
                          onChange={handleInputChange}
                          className="form-control"
                          placeholder="https://..."
                        />
                        <label htmlFor="link">
                          <i className="bi bi-link-45deg me-2"></i>
                          Link para Mais Informações
                        </label>
                      </div>
                    </div>

                    <div className="col-12">
                      <div className="card border mb-3">
                        <div className="card-header bg-light">
                          <h6 className="mb-0">
                            <i className="bi bi-camera me-2"></i>
                            Imagem da Oportunidade
                          </h6>
                        </div>
                        <div className="card-body">
                          <div className="row g-3">
                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label d-block">
                                  <i className="bi bi-upload me-2"></i>
                                  Upload de Imagem
                                </label>
                                <div className="input-group">
                                  <input
                                    type="file"
                                    id="imagemUpload"
                                    accept="image/*"
                                    onChange={handleImagemChange}
                                    className="form-control"
                                  />
                                  <button 
                                    className="btn btn-outline-secondary" 
                                    type="button"
                                    onClick={() => document.getElementById('imagemUpload')?.click()}
                                  >
                                    <i className="bi bi-folder2-open"></i>
                                  </button>
                                </div>
                                <div className="form-text">
                                  Formatos: JPG, PNG, GIF (Máx: 5MB)
                                </div>
                              </div>
                            </div>

                            <div className="col-md-6">
                              <div className="mb-3">
                                <label className="form-label">
                                  <i className="bi bi-link-45deg me-2"></i>
                                  Ou use uma URL
                                </label>
                                <input
                                  type="url"
                                  id="imagemUrl"
                                  name="imagem"
                                  value={formData.imagem}
                                  onChange={handleInputChange}
                                  className="form-control"
                                  placeholder="https://exemplo.com/imagem.jpg"
                                />
                              </div>
                            </div>

                            {}
                            {imagemPreview && (
                              <div className="col-12">
                                <div className="border rounded p-3 bg-light">
                                  <div className="d-flex justify-content-between align-items-start mb-2">
                                    <h6 className="mb-0">
                                      <i className="bi bi-eye me-2"></i>
                                      Prévia da Imagem
                                    </h6>
                                    <button 
                                      type="button" 
                                      onClick={() => {
                                        setImagemFile(null);
                                        setImagemPreview('');
                                      }}
                                      className="btn btn-sm btn-outline-danger"
                                    >
                                      <i className="bi bi-trash me-1"></i>
                                      Remover
                                    </button>
                                  </div>
                                  <div className="text-center">
                                    <img 
                                      src={imagemPreview} 
                                      alt="Preview" 
                                      className="img-fluid rounded"
                                      style={{ maxHeight: '200px' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {}
                <div className="mb-5">
                  <h5 className="border-bottom pb-2 mb-4 text-primary">
                    <i className="bi bi-gear me-2"></i>
                    Configurações
                  </h5>

                  <div className="form-check form-switch mb-3">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="requires_approval"
                      name="requires_approval"
                      checked={formData.requires_approval}
                      onChange={handleInputChange}
                      role="switch"
                    />
                    <label className="form-check-label" htmlFor="requires_approval">
                      <i className="bi bi-shield-check me-2"></i>
                      Requer aprovação manual das inscrições
                    </label>
                    <div className="form-text">
                      As inscrições serão analisadas antes da aprovação
                    </div>
                  </div>
                </div>

                {}
                <div className="d-flex justify-content-between pt-4 border-top">
                  <button 
                    type="button" 
                    onClick={() => navigate('/')}
                    className="btn btn-outline-secondary px-4"
                  >
                    <i className="bi bi-x-circle me-2"></i>
                    Cancelar
                  </button>

                  <button 
                    type="submit" 
                    disabled={enviando}
                    className="btn btn-primary px-5"
                  >
                    {enviando ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Criando Oportunidade...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        Criar Oportunidade
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {}
          <div className="card border-0 bg-light mt-4">
            <div className="card-body">
              <h6 className="mb-3">
                <i className="bi bi-lightbulb text-warning me-2"></i>
                Dicas para uma boa oportunidade:
              </h6>
              <ul className="list-unstyled mb-0">
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Seja claro e objetivo no título
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Descreva todos os requisitos e benefícios
                </li>
                <li className="mb-2">
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Use uma imagem atraente e relevante
                </li>
                <li>
                  <i className="bi bi-check-circle-fill text-success me-2"></i>
                  Defina datas realistas e prazos claros
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NovaOportunidade;