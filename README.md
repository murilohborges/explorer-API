# API ExplorerFood

Este repositório contém a API do ExplorerFood, um sistema para gestão de pedidos em um restaurante.

## Tecnologias Utilizadas

- Node.js
- Express
- Knex.js
- SQLite
- Stripe API
- Autenticação JWT

## Configuração do Projeto

1. Clone este repositório:
   ```sh
   git clone https://github.com/seu-usuario/api_explorerfood.git
   ```
2. Instale as dependências:
   ```sh
   npm install
   ```
3. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do projeto e preencha conforme o modelo `.env.example`:
   ```env
   AUTH_SECRET= "sua_chave_secreta"
   PORT= "porta_do_servidor"
   SERVER_URL= "url_do_servidor"
   STRIPE_PRIVATE_KEY= "sua_chave_secreta_da_stripe"
   WEBHOOK_SIGNING_SECRET= "seu_segredo_do_webhook"
   ```
4. Execute as migrações do banco de dados:
   ```sh
   npm run migrate
   ```
5. Inicie o servidor em ambiente de desenvolvimento:
   ```sh
   npm run dev
   ```

## Endpoints Principais

### Usuários
- `POST /users/` - Cria um usuário.
- `PUT /users/` - Atualiza um usuário (autenticado).
- `GET /users/validated` - Verifica se determinado usuário existe no banco de dados.
- `GET /users/` - Lista o nome de determinado usuário.

### Autenticação
- `POST /sessions/` - Autentica um usuário e retorna um token JWT.

### Pratos
- `POST /plates/` - Cria um prato (autorizado como 'admin').
- `GET /plates/:id` - Lista um prato com seus dados e ingredientes por ID.
- `DELETE /plates/` - Deleta um prato (autorizado como 'admin').
- `GET /plates/` - Lista pratos por título e ingredientes.
- `PUT /plates/:id` - Atualiza um prato (autorizado como 'admin').
- `PATCH /plates/avatar/:id` - Atualiza o avatar de um prato (autorizado como 'admin').

### Ingredientes
- `GET /ingredients/` - Lista todos os ingredientes criados por um usuário (autenticado).

### Favoritos
- `POST /favourites/:id` - Adiciona um prato aos favoritos (autenticado).
- `GET /favourites/:id` - Lista um prato favoritado por ID (autenticado).
- `DELETE /favourites/` - Remove um prato da lista de favoritos (autenticado).
- `GET /favourites/` - Lista pratos favoritados por título e ingredientes.

### Stripe
- `POST /sessions/create-checkout-session` - Cria uma sessão de checkout na Stripe, retornando um token e uma URL (autorizado como 'customer').

### Webhook
- `POST /webhook/` - Cria um evento para Webhook da Stripe, retornando dados do pagamento e salvando no banco de dados.
- `GET /webhook/` - Consulta e verifica o token de pagamento salvo.

### Orders
- `POST /orders/` - Cria um pedido (autorizado como 'admin').
- `GET /orders/` - Consulta pedidos do cliente (customer) ou todos os pedidos (admin).
- `PUT /orders/` - Atualiza o status de um pedido.

## Executando em Produção
Para iniciar o servidor em produção com PM2:
```sh
npm start
```

## Autor
Projeto desenvolvido no curso Explorer da Rocketseat.

