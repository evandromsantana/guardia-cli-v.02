# Roadmap de Desenvolvimento: Guardiã

Este documento descreve o plano de desenvolvimento do aplicativo, dividido em fases claras para orientar a construção, o lançamento e a evolução do produto.

## 🥇 Fase 1: MVP (Versão 1.0) - Foco no Lançamento em Teresina

*Objetivo: Lançar a funcionalidade central para validar o produto com o público-alvo inicial (estudantes da UFPI).*

* **Autenticação de Usuárias:** (Implementado)
  * Cadastro com E-mail e Senha.
  * Login e Logout.
  * Criação de perfil básico (Nome, Telefone).
* **Gestão do Círculo de Guardiãs:** (Implementado)
  * Enviar convites para contatos (via número de telefone).
  * Receber e aceitar/recusar convites.
  * Visualizar e remover membros do círculo.
* **Funcionalidade "Trajeto Seguro":** (Implementado)
  * Iniciar um trajeto especificando um destino.
  * Selecionar guardiãs para monitorar a viagem.
  * Compartilhamento de localização em tempo real.
  * Finalizar o trajeto e notificar as guardiãs sobre a chegada segura.
* **Funcionalidade "Botão de Pânico":** (Implementado)
  * Ativação discreta do alerta.
  * Envio de notificações PUSH e SMS para o Círculo de Guardiãs.
  * Disponibilização do Painel do Guardião (Web) com a localização em tempo real.

## 🥈 Fase 2: Primeira Atualização (Versão 1.1) - Pós-Lançamento

*Objetivo: Refinar o produto com base no feedback inicial e adicionar funcionalidades de alto valor.*

* **Gravação de Áudio Ambiente:** (Implementado)
  * Implementar a gravação de áudio discreta após a ativação do botão de pânico.
  * Armazenar o áudio de forma segura no Cloud Storage.
  * Disponibilizar o áudio no Painel do Guardião.
* **Melhorias de UX/UI:**
  * Ajustes na interface com base no feedback das primeiras usuárias.
  * Otimização do fluxo de convite de guardiãs. (Implementado)
* **Notificações Avançadas:**
  * Implementar notificações mais robustas e com opções de personalização.

## 🥉 Fase 3: Expansão (Versão 2.0) - Futuro

*Objetivo: Escalar o produto e expandir o ecossistema de segurança.*

* **Histórico de Trajetos:** (Implementado)
  * Visualizar o histórico de viagens passadas.
* **Integração com Wearables:**
  * Ativação do botão de pânico via smartwatch (Apple Watch, Galaxy Watch).
* **Plano de Assinatura (Guardiã Plus):**
  * Recursos premium como Círculo de Guardiãs expandido, histórico de trajetos, etc.
* **Inteligência de Rota:**
  * Sugerir rotas mais seguras com base em dados históricos e de criminalidade.
* **Expansão Geográfica:**
  * Planejamento para o lançamento em outras capitais do Nordeste.