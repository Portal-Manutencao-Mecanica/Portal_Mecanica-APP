# AGENTS.md — UI do Portal da Manutenção

## Escopo

Estas instruções se aplicam a todo o frontend localizado em `portalmanutencao/**`.

O objetivo deste arquivo é impedir que novas páginas sejam criadas com estilos isolados, componentes duplicados ou estruturas diferentes do restante do sistema. Toda alteração de interface deve fortalecer um único padrão visual e reutilizável.

---

## Contexto técnico do projeto

- Framework: Next.js com App Router.
- Linguagem: TypeScript em modo `strict`.
- UI: React.
- Estilização: Tailwind CSS.
- Ícones: `lucide-react`.
- Alias de importação: `@/*` aponta para `src/*`.
- Organização atual de componentes:
  - `src/components/atoms`
  - `src/components/molecules`
  - `src/components/organisms`
  - `src/components/templates`
- Tokens globais: `src/app/globals.css`.
- Layout autenticado principal: `src/components/templates/LayoutDesktop.tsx`.
- Fontes:
  - corpo: Roboto Flex;
  - títulos: Roboto Mono.

Não instalar outra biblioteca de componentes ou outro sistema de estilos sem solicitação explícita.

---

## Regra principal

Antes de criar qualquer página, componente ou estilo:

1. Procure componentes existentes que cumpram a mesma função.
2. Procure uma página existente com estrutura semelhante.
3. Reutilize o layout, os componentes e os tokens existentes.
4. Quando um componente compartilhado não atender ao caso, melhore o componente compartilhado em vez de criar uma versão local.
5. Só crie um componente novo quando houver uma responsabilidade visual realmente nova e reutilizável.

Nunca crie uma página visualmente independente do restante do sistema.

---

## Fonte da verdade visual

### Layout

Páginas autenticadas devem usar:

```tsx
<LayoutDesktop>
  {/* conteúdo da página */}
</LayoutDesktop>
```

`LayoutDesktop` já fornece:

- `Header`;
- `SideBar`;
- `Breadcrumbs`;
- fundo da área principal;
- rolagem;
- padding principal;
- largura máxima centralizada.

Não duplique dentro da página:

- Header;
- Sidebar;
- Breadcrumbs;
- `max-w-7xl`;
- padding externo equivalente ao layout;
- fundo geral da aplicação.

A página deve normalmente começar assim:

```tsx
<LayoutDesktop>
  <section className="space-y-6">
    {/* PageHeader */}
    {/* conteúdo */}
  </section>
</LayoutDesktop>
```

Evite wrappers como:

```tsx
<div className="max-w-6xl mx-auto p-8">
<div className="max-w-7xl mx-auto p-4 md:p-8">
```

quando o layout pai já controla largura e espaçamento.

### Tokens

Utilize os tokens definidos em `src/app/globals.css`.

Tokens atuais:

- `bg-weg-blue`
- `text-weg-blue`
- `bg-weg-warning`
- `bg-weg-negative`
- `bg-weg-info`
- `bg-weg-label-warning`
- `bg-weg-card-white`

Não invente novas cores com hex dentro das páginas, como:

```tsx
bg-[#00579D]
focus:ring-[#3498db]
text-[#FAFAFA]
```

Quando uma cor necessária não existir, adicione um token semântico em `globals.css` e reutilize-o.

Não use nomes de token inexistentes. Exemplo: `bg-weg-warn` não deve ser usado se o token definido é `bg-weg-warning`.

---

## Componentes existentes que devem ser reutilizados

Antes de usar HTML puro, verifique estes componentes:

### Átomos

- `Button`
- `Input`
- `DropDown`
- `ToggleButton`
- `MachineConditionBadge`
- `NotificationItem`

### Moléculas

- `Breadcrumbs`
- `DataRowCard`
- `MachineRow`
- `Pagination`
- `ToggleGroup`
- `StudentCard`
- `LabelWithCircle`

### Organismos

- `Header`
- `SideBar`
- `MachineTable`
- `LoginForm`
- `ExportSection`

### Templates

- `LayoutDesktop`
- `LoginTemplate`

A lista deve ser atualizada quando novos componentes compartilhados forem adicionados.

---

## Proibição de componentes locais duplicados

Não crie diretamente em páginas:

