package com.seusistemadechamados.sistemachamados.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

// Anotação que define esta classe como uma entidade JPA,
@Entity

// Anotação do Lombok que gera automaticamente getters, setters,
@Data
public class Chamado {

    // Define que este campo é a chave primária da tabela.
    @Id

    // Configura a estratégia de geração de valor para a chave primária,
    // usando auto-incremento do banco de dados.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Campos simples que se tornam colunas na tabela
    private String titulo;
    private String descricao;
    private String status; // Exemplo: "Aberto", "Em Andamento", "Resolvido"
    private String sistema; // Exemplo: "SAT", "PAT"
    private String problema; // Exemplo: "indisponível", "lento"

    // Anotação que mapeia este campo para um tipo de dado grande (CLOB)
    @Lob
    private String detalhesProblema;

    // Anotação do Hibernate que preenche automaticamente este campo
    // com a data e hora de criação do registro.
    @CreationTimestamp

    // Mapeia o nome da coluna no banco de dados para "data_criacao".
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    // Mapeia o nome da coluna no banco de dados para "data_fechamento".
    // É preenchido pelo controlador quando o status muda para "Resolvido".
    @Column(name = "data_fechamento")
    private LocalDateTime dataFechamento;
}