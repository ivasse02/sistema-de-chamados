import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_BASE_URL = `http://${window.location.hostname}:8080/api/chamados`;

function App() {
  const [chamados, setChamados] = useState([]);
  const [novoChamado, setNovoChamado] = useState({
    status: 'Aberto',
    sistema: '',
    problema: '',
    detalhesProblema: '' 
  });
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [termoBusca, setTermoBusca] = useState('');
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historicoChamado, setHistoricoChamado] = useState([]);
  const [contadores, setContadores] = useState({
    Todos: 0,
    Aberto: 0,
    "Em Andamento": 0,
    Resolvido: 0
  });

  useEffect(() => {
    fetchChamados();
    fetchContadores();
  }, [filtroStatus, termoBusca]);

  const fetchChamados = () => {
    let url = API_BASE_URL;
    const params = new URLSearchParams();

    if (filtroStatus !== 'Todos') params.append('status', filtroStatus);
    if (termoBusca) params.append('termoBusca', termoBusca);

    const queryString = params.toString();
    if (queryString) url += `?${queryString}`;

    axios.get(url)
      .then(response => setChamados(response.data))
      .catch(error => console.error("Erro ao buscar os chamados:", error));
  };

  const fetchContadores = () => {
    axios.get(`${API_BASE_URL}/contadores`)
      .then(response => setContadores(response.data))
      .catch(error => console.error("Erro ao buscar os contadores:", error));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNovoChamado({ ...novoChamado, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (novoChamado.problema === 'outros' && (novoChamado.detalhesProblema.length < 30 || novoChamado.detalhesProblema.length === 0)) {
      alert("Por favor, forneça mais detalhes sobre o problema (mínimo de 30 caracteres).");
      return;
    }

    axios.post(API_BASE_URL, novoChamado)
      .then(() => {
        setNovoChamado({ status: 'Aberto', sistema: '', problema: '', detalhesProblema: '' });
        fetchChamados();
        fetchContadores();
      })
      .catch(error => {
        console.error("Erro ao criar o chamado:", error);
        alert("Ocorreu um erro ao tentar criar o chamado.");
      });
  };

  const handleRemove = (id) => {
    if (window.confirm("Tem certeza que deseja remover este chamado?")) {
      axios.delete(`${API_BASE_URL}/${id}`)
        .then(() => {
          fetchChamados();
          fetchContadores();
        })
        .catch(error => {
          console.error("Erro ao remover o chamado:", error);
          alert("Ocorreu um erro ao tentar remover o chamado.");
        });
    }
  };

  const handleStatusChange = (id, newStatus) => {
    axios.put(`${API_BASE_URL}/${id}`, { status: newStatus })
      .then(() => {
        fetchChamados();
        fetchContadores();
      })
      .catch(error => {
        console.error("Erro ao atualizar o status do chamado:", error);
        alert("Ocorreu um erro ao tentar atualizar o status do chamado.");
      });
  };

  const handleCardClick = (chamado) => {
    setChamadoSelecionado(chamado);
    setIsModalOpen(true);

    axios.get(`${API_BASE_URL}/${chamado.id}/historico`)
      .then(response => setHistoricoChamado(response.data))
      .catch(error => {
        console.error("Erro ao buscar o histórico:", error);
        setHistoricoChamado([]);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChamadoSelecionado(null);
    setHistoricoChamado([]);
  };

  return (
    <div className="App">
      <div className="gov-header">
        <img src="/logo-inss.png" alt="Logo INSS" className="gov-logo" />
      </div>

      <h1>Serviços de Chamados</h1>

      <div className="main-content">
        <div className="container">

          {/* Painel de contadores */}
          <div className="dashboard-contadores">
            <div className="contador-card total">
              <h3>Total</h3>
              <p>{contadores.Todos}</p>
            </div>
            <div className="contador-card aberto">
              <h3>Abertos</h3>
              <p>{contadores.Aberto}</p>
            </div>
            <div className="contador-card andamento">
              <h3>Em Andamento</h3>
              <p>{contadores["Em Andamento"]}</p>
            </div>
            <div className="contador-card resolvido">
              <h3>Resolvidos</h3>
              <p>{contadores.Resolvido}</p>
            </div>
          </div>

          {/* Formulário de novo chamado */}
          <div className="form-container">
            <h2>Novo Chamado</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Sistema:
                <select name="sistema" value={novoChamado.sistema} onChange={handleInputChange} required>
                  <option value="">Selecione...</option>
                  <option value="SAT">SAT</option>
                  <option value="PAT">PAT</option>
                  <option value="MEU INSS">MEU INSS</option>
                </select>
              </label>
              <label>
                Problema:
                <select name="problema" value={novoChamado.problema} onChange={handleInputChange} required>
                  <option value="">Selecione...</option>
                  <option value="indisponível">Indisponível</option>
                  <option value="lento">Lento</option>
                  <option value="outros">Outros</option>
                </select>
              </label>
              <label>
                Detalhes do Problema:
                {novoChamado.problema === 'outros' && <span style={{ color: 'red', marginLeft: '5px' }}>*</span>}
                <textarea
                  name="detalhesProblema"
                  value={novoChamado.detalhesProblema}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Descreva o problema em detalhes (mínimo de 30 caracteres)..."
                  required={novoChamado.problema === 'outros'}
                />
              </label>
              <button type="submit">Enviar Chamado</button>
            </form>
          </div>

          {/* Lista de chamados */}
          <div className="lista-container">
            <h2>Lista de Chamados</h2>
            <div className="lista-header">
              <div className="filtro-container">
                <input type="text" placeholder="Buscar..." value={termoBusca} onChange={e => setTermoBusca(e.target.value)} />
                <button className={`filtro-btn ${filtroStatus === 'Todos' ? 'active' : ''}`} onClick={() => setFiltroStatus('Todos')}>Todos</button>
                <button className={`filtro-btn ${filtroStatus === 'Aberto' ? 'active' : ''}`} onClick={() => setFiltroStatus('Aberto')}>Abertos</button>
                <button className={`filtro-btn ${filtroStatus === 'Em Andamento' ? 'active' : ''}`} onClick={() => setFiltroStatus('Em Andamento')}>Em Andamento</button>
                <button className={`filtro-btn ${filtroStatus === 'Resolvido' ? 'active' : ''}`} onClick={() => setFiltroStatus('Resolvido')}>Resolvidos</button>
              </div>
            </div>

            <div className="lista-chamados">
              {chamados.map(chamado => (
                <div
                  key={chamado.id}
                  className={`chamado-card status-${chamado.status.toLowerCase().replace(/\s/g, '-')}`}
                  onClick={() => handleCardClick(chamado)}
                >
                  <div className="card-header">
                    <h3>{chamado.titulo || 'Chamado #' + chamado.id}</h3>
                    <button className="remover-btn" onClick={(e) => { e.stopPropagation(); handleRemove(chamado.id); }}>Remover</button>
                  </div>
                  <p>ID: {chamado.id}</p>
                  <div className="status-selector" onClick={e => e.stopPropagation()}>
                    <label htmlFor={`status-${chamado.id}`}>Status:</label>
                    <select id={`status-${chamado.id}`} value={chamado.status} onChange={(e) => handleStatusChange(chamado.id, e.target.value)}>
                      <option value="Aberto">Aberto</option>
                      <option value="Em Andamento">Em Andamento</option>
                      <option value="Resolvido">Resolvido</option>
                    </select>
                  </div>
                  <p>Sistema: {chamado.sistema}</p>
                  <p>Problema: {chamado.problema}</p>
                  <p>Descrição: {chamado.descricao || 'Sem Descrição'}</p>
                  {chamado.detalhesProblema && <p>Detalhes: {chamado.detalhesProblema.substring(0, 50)}...</p>}
                  {chamado.dataCriacao && <p className="data-criacao">Data de Criação: {new Date(chamado.dataCriacao).toLocaleString('pt-BR')}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Modal de detalhes */}
      {isModalOpen && chamadoSelecionado && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2>Detalhes do Chamado #{chamadoSelecionado.id}</h2>
            <p><strong>Status:</strong> {chamadoSelecionado.status}</p>
            <p><strong>Sistema:</strong> {chamadoSelecionado.sistema}</p>
            <p><strong>Problema:</strong> {chamadoSelecionado.problema}</p>
            <p><strong>Descrição:</strong> {chamadoSelecionado.descricao || 'Sem Descrição'}</p>
            <p><strong>Detalhes:</strong> {chamadoSelecionado.detalhesProblema}</p>
            <p><strong>Data de Criação:</strong> {new Date(chamadoSelecionado.dataCriacao).toLocaleString('pt-BR')}</p>
            {chamadoSelecionado.dataFechamento && <p><strong>Data de Fechamento:</strong> {new Date(chamadoSelecionado.dataFechamento).toLocaleString('pt-BR')}</p>}

            <hr />
            <h4>Histórico do Chamado</h4>
            {historicoChamado.length > 0 ? (
              <ul>
                {historicoChamado.map((historico, index) => (
                  <li key={index}>
                    <strong>{new Date(historico.dataAlteracao).toLocaleString('pt-BR')}</strong>: Status alterado de <strong>{historico.statusAnterior}</strong> para <strong>{historico.novoStatus}</strong>.
                  </li>
                ))}
              </ul>
            ) : (
              <p>Nenhum histórico de alterações para este chamado.</p>
            )}
          </div>
        </div>
      )}

      <div className="footer-seal">
        <p>Copyright &copy; Guilherme Ivasse</p>
      </div>
    </div>
  );
}

export default App;