```tsx
<button className="...">
<input className="...">
<select className="...">
<textarea className="...">
```

quando existir componente compartilhado equivalente.

Exemplo incorreto:

```tsx
<label className="...">Nome</label>
<input className="w-full rounded-lg border ..." />
```

Exemplo correto:

```tsx
<Input
  label="Nome"
  name="name"
  value={form.name}
  onChange={handleChange}
  error={errors.name}
/>
```

Caso `Input` não suporte uma necessidade legítima, evolua sua API com props bem tipadas. Não copie o CSS do `Input` para a página.

Criar componentes compartilhados para lacunas reais, preferencialmente:

- `Select`;
- `Textarea`;
- `FormField`;
- `PageHeader`;
- `FormCard`;
- `EmptyState`;
- `LoadingState`;
- `ErrorState`;
- `ConfirmDialog`;
- `DataTable`.

Não criar todos por antecipação. Criar quando o uso real aparecer e migrar as duplicações existentes.

---

## Padrão obrigatório de página

### Página de listagem

Estrutura:

```tsx
<LayoutDesktop>
  <section className="space-y-6">
    <PageHeader
      title="Máquinas"
      description="Visualize e gerencie as máquinas cadastradas."
      action={
        <Button>Nova máquina</Button>
      }
    />

    <SearchAndFilters />

    <DataTable />

    <Pagination />
  </section>
</LayoutDesktop>
```

Enquanto `PageHeader` não existir, mantenha exatamente esta estrutura:

```tsx
<div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
  <div className="space-y-1">
    <h1 className="text-2xl font-bold text-gray-900 md:text-3xl">
      Título
    </h1>
    <p className="text-sm text-gray-500 md:text-base">
      Descrição curta.
    </p>
  </div>

  <Button>Ação principal</Button>
</div>
```

Regras:

- uma ação principal por cabeçalho;
- filtros abaixo do cabeçalho;
- tabela ou cards abaixo dos filtros;
- paginação no final;
- estados de loading, erro e vazio devem ocupar a mesma área do conteúdo;
- não usar dados mockados na página final quando já houver integração disponível;
- IDs vindos da API devem ser tratados como `string`/UUID, nunca `number`.

### Página de detalhes

Ordem:

1. cabeçalho com título, descrição/status e ações;
2. resumo principal;
3. seções de informação;
4. histórico, anexos ou relações;
5. ações destrutivas separadas.

Não espalhar botões de editar/excluir sem hierarquia.

### Página de criação e edição

Criação e edição do mesmo recurso devem reutilizar o mesmo formulário.

Estrutura recomendada:

```tsx
<LayoutDesktop>
  <section className="space-y-6">
    <PageHeader />

    <form className="space-y-6">
      <FormCard title="Informações gerais">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* campos compartilhados */}
        </div>
      </FormCard>

      <div className="flex flex-col-reverse gap-3 border-t border-gray-200 pt-4 sm:flex-row sm:justify-end">
        <Button variant="secondary" type="button">
          Cancelar
        </Button>
        <Button type="submit">
          Salvar
        </Button>
      </div>
    </form>
  </section>
</LayoutDesktop>
```

Regras:

- não duplicar formulário entre `criar` e `editar`;
- extrair um componente como `MachineForm`;
- a página controla busca, submit e navegação;
- o formulário controla campos e apresentação;
- labels e mensagens devem ser consistentes;
- loading deve aparecer no botão de submit;
- erro de campo fica junto ao campo;
- erro geral fica em um componente de feedback;
- ações devem permanecer na mesma posição em todas as telas.

---

## Padrão de componentes

### Button

Use somente variantes definidas no componente compartilhado:

- `primary`
- `secondary`
- `warning`
- `danger`

Não recrie variantes por `className` em cada página.

Botões com ícone devem usar a prop `icon`.

Ações:

- principal: `primary`;
- cancelar/voltar: `secondary`;
- atenção: `warning`;
- exclusão/inativação: `danger`.

Ações destrutivas exigem confirmação.

Não envolver `Button` em `Link` se isso gerar marcação interativa inválida. Quando necessário, evolua o componente para suportar renderização como link ou estilize um `Link` compartilhado com a mesma variante.

### Input, Select e Textarea

Todos devem compartilhar:

