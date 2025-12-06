# SIGAS – Sistema Inteligente para Gerenciamento de Agricultura Sintrópica

O **SIGAS (Sistema Inteligente para Gerenciamento de Agricultura Sintrópica)** é um sistema web voltado ao apoio da gestão econômico-financeira e do planejamento produtivo em propriedades que adotam **agricultura sintrópica**. O sistema foi desenvolvido em contexto acadêmico, como parte de um Trabalho de Conclusão de Curso (TCC), com foco em pequenos produtores e na organização de informações para tomada de decisão.

Além dos módulos de cadastro e gestão financeira, o SIGAS integra o **GerminAi**, um módulo inteligente para apoiar o planejamento agroflorestal em sistemas sintrópicos.

---

## Objetivos do sistema

- Organizar de forma estruturada os **dados de produtores, propriedades e unidades produtivas**.
- Registrar e acompanhar **lançamentos econômico-financeiros** (receitas, despesas, centros de custos etc.).
- Permitir a análise de informações por meio de **relatórios e indicadores básicos**.
- Integrar um módulo inteligente (GerminAi) para **apoiar o planejamento de sistemas agroflorestais sintrópicos**.

---

## Arquitetura

O SIGAS é organizado em uma arquitetura web em camadas, composta por:

- **Backend (Django)**  
  - API responsável pelas regras de negócio, persistência dos dados e exposição dos endpoints REST.
- **Frontend (React)**  
  - Interface web para interação com usuários (produtores, administradores e demais perfis).
- **Módulo GerminAi (Streamlit)**  
  - Aplicação web independente, incorporada ao SIGAS via `iframe`, focada em recomendações para agricultura sintrópica.

---

## Principais funcionalidades

- Cadastro de **usuários** e perfis de acesso.
- Cadastro de **produtores** e **propriedades rurais**.
- Registro de **lançamentos financeiros**, organizados por categorias e centros de custo.
- Visualização de **relatórios e listagens básicas** para apoio à gestão.
- Acesso ao **GerminAi** para auxílio no planejamento de sistemas agroflorestais sintrópicos.

> **Status:** projeto em desenvolvimento, com protótipo funcional para fins acadêmicos e de demonstração.

---

## Tecnologias utilizadas

- **Backend**
  - [Python 3.x](https://www.python.org/)
  - [Django](https://www.djangoproject.com/)
  - (Opcional) [Django REST Framework](https://www.django-rest-framework.org/), caso utilizado
  - Banco de dados relacional (ex.: SQLite/PostgreSQL, conforme configuração do projeto)

- **Frontend**
  - [React](https://react.dev/)
  - Gerenciador de pacotes: `npm` ou `yarn`

- **Módulo GerminAi**
  - [Python 3.x](https://www.python.org/)
  - [Streamlit](https://streamlit.io/)

---

## Estrutura do repositório

A estrutura atual do projeto segue, em linhas gerais, o padrão:

```text
/
├─ .venv/                  # Ambiente virtual Python (não versionado)
├─ backend/                # Projeto Django (API do SIGAS)
│  ├─ manage.py
│  ├─ sigas_backend/
│  ├─ cadastros/
│  └─ ...
│
├─ node_modules/           # Dependências do React (não versionado)
├─ public/                 # Pasta pública do React
├─ src/                    # Código-fonte do frontend (React)
├─ .gitignore
├─ package.json
├─ package-lock.json
└─ README.md               # Este arquivo
------
```
## Pré-requisitos
Antes de iniciar, é recomendado ter instalado:

Git

Python 3.10+

Node.js 16+ (inclui npm)

(Opcional) Virtualenv ou similar para isolar dependências Python

## Como executar o projeto
1. Clonando o repositório
bash
Copiar código
git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO_SIGAS.git
cd SEU_REPOSITORIO_SIGAS
Substitua SEU_USUARIO e SEU_REPOSITORIO_SIGAS pelos dados reais do seu GitHub.

2. Backend (Django)
Acesse a pasta do backend:

bash
Copiar código
cd backend
Crie e ative um ambiente virtual (exemplo com venv):

bash
Copiar código
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# .venv\Scripts\activate   # Windows (PowerShell/CMD)
Instale as dependências:

bash
Copiar código
pip install -r requirements.txt
Aplique as migrações:

bash
Copiar código
python manage.py migrate
Crie um superusuário (opcional, para acessar o admin):

bash
Copiar código
python manage.py createsuperuser
Execute o servidor de desenvolvimento:

bash
Copiar código
python manage.py runserver
O backend ficará disponível, por padrão, em:
http://127.0.0.1:8000/

3. Frontend (React)
De volta à raiz do projeto (onde está package.json):

bash
Copiar código
cd ..
npm install
Após instalar as dependências, execute o frontend:

bash
Copiar código
npm start
# ou, conforme sua configuração:
# npm run dev
O frontend ficará disponível normalmente em:
http://localhost:3000/ (ou porta configurada).

Variáveis de ambiente
As variáveis de ambiente do projeto devem ser configuradas em arquivos como .env, que não devem ser versionados.

Backend (backend/.env)
env
Copiar código
DEBUG=True
SECRET_KEY=sua_chave_secreta_segura

ALLOWED_HOSTS=127.0.0.1,localhost

# Configuração de banco de dados (exemplo com SQLite ou PostgreSQL)
# DATABASE_URL=postgres://usuario:senha@host:porta/banco

# Configuração de e-mail (exemplo)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=seu-email@gmail.com
EMAIL_HOST_PASSWORD=sua_senha_ou_app_password
DEFAULT_FROM_EMAIL=SIGAS <seu-email@gmail.com>

## Frontend
Caso o frontend consuma a API via variável de ambiente (exemplo com React padrão):

env
Copiar código
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
Ajuste o prefixo conforme o bundler usado (por exemplo, VITE_ se estiver usando Vite).

## Testes
Os testes automatizados podem ser executados com:

bash
Copiar código
# Backend
cd backend
python manage.py test

# Frontend (a partir da raiz, se configurado)
npm test

## Contexto acadêmico
Este projeto foi desenvolvido em contexto acadêmico, com foco em:

Organização e modelagem de dados relacionados à agricultura sintrópica.

Prototipação de um sistema de apoio à tomada de decisão para pequenos produtores.

Integração de um módulo inteligente (GerminAi) para apoio ao planejamento de sistemas agroflorestais.

O SIGAS pode ser evoluído para incluir novos módulos (por exemplo, análise de produtividade, integração com dados climáticos e geográficos, entre outros).

## Licença
Licenciado sob a Licença MIT.
Este projeto é de uso acadêmico. A reutilização parcial ou total do código deve citar a autora e a instituição 