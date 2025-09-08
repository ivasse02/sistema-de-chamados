package com.seusistemadechamados.sistemachamados.model;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import java.time.LocalDateTime;


@Entity
public class ChamadoHistorico {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // NOVO: Define um relacionamento de muitos-para-um com a entidade Chamado.
    // Muitos registros de histórico podem pertencer a um único chamado.
    @ManyToOne

    // Especifica a coluna que será a chave estrangeira (foreign key)
    // na tabela de histórico, ligando-a ao ID do chamado principal.
    @JoinColumn(name = "chamado_id")
    private Chamado chamado;

    // Campos que registram os dados da alteração.
    private String statusAnterior;
    private String novoStatus;
    private LocalDateTime dataAlteracao;

    // Getters e Setters
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