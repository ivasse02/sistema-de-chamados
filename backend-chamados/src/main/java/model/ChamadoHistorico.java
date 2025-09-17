package com.seusistemadechamados.sistemachamados.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "chamado_historico")
public class ChamadoHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "chamado_id", nullable = false)
    private Chamado chamado;
    // Relacionamento com o chamado ao qual esse histórico pertence
    // Lazy fetch evita carregar o chamado completo a menos que seja necessário

    private String statusAnterior; // Status antes da alteração
    private String novoStatus; // Novo status após alteração
    private LocalDateTime dataAlteracao; // Data/hora da mudança de status


    // CONSTRUTOR
    public ChamadoHistorico() {
        this.dataAlteracao = LocalDateTime.now();
    }


    // GETTERS E SETTERS
    // Importante para persistência JPA e manipulação no serviço

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Chamado getChamado() {
        return chamado;
    }

    public void setChamado(Chamado chamado) {
        this.chamado = chamado;
    }

    public String getStatusAnterior() {
        return statusAnterior;
    }

    public void setStatusAnterior(String statusAnterior) {
        this.statusAnterior = statusAnterior;
    }

    public String getNovoStatus() {
        return novoStatus;
    }

    public void setNovoStatus(String novoStatus) {
        this.novoStatus = novoStatus;
    }

    public LocalDateTime getDataAlteracao() {
        return dataAlteracao;
    }

    public void setDataAlteracao(LocalDateTime dataAlteracao) {
        this.dataAlteracao = dataAlteracao;
    }
}