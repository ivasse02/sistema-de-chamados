package com.seusistemadechamados.sistemachamados.repository;

// Importação do modelo Chamado
import com.seusistemadechamados.sistemachamados.model.Chamado;

//importação do JpaRepository
import org.springframework.data.jpa.repository.JpaRepository;

// Camada que lida com a comunicação com o banco de dados. Estende JpaRepository
public interface ChamadoRepository extends JpaRepository<Chamado, Long> {
}