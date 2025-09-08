package com.seusistemadechamados.sistemachamados.controller;

import com.seusistemadechamados.sistemachamados.model.Chamado;
import com.seusistemadechamados.sistemachamados.model.ChamadoHistorico;
import com.seusistemadechamados.sistemachamados.repository.ChamadoRepository;
import com.seusistemadechamados.sistemachamados.repository.ChamadoHistoricoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;


// Define que esta classe é um controlador REST e a rota base para todos os endpoints
@RestController
@RequestMapping("/api/chamados")

// Permite que o frontend acesse a API
@CrossOrigin(origins = "http://localhost:5173")
public class ChamadoController {

    // Injeta a dependência do repositório para interagir com a tabela 'chamado'
    @Autowired
    private ChamadoRepository chamadoRepository;

    @Autowired
    private ChamadoHistoricoRepository chamadoHistoricoRepository;

    // Endpoint para criar um novo chamado (requisição POST)
    @PostMapping
    public Chamado criarChamado(@RequestBody Chamado chamado) {
        return chamadoRepository.save(chamado);
    }

    // Endpoint para criar um novo chamado (requisição GET)
    // Permite filtrar por status e buscar por termo
    @GetMapping
    public List<Chamado> listarChamados(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String termoBusca) {

        List<Chamado> chamados = chamadoRepository.findAll();

        // Se nenhum status for especificado ou for "Todos", filtra os chamados para não incluir os "Resolvidos"
        if (status == null || status.isEmpty() || status.equalsIgnoreCase("Todos")) {
            chamados = chamados.stream()
                    .filter(c -> !c.getStatus().equalsIgnoreCase("Resolvido"))
                    .collect(Collectors.toList());

            // Se um status específico for fornecido, filtra por ele
        } else {
            chamados = chamados.stream()
                    .filter(c -> c.getStatus().equalsIgnoreCase(status))
                    .collect(Collectors.toList());
        }

        // Se um termo de busca for fornecido, filtra os resultados
        if (termoBusca != null && !termoBusca.isEmpty()) {
            String termoLower = termoBusca.toLowerCase();
            chamados = chamados.stream()
                    .filter(c -> c.getSistema().toLowerCase().contains(termoLower) ||
                            c.getProblema().toLowerCase().contains(termoLower) ||
                            c.getDetalhesProblema().toLowerCase().contains(termoLower))
                    .collect(Collectors.toList());
        }
        return chamados;
    }

    // Endpoint para buscar um chamado por ID (requisição GET)
    @GetMapping("/{id}")
    public Chamado buscarChamadoPorId(@PathVariable Long id) {
        return chamadoRepository.findById(id).orElse(null);
    }

    // Endpoint para buscar o histórico do chamado
    @GetMapping("/{id}/historico")
    public List<ChamadoHistorico> buscarHistoricoDoChamado(@PathVariable Long id) {
        return chamadoHistoricoRepository.findByChamadoIdOrderByDataAlteracaoAsc(id);
    }

    // Endpoint para atualizar o status de um chamado (requisição PUT)
    @PutMapping("/{id}")
    public ResponseEntity<Chamado> atualizarStatus(@PathVariable Long id, @RequestBody Map<String, String> requestBody) {
        Optional<Chamado> chamadoExistente = chamadoRepository.findById(id);

        if (chamadoExistente.isPresent()) {
            Chamado chamado = chamadoExistente.get();
            String novoStatus = requestBody.get("status");
            String statusAnterior = chamado.getStatus();

            // Verifica se o status mudou para evitar criar um registro de histórico desnecessário
            if (novoStatus != null && !novoStatus.equals(statusAnterior)) {

                // LÓGICA DO HISTÓRICO: Cria um novo registro de auditoria
                ChamadoHistorico historico = new ChamadoHistorico();
                historico.setChamado(chamado);
                historico.setStatusAnterior(statusAnterior);
                historico.setNovoStatus(novoStatus);
                historico.setDataAlteracao(LocalDateTime.now());
                chamadoHistoricoRepository.save(historico);

                // Atualiza o status do chamado principal
                chamado.setStatus(novoStatus);

                // Se o novo status for 'Resolvido', preenche a data de fechamento
                if (novoStatus.equalsIgnoreCase("Resolvido")) {
                    chamado.setDataFechamento(LocalDateTime.now());
                    // Se mudar para outro status, limpa a data de fechamento
                } else {
                    chamado.setDataFechamento(null);
                }

                Chamado chamadoAtualizado = chamadoRepository.save(chamado);
                return ResponseEntity.ok(chamadoAtualizado);
            } else {
                return ResponseEntity.badRequest().build();
            }
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint para remover um chamado por ID (requisição DELETE)
    @DeleteMapping("/{id}")
    public void removerChamado(@PathVariable Long id) {
        chamadoRepository.deleteById(id);
    }
}