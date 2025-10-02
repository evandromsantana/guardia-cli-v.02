# Estrutura de Pastas do Frontend (React Native CLI)

A estrutura de pastas do projeto Guardiã foi desenhada para ser escalável e organizada, separando as responsabilidades em diretórios claros e concisos. Todo o código-fonte da aplicação reside no diretório `src`.

## Estrutura Principal

GuardiaCliV02/
├── src/
│   ├── assets/
│   │   └── # Ativos estáticos (imagens, fontes, etc.)
│   ├── components/
│   │   └── # Componentes de UI reutilizáveis
│   ├── firebase/
│   │   └── firebaseConfig.ts   # Configuração e inicialização do Firebase
│   ├── navigation/
│   │   └── # Arquivos de configuração do React Navigation
│   ├── screens/
│   │   └── SignIn/
│   │       └── SignInScreen.tsx  # Tela de autenticação
│   └── services/
│       └── # Lógica de negócio e comunicação com APIs
└── ...

## Descrição dos Diretórios

*   **`src/`**: Contém todo o código-fonte da aplicação.
    *   **`assets/`**: Armazena todos os ativos estáticos, como fontes, imagens e ícones.
    *   **`components/`**: Contém componentes de UI reutilizáveis que são compartilhados por toda a aplicação (ex: botões customizados, inputs, cards).
    *   **`firebase/`**: Centraliza a configuração e inicialização do SDK do Firebase. O arquivo `firebaseConfig.ts` exporta as instâncias do `app` e `auth` para serem usadas no restante do código.
    *   **`navigation/`**: Será responsável por toda a lógica de navegação do aplicativo. Conterá os navegadores (Stack, Tab) e a configuração das rotas usando a biblioteca `React Navigation`.
    *   **`screens/`**: Contém as telas da aplicação. Cada subdiretório representa uma tela ou um fluxo de telas relacionadas.
        *   `SignIn/`: Contém a `SignInScreen.tsx`, responsável pelo fluxo de login social com Google.
    *   **`services/`**: (Opcional, pode ser criado quando necessário) Usado para encapsular a lógica de negócio e a comunicação com serviços externos e APIs, como as do Firebase (Firestore, Storage).
