package com.seusistemadechamados.sistemachamados.repository;

import com.seusistemadechamados.sistemachamados.model.Chamado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {


    // CONSULTA POR STATUS
    List<Chamado> findByStatus(String status);
    // Retorna todos os chamados com o status especificado
    // Útil para filtros no frontend (Aberto, Em Andamento, Resolvido)


    // BUSCA POR TERMO (sistema, problema ou descrição)
    List<Chamado> findBySistemaContainingIgnoreCaseOrProblemaContainingIgnoreCaseOrDescricaoContainingIgnoreCase(String sistema, String problema, String descricao);

    // CONTADORES
    long countByStatus(String status);
    // Retorna a quantidade de chamados com determinado status

    long count();
    // Retorna a quantidade total de chamados
}