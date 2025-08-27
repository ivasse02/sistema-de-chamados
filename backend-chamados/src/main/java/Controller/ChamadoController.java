package com.seusistemadechamados.sistemachamados.controller;

import com.seusistemadechamados.sistemachamados.model.Chamado;
import com.seusistemadechamados.sistemachamados.repository.ChamadoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.List;

//lida com requisições HTTP e retorna dados no formato JSON ou XML
@RestController

//Define o caminho base para todos os endpoints neste controlador.
@RequestMapping("/api/chamados")

// Permite que requisições vindas do endereço acessem os endpoints deste controlador. Isso evita erros de CORS.
@CrossOrigin(origins = "http://localhost:5173")
public class ChamadoController {

   // O Spring Boot injeta automaticamente uma instância de ChamadoRepository.
   //Isso permite que acesse os métodos de manipulação de dados do banco de dados.
    @Autowired
    private ChamadoRepository chamadoRepository;

    // Este método lida com requisições POST para o caminho /api/chamados.
    // Ele cria um novo chamado no banco de dados.
    @PostMapping
    public Chamado criarChamado(@RequestBody Chamado chamado) {
        return chamadoRepository.save(chamado);
    }

    // Este método lida com requisições GET para o caminho /api/chamados. Ele busca e retorna todos os chamados cadastrados no banco de dados
    @GetMapping
    public List<Chamado> listarChamados() {
        return chamadoRepository.findAll();
    }

    // Este método lida com requisições GET para o caminho /api/chamados/{id}. Ele busca um chamado específico pelo seu ID.
    @GetMapping("/{id}")
    public Chamado buscarChamadoPorId(@PathVariable Long id) {
        return chamadoRepository.findById(id).orElse(null);
    }

    // Este método lida com requisições DELETE para o caminho /api/chamados/{id}. Ele remove um chamado do banco de dados com base no ID fornecido.
    @DeleteMapping("/{id}")
    public void removerChamado(@PathVariable Long id) {
        chamadoRepository.deleteById(id);
    }
}