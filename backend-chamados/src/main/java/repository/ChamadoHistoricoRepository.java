package com.seusistemadechamados.sistemachamados.repository;

import com.seusistemadechamados.sistemachamados.model.ChamadoHistorico;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ChamadoHistoricoRepository extends JpaRepository<ChamadoHistorico, Long> {

    // Método para buscar o histórico de um chamado específico pelo seu ID
    List<ChamadoHistorico> findByChamadoIdOrderByDataAlteracaoAsc(Long chamadoId);
}