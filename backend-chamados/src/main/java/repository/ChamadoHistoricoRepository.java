package com.seusistemadechamados.sistemachamados.repository;

import com.seusistemadechamados.sistemachamados.model.ChamadoHistorico;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface ChamadoHistoricoRepository extends JpaRepository<ChamadoHistorico, Long> {


    // CONSULTA POR CHAMADO
    List<ChamadoHistorico> findByChamadoId(Long chamadoId);


    // REMOÇÃO DE HISTÓRICO
    @Transactional
    void deleteByChamadoId(Long chamadoId);
}