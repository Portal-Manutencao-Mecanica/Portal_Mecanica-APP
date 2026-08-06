# Decisão de uso das rotas PUT e PATCH

## Convenção adotada

- `PUT` é usado quando a tela de edição envia o estado completo aceito pelo DTO do recurso.
- `PATCH` é usado para alterações parciais e comandos de domínio, como aprovação, ativação, leitura, preferências e troca de senha.
- Uma mesma ação da interface não tenta `PUT` e depois `PATCH` como fallback. Falhas de contrato precisam aparecer e ser corrigidas, não mascaradas.

## Recursos avaliados nesta entrega

| Recurso | Rota usada pelo frontend | Rota alternativa | Decisão |
|---|---|---|---|
| Diário da máquina | `PUT /maquina-log/{id}` | `PATCH /maquina-log/{id}` | `PUT` é canônico para o formulário completo. `PATCH` permanece sem uso no portal para integrações que alterem somente campos escalares. |
| Locais | `PUT /lugar/{id}` | `PATCH /lugar/{id}` | `PUT` é canônico porque o recurso editável possui somente o nome. `PATCH` permanece sem uso no portal. |
| Designações | `PUT /designacao/{id}` | `PATCH /designacao/{id}` | `PUT` é canônico porque o formulário sempre envia o setor. `PATCH` permanece sem uso no portal. |

## Permanência no backend

As alternativas não devem ser removidas de forma imediata: elas constam no contrato publicado e a remoção seria incompatível com possíveis clientes externos. Devem continuar no backend, mas sem duplicação de uso no frontend.

Para uma remoção futura, primeiro é necessário marcar a rota como obsoleta na documentação da API, medir clientes por logs/auditoria e definir uma janela de descontinuação. Sem evidência de consumidores externos após essa janela, os aliases sem uso podem ser removidos em uma versão de contrato.

## Observação sobre designações

A entidade `Designation` está marcada no backend como legada e as solicitações de manutenção atuais usam `Sector` diretamente. A gestão foi mantida nesta entrega porque o CRUD ainda faz parte do contrato solicitado, mas a remoção futura deve avaliar o recurso inteiro, não apenas seu `PATCH`.
