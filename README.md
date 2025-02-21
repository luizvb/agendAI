O BACKEND ESTÁ PRONTO. SÓ VAMOS TRABALHAR NO FRONTEND

## Título

Plataforma de Agendamento de Serviços de Salão de Beleza

## Objetivo

Criar uma aplicação que permita aos clientes agendarem serviços de salão de beleza e possibilite aos profissionais gerenciarem seus horários, acompanhando e atualizando agendamentos.

---

## Descrição Geral

### 1. Cadastro de Serviços

- **Campos Principais**

  - **Nome do serviço** (ex.: Corte de Cabelo, Manicure, Pedicure, etc.)
  - **Descrição do serviço** (detalhes sobre o que está incluso, tempo aproximado de duração, etc.)
  - **Preço** (custo padrão do serviço)
  - **Duração estimada** (em minutos ou horas)

- **Lógica**
  - Permitir a criação, edição e exclusão de serviços.
  - Armazenar em banco de dados para ser consumido pelo sistema de agendamento.
  - Possibilidade de configurar promoções ou pacotes especiais futuramente.

### 2. Cadastro de Profissionais

- **Campos Principais**

  - **Nome** ou **Nome completo** do profissional
  - **Especialidade** (ex.: Cabeleireiro, Manicure, Maquiador, etc.)
  - **Horários de trabalho** (dias da semana e faixas de horário disponíveis)
  - **Contato** (telefone, e-mail)

- **Lógica**
  - Vincular os serviços que cada profissional está habilitado a executar.
  - Gerar um calendário base de disponibilidade a partir dos horários de trabalho.
  - Possibilitar edição de disponibilidade em casos de folgas ou eventos pontuais.

### 3. Tela de Agendamento para o Cliente

- **Funcionalidades Principais**

  1. **Seleção do Serviço**: o cliente seleciona o tipo de serviço que deseja.
  2. **Escolha do Profissional**: a plataforma pode sugerir profissionais habilitados naquele serviço.
  3. **Seleção da Data e Horário**: exibir apenas horários vagos dentro da disponibilidade de cada profissional (considerando a duração do serviço escolhido).
  4. **Cadastro do Cliente** (caso não esteja cadastrado): nome, telefone, e-mail, etc.
  5. **Confirmação do Agendamento**: gerar uma tela de resumo com data, horário, profissional e serviço selecionado.

- **Lógica de Agendamento**
  - Verifica disponibilidade do profissional no horário escolhido.
  - Calcula o fim do serviço com base na duração do serviço.
  - Se horário estiver disponível, registra no banco de dados (criando uma reserva).
  - Envia notificação/alerta (e-mail, SMS, ou push) confirmando o agendamento para o cliente.

### 4. Tela de Agenda para o Profissional

- **Visão do Calendário**

  - Exibe todos os agendamentos do profissional selecionado em um formato de calendário (diário, semanal ou mensal).

- **Funcionalidades Principais**

  1. **Visualização de Agendamentos**: ver lista de clientes, serviços agendados, data, horário e status (confirmado, em andamento, finalizado, cancelado).
  2. **Atualização de Status**:
     - _Em andamento_: quando o cliente chega.
     - _Finalizado_: quando o serviço é concluído.
     - _Cancelado_: quando o profissional ou cliente não pode comparecer.
  3. **Edição de Agendamento**: possibilidade de mudança de horário (caso acordado com o cliente).
  4. **Cancelamento**: O profissional poderá cancelar um agendamento em situações necessárias, enviando notificação ao cliente.

- **Lógica de Exibição**
  - Filtra apenas as datas e horários correspondentes ao profissional logado.
  - Ordena por data/hora e separa por status (pendente, confirmado, etc.).

### 5. Gerenciamento e Lógicas Adicionais

- **Autenticação e Autorização**

  - Usuários clientes: acessam apenas seus agendamentos e podem criar novos.
  - Profissionais: acessam apenas sua própria agenda e podem modificar status.
  - Administradores: podem gerenciar serviços, profissionais e ter relatórios de agendamentos.

- **Notificações e Lembretes**

  - Envio de e-mail ou SMS para lembrar o cliente sobre o agendamento (24 horas antes, por exemplo).
  - Notificação de agendamento novo para o profissional.

- **Histórico de Agendamentos**

  - Cliente e profissional podem ver serviços passados para controle e acompanhamento.

- **Política de Cancelamento**
  - Definir regras de cancelamento: com quanta antecedência é possível cancelar sem cobrança de multa, etc.

### 6. Relatórios e Painel Administrativo (Opcional/Avançado)

- **Dashboards**

  - Número de agendamentos por período.
  - Serviços mais agendados.
  - Ranking de profissionais com mais atendimentos.

- **Gestão Financeira**

  - Controle de pagamentos, comissões e faturamento total.

- **Configurações Gerais**
  - Ajuste de horários de funcionamento geral do salão.
  - Ferramentas de personalização (logo, cores, etc.).

### 7. Fluxo Básico do Usuário (Cliente)

1. Acessa a plataforma (web ou aplicativo).
2. Seleciona o serviço desejado.
3. Escolhe o profissional (opcional, se quiser um específico).
4. Escolhe data e horário entre os disponíveis.
5. Faz login ou se cadastra, se necessário.
6. Recebe confirmação de agendamento.

### 8. Fluxo Básico do Usuário (Profissional)

1. Loga na plataforma com suas credenciais.
2. Visualiza a agenda por dia/semana/mês.
3. Acompanha os agendamentos: confirma presença, atualiza status, finaliza ou cancela se preciso.
4. Pode editar horários de trabalho e bloquear horários pontuais.

### 9. Considerações Técnicas

- **Frontend**: Next.JS e Tailwind

### 10. Escalabilidade e Segurança

- Implementar um sistema de permissões (roles) para garantir que cada usuário tenha acesso somente ao que lhe é permitido.
- Proteger informações sensíveis de clientes (endereço, telefone, etc.).
