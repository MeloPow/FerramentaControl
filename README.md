# 🧠 EQUILIBRA MANAGER

**Sistema Desktop para Gestão de Clínicas de Psicologia**

O Equilibra Manager é uma aplicação moderna, responsiva e funcional desenvolvida com **React + Electron + TypeScript**, com foco na gestão de **pacientes, sessões e agenda de profissionais da psicologia**.

---

## 🚀 Tecnologias utilizadas

- ⚛️ **React** + **TypeScript**
- ⚡ **Electron Forge** (desktop app)
- 💅 **MUI (Material UI)** para design visual
- 💽 **better-sqlite3** como banco de dados local
- 🎯 **Git + SSH** para versionamento seguro
- 🎨 CSS customizado com `Colors.ts` e `styles.ts`

---

## 🧩 Estrutura geral

```
📦 src/
├── assets/                # Fontes e imagens
├── db/                   # Banco de dados (SQLite)
├── renderer/             # Interface com React
│   ├── components/       # Campos e cartões reutilizáveis
│   ├── layouts/          # Layout principal
│   ├── pages/            # Agenda, Pacientes, Sessões etc.
│   ├── services/         # Comunicação com DB
│   └── styles/           # Estilização global
├── types/                # Tipagens auxiliares
├── renderer.tsx          # Entrada da interface
└── preload.ts            # Integração segura com Electron
```

---

## 🗂️ Funcionalidades atuais

- ✅ Cadastro e edição de pacientes
- ✅ Visualização e gerenciamento de sessões
- ✅ Agenda semanal com interface em grade
- ✅ Splash screen e layout responsivo
- ✅ Banco de dados local (`equilibra.db`)
- ✅ Separação visual por componentes reutilizáveis

---

## 📦 Como executar

### 1. Instale as dependências:

```bash
npm install
```

> Em caso de conflito:  
```bash
npm install --legacy-peer-deps
```

### 2. Rode o projeto com Electron:

```bash
npm start
```

### 3. Gere um executável:

```bash
npm run make
```

---

## 📌 Próximas etapas

- [ ] Filtro de sessões por status
- [ ] Geração de relatórios em PDF
- [ ] Login seguro com autenticação
- [ ] Integração com nuvem para backup

---

## 👨‍💻 Desenvolvedor

**Paulo Henrique de Melo Freitas**  
📫 [paulhenriquefreitas@hotmail.com](mailto:paulhenriquefreitas@hotmail.com)

---

> “Equilíbrio é a arte de continuar mesmo com o mundo girando.”
