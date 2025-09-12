import axios from 'axios';

const API_URL = 'http://localhost:8080/api/chamados';

const payload = {
  status: 'Aberto',
  sistema: 'SAT',
  problema: 'lento',
  detalhesProblema: 'Sistema lento durante a carga de teste.'
};

async function enviarChamado() {
    try {
        await axios.post(API_URL, payload);
        // console.log(`Chamado enviado com sucesso!`);
    } catch (error) {
        console.error(`Falha ao enviar chamado: ${error.message}`);
    }
}

async function rodarTesteDeCarga() {
    console.log("Iniciando teste de carga com 500 requisições...");
    const inicio = Date.now();

    const promessas = [];
    for (let i = 0; i < 500; i++) {
        promessas.push(enviarChamado());
    }

    await Promise.all(promessas);

    const fim = Date.now();
    const tempoTotal = (fim - inicio) / 1000;
    const requisicoesPorSegundo = (500 / tempoTotal).toFixed(2);
    
    console.log(`\nTeste de carga finalizado!`);
    console.log(`Tempo total: ${tempoTotal} segundos`);
    console.log(`Requisições por segundo: ${requisicoesPorSegundo}`);
}

rodarTesteDeCarga();