- altura;
- borda;
- raio;
- tipografia;
- padding;
- hover;
- foco;
- disabled;
- erro;
- label;
- texto auxiliar.

Não utilizar animações de escala ou ring somente em um tipo de campo.

Todo label deve usar `htmlFor`, e todo campo deve possuir `id`.

### Cards

Padrão visual:

```text
fundo branco ou token de card
borda cinza clara
rounded-xl
shadow-sm
padding consistente
```

Não misture `rounded-md`, `rounded-lg` e `rounded-xl` aleatoriamente para o mesmo tipo de elemento.

### Tabelas e linhas

Não use larguras fixas como `w-340`.

Use:

- `w-full`;
- grid consistente;
- `overflow-x-auto` no contêiner;
- largura mínima somente quando necessária;
- alinhamento estável de colunas;
- ações alinhadas à direita.

Uma tabela genérica deve receber definição de colunas, dados, loading e empty state em vez de cada domínio construir uma tabela nova.

---

## Espaçamento e dimensões

Use uma escala pequena e previsível:

- entre label e campo: `gap-1.5` ou `mb-1`;
- entre campos: `gap-5`;
- entre seções: `space-y-6`;
- padding de card: `p-6`;
- ações: `gap-3`;
- cabeçalho da página: `gap-4`.

Evite valores arbitrários:

```tsx
w-[1370px]
w-340
max-h-75
translate-x-[45%]
```

Valores arbitrários só são aceitáveis quando há justificativa visual clara e não existe classe padrão equivalente.

---

## Tipografia

- títulos de página: `text-2xl md:text-3xl font-bold text-gray-900`;
- título de seção: `text-lg font-semibold text-gray-800`;
- descrição de página: `text-sm md:text-base text-gray-500`;
- label: `text-sm font-medium text-gray-700`;
- ajuda: `text-xs text-gray-500`;
- erro: `text-sm text-red-700`.

Não criar uma escala diferente em cada página.

Textos visíveis devem estar em português do Brasil e com ortografia correta.

Código, componentes, tipos e propriedades devem usar nomes em inglês consistentes.

---

## Responsividade

Toda nova tela deve funcionar em:

- mobile;
- tablet;
- desktop.

Regras:

- começar por uma coluna;
- usar `md:grid-cols-2` somente quando houver espaço;
- ações empilham no mobile;
- tabelas usam rolagem horizontal;
- não usar largura fixa de página;
- sidebar e header não podem cobrir conteúdo;
- elementos clicáveis devem ter área adequada;
- testar textos longos e listas vazias.

---

## Acessibilidade

Obrigatório:

- `label` associado ao campo;
- `aria-label` em botões somente com ícone;
- foco visível;
- navegação por teclado;
- contraste adequado;
- não usar apenas cor para indicar status;
- botão real para ação, link real para navegação;
- `disabled` visual e funcional;
- `aria-live` para mensagens assíncronas importantes quando necessário;
- modal deve prender foco e fechar por Escape.

Não use `<a>` sem `href` como botão. Use `<button type="button">`.

---

## Componentes cliente e servidor

Páginas e componentes devem ser Server Components por padrão.

Adicionar `"use client"` somente quando houver:

- estado;
- efeito;
- evento;
- API exclusiva do navegador;
- hook de navegação cliente.

Não transformar uma página inteira em Client Component quando apenas o formulário ou filtro precisa ser interativo.

Separar:

```text
page.tsx              → busca inicial/composição
ResourcePageClient    → interação
ResourceForm          → formulário reutilizável
```

---

## Dados e tipos

- Não declarar o mesmo tipo de domínio dentro de várias páginas.
- Centralizar em `src/types` ou junto do módulo responsável.
- UUID deve ser `string`.
- Não usar `as any`.
- Não manter URL da API repetida em páginas.
- Centralizar cliente HTTP/configuração.
- Não misturar mock e integração real silenciosamente.
- Exibir loading, erro e empty state.
- Não usar `console.log` como comportamento final da interface.

Estas regras não autorizam mudança de contrato da API sem necessidade.

---

## Organização dos arquivos

Manter componentes genéricos em:

```text
src/components/atoms
src/components/molecules
src/components/organisms
src/components/templates
```

Componentes específicos de um domínio podem ficar próximos do domínio, por exemplo:

