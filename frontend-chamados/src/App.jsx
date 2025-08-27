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

  useEffect(() => {
    fetchChamados();
  }, []);

  const fetchChamados = () => {
    axios.get('http://localhost:8080/api/chamados')
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

  return (
    <div className="App">
      <h1>Sistema de Chamados</h1>
      <div className="container">
        {/* Formulário de Criação de Chamado */}
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

        {/* Lista de Chamados */}
        <div className="lista-container">
          <h2>Lista de Chamados</h2>
          <div className="lista-chamados">
            {chamados.map(chamado => (
              <div key={chamado.id} className="chamado-card">
                <h3>{chamado.titulo || 'Sem Título'}</h3>
                <p>ID: {chamado.id}</p>
                <p>Status: {chamado.status}</p>
                <p>Sistema: {chamado.sistema}</p>
                <p>Problema: {chamado.problema}</p>
                <p>Descrição: {chamado.descricao || 'Sem Descrição'}</p>
                {chamado.detalhesProblema && <p>Detalhes: {chamado.detalhesProblema}</p>}
                
                <button className="remover-btn" onClick={() => handleRemove(chamado.id)}>
                  Remover
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <p style={{ marginTop: '20px', fontSize: '0.8em', color: '#666', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           Guilherme Ivasse
          <span style={{
            display: 'inline-flex',
            justifyContent: 'center',
            alignItems: 'center',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            border: '1px solid #666',
            fontSize: '0.7em',
            marginLeft: '5px'
          }}>
            ©
          </span>
      </p>
    </div>
  );
}

export default App;