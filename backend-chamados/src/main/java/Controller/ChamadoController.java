package com.seusistemadechamados.sistemachamados.controller;

import com.seusistemadechamados.sistemachamados.model.Chamado;
import com.seusistemadechamados.sistemachamados.model.ChamadoHistorico;
import com.seusistemadechamados.sistemachamados.service.ChamadoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173") // Permite requisições do frontend React
@RestController
@RequestMapping("/api/chamados") // Define a rota base da API
public class ChamadoController {

    @Autowired
    private ChamadoService chamadoService; // Injeção do serviço que contém a lógica de negócios


    // BUSCA DE CHAMADOS
    @GetMapping
    public List<Chamado> getAllChamados(@RequestParam(required = false) String status, @RequestParam(required = false) String termoBusca) {
        if (status != null && !status.isEmpty()) {
            return chamadoService.getChamadosByStatus(status);
        }
        if (termoBusca != null && !termoBusca.isEmpty()) {
            return chamadoService.buscarChamados(termoBusca);
        }
        return chamadoService.getAllChamados();
    }


    // CONTADORES DE STATUS
    @GetMapping("/contadores")
    public Map<String, Long> getChamadoCounts() {
        return chamadoService.getChamadoCountsByStatus();
    }


    // HISTÓRICO DE CHAMADOS
    @GetMapping("/{id}/historico")
    public List<ChamadoHistorico> getHistoricoChamado(@PathVariable Long id) {
        return chamadoService.getHistoricoChamado(id);
    }


    // CRIAÇÃO E ATUALIZAÇÃO
    @PostMapping
    public Chamado createChamado(@RequestBody Chamado chamado) {
        return chamadoService.createChamado(chamado);
    }

    @PutMapping("/{id}")
    public Chamado updateChamado(@PathVariable Long id, @RequestBody Chamado chamadoDetails) {
        return chamadoService.updateChamado(id, chamadoDetails);
    }


    // REMOÇÃO
    @DeleteMapping("/{id}")
    public void removerChamado(@PathVariable Long id) {
        chamadoService.removerChamado(id);
    }


    @DeleteMapping("/limpar-testes")
    public ResponseEntity<String> removerTodosChamados() {
        chamadoService.removerTodos();
        return ResponseEntity.ok("Todos os chamados foram removidos com sucesso.");
    }
}