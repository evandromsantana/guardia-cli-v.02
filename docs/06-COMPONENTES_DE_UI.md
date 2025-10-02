# Componentes de UI

Este documento descreve os componentes de UI reutilizáveis que formam a base do design system do Guardiã, localizados em `src/components`. Eles consomem as cores e constantes definidas em `src/constants`.

## 1. Button

Componente para todas as ações clicáveis.
**Localização:** `src/components/common/Button.tsx`

### Propriedades (Props)

| Prop | Tipo | Obrigatório | Padrão | Descrição |
| :--- | :--- | :--- | :--- | :--- |
| `title` | `string` | Sim | - | O texto do botão. |
| `onPress` | `() => void` | Sim | - | A função a ser chamada no clique. |
| `variant` | `'primary' \| 'action' \| 'alert'` | Não | `'primary'` | A variação de estilo do botão. |
| `disabled`| `boolean` | Não | `false` | Desativa o botão se `true`. |

### Variantes de Estilo

* **`primary`**: Botão padrão, usa a cor `COLORS.primary`.
* **`action`**: Botão de destaque, usa a cor `COLORS.accent`.
* **`alert`**: Botão para ações destrutivas, usa a cor `COLORS.danger`.

## 2. Input

Campo de texto estilizado para formulários.
**Localização:** `src/components/common/Input.tsx`

### Propriedades (Props)

| Prop | Tipo | Obrigatório | Descrição |
| :--- | :--- | :--- | :--- |
| `label` | `string` | Não | O rótulo exibido acima do campo. |
| `error` | `string` | Não | Exibe uma mensagem de erro e aplica estilo de borda de erro. |

*Aceita todas as outras props de um `TextInput` padrão do React Native.*

## 3. Container

Componente de layout principal para as telas.
**Localização:** `src/components/layout/Container.tsx`

### Funcionalidade

* Ocupa toda a tela (`flex: 1`).
* Aplica a cor de fundo `COLORS.background`.
* Adiciona um `padding` padrão para o conteúdo.