```text
src/features/machines/components
src/features/machines/types
src/features/machines/services
```

Não colocar componentes grandes e específicos diretamente dentro de `page.tsx`.

Uma página deve principalmente:

- obter parâmetros;
- buscar dados;
- aplicar autorização quando necessário;
- compor componentes;
- lidar com navegação.

---

## Processo obrigatório antes de implementar UI

Antes de editar código, o agente deve escrever uma análise curta contendo:

1. páginas semelhantes encontradas;
2. componentes reutilizáveis encontrados;
3. componente compartilhado que precisa ser melhorado;
4. inconsistências que serão removidas;
5. arquivos que serão alterados.

Depois da análise, implementar.

Não criar uma alternativa visual sem primeiro pesquisar o projeto.

---

## Processo de refatoração da UI existente

Ao padronizar telas atuais:

1. não fazer redesign completo;
2. preservar funcionalidades e rotas;
3. substituir HTML duplicado por componentes compartilhados;
4. remover padding e largura duplicados;
5. alinhar títulos, descrições e ações;
6. padronizar formulários;
7. padronizar tabelas/cards;
8. remover cores hex repetidas;
9. remover tipos duplicados;
10. remover `any`;
11. criar estados compartilhados de loading, erro e vazio;
12. testar responsividade;
13. executar lint e build.

Refatorar em etapas pequenas por domínio. Não alterar todas as páginas em um único arquivo gigantesco.

---

## Inconsistências conhecidas que devem ser tratadas

- Páginas adicionam `max-w-*`, `mx-auto` e padding mesmo dentro de `LayoutDesktop`, causando largura e espaçamento duplicados.
- Formulários de máquinas e turmas usam `input`, `select` e `textarea` com estilos locais apesar de existir `Input`.
- `Button` usa cores hardcoded e uma variante com token de nome divergente.
- `Input` usa uma cor de foco hardcoded diferente do token WEG.
- `DropDown` possui estilo diferente dos demais campos.
- `DataRowCard` possui largura fixa e não é responsivo.
- Há IDs numéricos em tipos de frontend, embora a API use UUID.
- Há uso de `as any`.
- Há dados mockados e URLs da API diretamente nas páginas.
- Loading, erro e empty state não possuem componentes/padrões compartilhados.
- Listagens de turmas e máquinas utilizam apresentações diferentes sem justificativa de domínio.
- Comentários temporários e código de protótipo permanecem em componentes finais.
- O README ainda é o padrão do `create-next-app` e não documenta o design system.

Ao corrigir uma dessas inconsistências, prefira uma solução compartilhada que impeça sua repetição.

---

## Validação obrigatória

Antes de concluir uma tarefa de UI, executar na pasta `portalmanutencao`:

```bash
npm run lint
npm run build
```

Também validar manualmente:

- desktop;
- mobile;
- teclado;
- loading;
- erro;
- lista vazia;
- texto longo;
- ação principal;
- ação destrutiva.

Não declarar a tarefa concluída se lint ou build falharem por mudanças realizadas.

---

## Checklist para novas páginas

- [ ] Usa `LayoutDesktop` ou `LoginTemplate`.
- [ ] Não duplica largura/padding do layout.
- [ ] Reutiliza componentes existentes.
- [ ] Não possui hex de cor local.
- [ ] Não possui largura fixa desnecessária.
- [ ] Tem título, descrição e ação no padrão.
- [ ] Tem loading, erro e empty state.
- [ ] É responsiva.
- [ ] É acessível por teclado.
- [ ] Usa UUID como string.
- [ ] Não usa `any`.
- [ ] Não repete URL da API.
- [ ] Não contém dados mockados como solução final.
- [ ] Criação e edição reutilizam o mesmo formulário.
- [ ] Lint e build passam.

---

## Formato da resposta do agente

Ao finalizar uma mudança visual, informar:

### Componentes reutilizados

Liste os componentes existentes usados.

### Componentes compartilhados alterados ou criados

Explique por que a alteração era necessária.

### Páginas padronizadas

Liste as rotas alteradas.

### Inconsistências removidas

Liste estilos e duplicações eliminados.

### Validação

Informe o resultado de:

```text
npm run lint
npm run build
```

### Pendências

Liste somente pendências reais. Não deixar `TODO` escondido no código.
