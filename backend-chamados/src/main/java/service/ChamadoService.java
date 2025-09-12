package com.seusistemadechamados.sistemachamados.service;

import com.seusistemadechamados.sistemachamados.model.Chamado;
import com.seusistemadechamados.sistemachamados.model.ChamadoHistorico;
import com.seusistemadechamados.sistemachamados.repository.ChamadoHistoricoRepository;
import com.seusistemadechamados.sistemachamados.repository.ChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class ChamadoService {

    @Autowired
    private ChamadoRepository chamadoRepository;

    @Autowired
    private ChamadoHistoricoRepository historicoRepository;

    // ========================
    // MÉTODOS DE BUSCA
    // ========================

    public List<Chamado> getAllChamados() {
        return chamadoRepository.findAll();
    }

    public List<Chamado> getChamadosByStatus(String status) {
        return chamadoRepository.findByStatus(status);
    }

    public List<Chamado> buscarChamados(String termoBusca) {
        return chamadoRepository.findBySistemaContainingIgnoreCaseOrProblemaContainingIgnoreCaseOrDescricaoContainingIgnoreCase(termoBusca, termoBusca, termoBusca);
    }

    public List<ChamadoHistorico> getHistoricoChamado(Long chamadoId) {
        return historicoRepository.findByChamadoId(chamadoId);
    }

    // ========================
    // CRIAÇÃO E ATUALIZAÇÃO
    // =======================

    public Chamado createChamado(Chamado chamado) {
        return chamadoRepository.save(chamado);
    }

    @Transactional
    public Chamado updateChamado(Long id, Chamado chamadoDetails) {
        Optional<Chamado> optionalChamado = chamadoRepository.findById(id);
            // Atualiza o status do chamado
            // Se o status mudou, salva o registro no ChamadoHistorico

        if (optionalChamado.isPresent()) {
            Chamado chamadoExistente = optionalChamado.get();
            if (!chamadoExistente.getStatus().equals(chamadoDetails.getStatus())) {
                ChamadoHistorico historico = new ChamadoHistorico();
                historico.setChamado(chamadoExistente);
                historico.setStatusAnterior(chamadoExistente.getStatus());
                historico.setNovoStatus(chamadoDetails.getStatus());
                historicoRepository.save(historico);
            }

            chamadoExistente.setStatus(chamadoDetails.getStatus());
            return chamadoRepository.save(chamadoExistente);
        } else {
            return null;
        }
    }

    // ========================
    // REMOÇÃO
    // ========================

    @Transactional
    public void removerChamado(Long id) {
        historicoRepository.deleteByChamadoId(id);
        chamadoRepository.deleteById(id);
    }

    @Transactional
    public void removerTodos() {
        historicoRepository.deleteAll();
        chamadoRepository.deleteAll();
    }

    // ========================
    // CONTADORES
    // ========================

    public Map<String, Long> getChamadoCountsByStatus() {
        Map<String, Long> counts = new HashMap<>();
        counts.put("Todos", chamadoRepository.count());
        counts.put("Aberto", chamadoRepository.countByStatus("Aberto"));
        counts.put("Em Andamento", chamadoRepository.countByStatus("Em Andamento"));
        counts.put("Resolvido", chamadoRepository.countByStatus("Resolvido"));
        return counts;
    }
}