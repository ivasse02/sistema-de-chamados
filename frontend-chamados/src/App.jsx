import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

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

  // Novos estados para o modal de detalhes e histórico
  const [chamadoSelecionado, setChamadoSelecionado] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [historicoChamado, setHistoricoChamado] = useState([]);

  useEffect(() => {
    fetchChamados();
  }, [filtroStatus, termoBusca]);

  const fetchChamados = () => {
    let url = 'http://localhost:8080/api/chamados';
    const params = new URLSearchParams();

    if (filtroStatus !== 'Todos') {
        params.append('status', filtroStatus);
    }
    
    if (termoBusca) {
        params.append('termoBusca', termoBusca);
    }
    
    const queryString = params.toString();
    if (queryString) {
        url += `?${queryString}`;
    }

    axios.get(url)
      .then(response => {
        setChamados(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar os chamados:", error);
      });
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

    axios.post('http://localhost:8080/api/chamados', novoChamado)
      .then(response => {
        console.log("Chamado criado com sucesso:", response.data);
        setNovoChamado({
          status: 'Aberto',
          sistema: '',
          problema: '',
          detalhesProblema: ''
        });
        fetchChamados();
      })
      .catch(error => {
        console.error("Erro ao criar o chamado:", error);
        alert("Ocorreu um erro ao tentar criar o chamado.");
      });
  };

  const handleRemove = (id) => {
    const confirmar = window.confirm("Tem certeza que deseja remover este chamado?");
    if (confirmar) {
      axios.delete(`http://localhost:8080/api/chamados/${id}`)
        .then(() => {
          console.log(`Chamado com ID ${id} removido com sucesso.`);
          fetchChamados();
        })
        .catch(error => {
          console.error("Erro ao remover o chamado:", error);
          alert("Ocorreu um erro ao tentar remover o chamado.");
        });
    }
  };

  const handleStatusChange = (id, newStatus) => {
    axios.put(`http://localhost:8080/api/chamados/${id}`, { status: newStatus })
      .then(response => {
        console.log("Status do chamado atualizado com sucesso:", response.data);
        fetchChamados();
      })
      .catch(error => {
          console.error("Erro ao atualizar o status do chamado:", error);
          alert("Ocorreu um erro ao tentar atualizar o status do chamado.");
      });
  };

  // Funções para lidar com o modal
  const handleCardClick = (chamado) => {
    setChamadoSelecionado(chamado);
    setIsModalOpen(true);
    
    // Faz a requisição para buscar o histórico do chamado
    axios.get(`http://localhost:8080/api/chamados/${chamado.id}/historico`)
      .then(response => {
        setHistoricoChamado(response.data);
      })
      .catch(error => {
        console.error("Erro ao buscar o histórico:", error);
        setHistoricoChamado([]);
      });
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setChamadoSelecionado(null);
    setHistoricoChamado([]); // Limpa o histórico ao fechar o modal
  };

  return (
    <div className="App">
      <div className="gov-header">
        <img src="/logo-inss.png" alt="Logo INSS" className="gov-logo" />
      </div>

      <h1>Serviços de Chamados</h1>

      <div className="main-content">
        <div className="container">
          <div className="form-container">
            <h2>Novo Chamado</h2>
            <form onSubmit={handleSubmit}>
              <label>
                Sistema:
                <select
                  name="sistema"
                  value={novoChamado.sistema}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Selecione...</option>
                  <option value="SAT">SAT</option>
                  <option value="PAT">PAT</option>
                  <option value="MEU INSS">MEU INSS</option>
                </select>
              </label>
              <label>
                Problema:
                <select
                  name="problema"
                  value={novoChamado.problema}
                  onChange={handleInputChange}
                  required
                >
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
          <div className="lista-container">
            <h2>Lista de Chamados</h2>
            <div className="lista-header">
              <div className="filtro-container">
                <input
                  type="text"
                  placeholder="Buscar..."
                  value={termoBusca}
                  onChange={(e) => setTermoBusca(e.target.value)}
                />
                <button
                  className={`filtro-btn ${filtroStatus === 'Todos' ? 'active' : ''}`}
                  onClick={() => setFiltroStatus('Todos')}>
                  Todos
                </button>
                <button
                  className={`filtro-btn ${filtroStatus === 'Aberto' ? 'active' : ''}`}
                  onClick={() => setFiltroStatus('Aberto')}>
                  Abertos
                </button>
                <button
                  className={`filtro-btn ${filtroStatus === 'Resolvido' ? 'active' : ''}`}
                  onClick={() => setFiltroStatus('Resolvido')}>
                  Resolvidos
                </button>
              </div>
              <button onClick={fetchChamados} className="refresh-btn">
                Atualizar Lista
              </button>
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
                    <button className="remover-btn" onClick={(e) => { e.stopPropagation(); handleRemove(chamado.id); }}>
                      Remover
                    </button>
                  </div>
                  <p>ID: {chamado.id}</p>
                  <div className="status-selector" onClick={(e) => e.stopPropagation()}>
                      <label htmlFor={`status-${chamado.id}`}>Status:</label>
                      <select
                          id={`status-${chamado.id}`}
                          value={chamado.status}
                          onChange={(e) => handleStatusChange(chamado.id, e.target.value)}
                      >
                          <option value="Aberto">Aberto</option>
                          <option value="Em Andamento">Em Andamento</option>
                          <option value="Resolvido">Resolvido</option>
                      </select>
                  </div>
                  <p>Sistema: {chamado.sistema}</p>
                  <p>Problema: {chamado.problema}</p>
                  <p>Descrição: {chamado.descricao || 'Sem Descrição'}</p>
                  {chamado.detalhesProblema && <p>Detalhes: {chamado.detalhesProblema.substring(0, 50)}...</p>}
                  {chamado.dataCriacao && (
                    <p className="data-criacao">
                      **Data de Criação:** {new Date(chamado.dataCriacao).toLocaleString('pt-BR')}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Detalhes do Chamado */}
      {isModalOpen && chamadoSelecionado && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <span className="close-btn" onClick={closeModal}>&times;</span>
            <h2>Detalhes do Chamado #{chamadoSelecionado.id}</h2>
            <div className="modal-body">
              <p><strong>Status:</strong> {chamadoSelecionado.status}</p>
              <p><strong>Sistema:</strong> {chamadoSelecionado.sistema}</p>
              <p><strong>Problema:</strong> {chamadoSelecionado.problema}</p>
              <p><strong>Descrição:</strong> {chamadoSelecionado.descricao || 'Sem Descrição'}</p>
              <p><strong>Detalhes:</strong> {chamadoSelecionado.detalhesProblema}</p>
              <p><strong>Data de Criação:</strong> {new Date(chamadoSelecionado.dataCriacao).toLocaleString('pt-BR')}</p>
              {chamadoSelecionado.dataFechamento && (
                <p><strong>Data de Fechamento:</strong> {new Date(chamadoSelecionado.dataFechamento).toLocaleString('pt-BR')}</p>
              )}
              
              {/* Seção do Histórico */}
              <hr />
              <h4>Histórico do Chamado</h4>
              {historicoChamado.length > 0 ? (
                <ul>
                  {historicoChamado.map((historico, index) => (
                    <li key={index}>
                      <strong>{new Date(historico.dataAlteracao).toLocaleString('pt-BR')}</strong>: Status alterado de **{historico.statusAnterior}** para **{historico.novoStatus}**.
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Nenhum histórico de alterações para este chamado.</p>
              )}
            </div>
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