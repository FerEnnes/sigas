# SIGAS – Sistema Inteligente para Gerenciamento de Agricultura Sintrópica

O **SIGAS** é um sistema web voltado ao apoio da gestão econômico-financeira e do planejamento produtivo em propriedades que adotam agricultura sintrópica.  
O sistema foi desenvolvido em contexto acadêmico, como parte de um Trabalho de Conclusão de Curso (TCC), com foco em pequenos produtores e na organização das informações para tomada de decisão.

Além dos módulos de cadastro e gestão financeira, o SIGAS integra o **GerminAI**, um módulo inteligente para apoiar o planejamento agroflorestal em sistemas sintrópicos.

---

## Objetivos do sistema

- Organizar de forma estruturada os dados de produtores, propriedades e unidades produtivas.  
- Registrar e acompanhar lançamentos econômico-financeiros (receitas, despesas, centros de custos etc.).  
- Permitir a análise de informações por meio de relatórios e indicadores básicos.  
- Integrar um módulo inteligente (GerminAI) para apoiar o planejamento de sistemas agroflorestais sintrópicos.

---

## Arquitetura

O SIGAS é organizado em uma arquitetura web em camadas:

- **Backend (Django)**  
  API responsável pelas regras de negócio, persistência dos dados e exposição dos endpoints REST.

- **Frontend (React)**  
  Interface web utilizada por produtores(as), administradores(as) e demais perfis de usuário.

- **Módulo GerminAI (Streamlit)**  
  Aplicação web independente, incorporada ao SIGAS via `iframe`, focada em recomendações para agricultura sintrópica.

---

## Principais funcionalidades

- Cadastro de usuários e perfis de acesso.  
- Cadastro de produtores e propriedades rurais.  
- Cadastro de clientes, fornecedores e contas do plano de contas.  
- Registro de lançamentos financeiros (contas a pagar, contas a receber etc.), organizados por categorias e centros de custos.  
- Visualização de listagens e relatórios básicos para apoio à gestão.  
- Acesso ao GerminAi para auxílio no planejamento de sistemas agroflorestais sintrópicos.

---

## Tecnologias utilizadas

- **Backend**
  - Python 3.10.18  
  - Django 5.2.5
  - Banco de dados relacional PostgreSQL   15.7

- **Frontend**
  - React  18.3.1
  - JavaScript  
  - `npm` como gerenciador de pacotes  

- **Módulo GerminAi**
  - Python 3.12
  - Google Gemini API (modelo: gemini-2.0-flash)
  - Streamlit  

---

## Estrutura do repositório

```text
/
├─ backend/                 # Projeto Django (API do SIGAS)
│  ├─ sigas_backend/        # Configurações principais do backend
│  ├─ cadastros/            # App de cadastros (clientes, fornecedores, contas etc.)
│  ├─ usuarios/             # App de usuários e autenticação
│  ├─ manage.py
│  └─ requirements.txt
│
├─ db_dumps/                # Dumps SQL usados no desenvolvimento
│  └─ sigas_full_YYYY-MM-DD.sql
│
├─ public/                  # Pasta pública do frontend React
│  ├─ index.html
│  ├─ favicon.ico
│  └─ ...
│
├─ src/                     # Código-fonte do frontend (React)
│  ├─ assets/               # Imagens e recursos estáticos
│  ├─ components/           # Componentes reutilizáveis
│  ├─ pages/                # Páginas (Login, Dashboard, Contas etc.)
│  ├─ services/             # Serviços de acesso à API
│  ├─ utils/                # Funções utilitárias
│  ├─ App.js
│  └─ index.js
│
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md

Pastas como `.venv/` (ambiente virtual Python) e `node_modules/` (dependências do React) são específicas do ambiente local e não devem ser versionadas.
```
---

## Repositórios relacionados

- **SIGAS – sistema completo (frontend + backend):**  
  https://github.com/FerEnnes/sigas

- **GerminAi – módulo inteligente para agricultura sintrópica:**  
  https://github.com/FerEnnes/GerminAi

O repositório do GerminAi possui instruções próprias de instalação e uso.

---

## Pré-requisitos

Para executar o projeto localmente, recomenda-se ter instalado:

- Git  
- Python 3.10.18  
- Node.js 16 ou superior (inclui `npm`)  
- Ferramenta para ambientes virtuais Python (`venv`, `virtualenv` etc.)

---

## Como executar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/FerEnnes/sigas.git
cd sigas
```
---

### 2. Backend (Django)

Acesse a pasta do backend:

```bash
cd backend
```
---

Crie e ative um ambiente virtual (exemplo com venv):

    python -m venv .venv

# Linux / macOS

    source .venv/bin/activate

# Windows (PowerShell / CMD)

    .\.venv\Scripts\activate

Instale as dependências:

    pip install -r requirements.txt

Aplique as migrações do banco:

    python manage.py migrate

Crie um superusuário (opcional, para acessar o painel administrativo do Django):

    python manage.py createsuperuser

Execute o servidor de desenvolvimento:

    python manage.py runserver

Por padrão, o backend ficará disponível em:

    http://127.0.0.1:8000/

### 3. Frontend (React)

Em outro terminal, na raiz do projeto (`sigas/`):

    cd sigas   # caso ainda não esteja na raiz
    npm install
    npm start

O frontend ficará disponível normalmente em:

    http://localhost:3000/

(ou outra porta definida pelo React).

## Variáveis de ambiente

As variáveis de ambiente devem ser definidas em arquivos .env, que não devem ser versionados.

Backend (backend/.env)

Exemplo de configuração:
```
DEBUG=True
SECRET_KEY=sua_chave_secreta_segura
ALLOWED_HOSTS=127.0.0.1,localhost
````

# Configuração de banco de dados (exemplo com PostgreSQL)
```
DATABASE_URL=postgres://usuario:senha@host:porta/banco
```
# Configuração de e-mail (exemplo)
```
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua_senha_ou_app_password
DEFAULT_FROM_EMAIL=SIGAS <seu-email@gmail.com>
```
Ajuste os valores conforme o ambiente (desenvolvimento, teste ou produção).

## Frontend (.env na raiz do projeto React)

Exemplo de configuração:
```
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```
## Execução dos testes

### Backend (Django)

Na pasta backend/:

        python manage.py test

### Frontend (React)

Na raiz do projeto:

        npm test

--- 
## Contexto acadêmico

- Este projeto foi desenvolvido em contexto acadêmico, com foco em:

- Organização e modelagem de dados relacionados à agricultura sintrópica.

- Prototipação de um sistema de apoio à tomada de decisão para pequenos produtores.

- Integração de um módulo inteligente (GerminAi) para apoio ao planejamento de sistemas agroflorestais.

- O SIGAS pode ser evoluído para incluir novos módulos, como análise de produtividade, integração com dados climáticos e geográficos, entre outros.
---
## Licença

Este projeto está licenciado sob a Licença MIT.

A reutilização parcial ou total do código deve citar a autora e a instituição.