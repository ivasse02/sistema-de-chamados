package com.seusistemadechamados.sistemachamados;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
// esta classe é a principal de uma aplicação Spring Boot.
// Ela habilita a configuração automática, a injeção de dependências e a descoberta de componentes
@SpringBootApplication
public class SistemachamadosApplication {
        /*Método que inicia a aplicação*/
	public static void main(String[] args) {
		SpringApplication.run(SistemachamadosApplication.class, args);
	}

}
