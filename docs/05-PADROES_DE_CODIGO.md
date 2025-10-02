# Padrões de Código

Para garantir a qualidade e consistência do código, adotamos as ferramentas **ESLint**, **Prettier**, **Zod** e **React Query**.

## Ferramentas

* **ESLint**: Ferramenta de linting para encontrar e corrigir problemas no código.
* **Prettier**: Formatador de código opinativo para garantir um estilo uniforme.
* **Zod**: Biblioteca de declaração e validação de esquemas para garantir a integridade dos dados.
* **React Query (TanStack Query)**: Biblioteca para gerenciamento de estado de servidor, caching e atualização de dados assíncronos.

## Configuração

As configurações para as ferramentas estão na raiz do projeto (`.eslintrc.js`, `.prettierrc.js`).

## Scripts (`package.json`)

* **`npm run lint`**: Executa o ESLint para verificar erros.
* **`npm run format`**: Executa o Prettier para formatar o código.

## Fluxo de Trabalho Recomendado

1. **Antes de commitar**: Execute `npm run lint` e `npm run format`.
2. **Integração com o Editor**: Configure as extensões do ESLint e Prettier em seu editor (ex: VS Code) para formatação automática ao salvar.

## Principais Convenções (`.prettierrc.js`)

* **Aspas simples**: `'`
* **Ponto e vírgula**: `false`
* **Vírgula no final**: `all`
* **Espaçamento**: 2 espaços para indentação.

## Gerenciamento de Estado

* **Estado do Servidor**: Gerenciado pelo **React Query**.
* **Estado Global do Cliente**: Gerenciado por **Contextos React** (ex: `AuthContext`).
* **Estado Local**: Gerenciado pelo hook `useState` do React.

## Navegação

A navegação será gerenciada pelo **React Navigation**, a biblioteca de navegação mais popular para React Native. A configuração ficará no diretório `src/navigation`.

## Validação de Dados

A validação de dados é feita com **Zod**. Todos os dados que entram na aplicação (ex: de uma API) ou são submetidos pelo usuário devem ser validados com um esquema Zod.