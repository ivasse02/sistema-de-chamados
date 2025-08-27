package com.seusistemadechamados.sistemachamados.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import lombok.Data;
import java.time.LocalDateTime;

// Informa ao Spring que esta classe representa uma tabela
@Entity

// gera automaticamente getters, setters, toString, equals e hashCode para todos os campos.
@Data
public class Chamado {
    // --- Campos da Entidade (Colunas da Tabela) ---

   // indica que este campo é a chave primária da tabela
    @Id

    // configura como o ID será gerado.
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Define os campos simples que se tornarão colunas na tabela.
    private String titulo;

    private String descricao;

    private String status; // Ex: Aberto, Em Andamento, Fechado

    // Novos campos para os dados do formulário
    private String sistema; // Ex: SAT, PAT, MEU INSS

    private String problema; // Ex: indisponível, lento, outros

    // Para textos longos que utilizam mais dados (Descrição do problema)
    @Lob // Anotação para campos de texto longos
    private String detalhesProblema; // Caixa de texto para "outros"

    // Personaliza o nome da coluna no banco de dados
    @Column(name = "data_criacao")
    private LocalDateTime dataCriacao;

    @Column(name = "data_fechamento")
    private LocalDateTime dataFechamento;
}