# Achados da execução

## Credencial rápida divergente

Severidade: alta para ambiente de demonstração.

O botão `Administrador` preenche `seed.admin.senai@sesisenai.org.br`, mas a API respondeu `401 — Credenciais inválidas`. A conta `admin@teste.local`, documentada no README, autenticou normalmente.

## Labels sem associação programática

Severidade: média, acessibilidade.

O componente compartilhado `Input` renderiza `<label>` sem `htmlFor` e não garante um `id`. Na árvore acessível, os campos receberam nome pelo placeholder, não pelo label.

## Dois títulos `<h1>` nas páginas autenticadas

Severidade: média, semântica e leitores de tela.

Em `/alunos`, foram encontrados `Portal da Manutenção` e `Alunos`, ambos como `<h1>`.

## Elemento interativo aninhado

Severidade: média, HTML e teclado.

No cabeçalho desktop, os links de Ajuda e Configurações contêm botões, gerando marcação interativa aninhada.

## Recursos e aviso de imagem

Severidade: baixa.

- `/favicon.ico` respondeu `404`.
- O Next.js avisou que `logo-ctw.svg` teve apenas uma dimensão alterada no mobile.

Nenhum achado foi alterado nesta tarefa, cujo escopo foi testar e organizar evidências.
