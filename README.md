# Sistema de Gerenciamento de Locação de Veículos PSG 🚗📋

Sistema web corporativo para gestão da frota, controle de contratos de locação mensal, motoristas habilitados (CNH B), documentação (RENAVAM / IPVA) e ficha detalhada de manutenções mecânicas preventivas.

---

## 🎯 Funcionalidades do Sistema PSG

1. **Documentação do Veículo (RENAVAM & IPVA Pago)**:
   - Campo para cadastro do número de registro nacional (**RENAVAM**, 11 dígitos).
   - Campo de controle de quitação do **Ano IPVA pago em** (ano de exercício/data de quitação).
   - Visualização rápida nos cards da frota, na tabela de veículos e nos relatórios de auditoria.

2. **Ficha de Manutenções do Veículo (15 Componentes Baseados no Padrão Operacional)**:
   - Na aba **Manutenções do Veículo** do cadastro e na tela de detalhes do carro, há o acompanhamento individual dos 15 componentes mecânicos:
     1. **Óleo**
     2. **Correia dentada**
     3. **Filtros (Cab. e Ar)**
     4. **Pastilhas de freio**
     5. **Discos**
     6. **Cabos de velas**
     7. **Velas**
     8. **Bobina**
     9. **Embreagem**
     10. **Amortecedores Dianteiros**
     11. **Amortecedores Traseiros**
     12. **Radiador**
     13. **Freio**
     14. **Bomba d'água**
     15. **Válvula Termostática**
   - Permite registro livre de quilometragem da troca, data ou observações com botão para atualização rápida.

3. **Locações 100% Mensais (Contratos de Locação)**:
   - Todo o modelo financeiro opera em mensalidades (**`R$/mês`**).
   - Emissão de contratos (`PSG-CTR-YYYY-XXXX`), vigência contratual em meses (1 a 36 meses), dia de vencimento mensal e franquia mensal de km.

4. **Motoristas Habilitados (Exclusivo Categoria B)**:
   - Cadastro focado em CNH B com auditoria contínua de vencimento e bloqueio de contratos caso a habilitação esteja expirada.

5. **Laudos de Vistoria Veicular PSG**:
   - Vistoria com checklist de 12 itens, medição de combustível, odômetro, diagrama visual de avarias e laudo oficial pronto para impressão ou PDF.

6. **Base de Dados Limpa & Backup**:
   - Sistema inicializado limpo, pronto para cadastrar os veículos reais da sua empresa.
   - Exportação completa em arquivo JSON para backup a qualquer momento.

---

## 🚀 Como Iniciar

1. Abra o terminal no diretório do projeto:
   ```bash
   cd "C:\Users\Vitor\.gemini\antigravity\scratch\locadora-app"
   ```

2. Execute o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse no navegador: [http://localhost:3000](http://localhost:3000)
