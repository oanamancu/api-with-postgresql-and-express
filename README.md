# Storefront Backend Project

## Project Setup

- install docker & docker compose 
- instal postgres and postgres client: sudo apt-get install postgresql-client
- run docker-compose up in project's root
- connect to postgres: psql -h localhost -p 5432 -d store_test -U postgres
    - create database store;
    - CREATE USER full_user WITH PASSWORD 'user1234'; | choose your own password
    -  \c store
    - GRANT ALL PRIVILEGES ON DATABASE store TO full_user;
    - GRANT CREATE ON SCHEMA public TO full_user;
    - create database store_test;
    - GRANT ALL PRIVILEGES ON DATABASE store_test TO full_user;
    - \c store_test
    - GRANT CREATE ON SCHEMA public TO full_user;
- create .env file in project's root with the fallowing info as an example (choose your own passwords):
    POSTGRES_HOST=127.0.0.1
    POSTGRES_DB=store
    POSTGRES_TEST_DB=store_test
    POSTGRES_USER=full_user
    POSTGRES_PASSWORD=user1234
    BCRYPT_PASSWORD=1234AbC!
    SALT_ROUNDS=10
    ENV=dev
- in terminal (project's root) : 
    - npm install
    - npm run db-up
    - npm run start


## API Endpoints

The endpoints can be accessed through the postman collection found in the postman folder. Create a new user and save returned token's value to the JWT_TOKEN variable.

#### Products
- Index - 'products' [GET]
- Show - 'products/:id' [GET]
- Create - [token required] 'products' [POST] | body json: name, price, category
- [OPTIONAL] Top 5 most popular products - '/products_top' [GET] 
- [OPTIONAL] Products by category (args: product category) - 'products/:productId/category' [GET]
- Destroy [token required] - '/products/:id' [DELETE] 

#### Users
- authenticate => token - '/users/authenticate/:id' [POST] | body json: firstName, lastName, password
- Index [token required] - '/users' [GET] 
- Show [token required] - '/users/:id' [GET] 
- Create N[token required] - '/users' [POST] | body json: firstName, lastName, password
- Destroy [token required] - '/users/:id' [DELETE]

#### Orders
- Current Order by user (args: user id)[token required] - '/orders/current/:userId/users' [GET] 
- [OPTIONAL] Completed Orders by user (args: user id)[token required] - '/orders/completed/:userId/users' [GET]
- add new active order to logged in user [token required]  - '/orders' [POST]
- mark order as complete [token required] - '/orders/complete/:id' [PUT]
- add product to order [token required] - '/orders/:orderId/products' [POST] | body json: productId, quantity
- show products from an order [token required] - '/orders/:orderId/products' [GET]
- delete product from order [token required] - '/orders/complete/:id' [DELETE]

## Data Shapes
#### Product
-  id
- name
- price
- [OPTIONAL] category

#### User
- id
- firstName
- lastName
- password

#### Orders
- id
- id of each product in the order
- quantity of each product in the order
- user_id
- status of order (active or complete)

## Tables

#### Table: Users (id:serial primary key, firstName:varchar, lastName:varchar, password:varchar)

#### Table: Products (id:serial primary key, name:varchar, price:integer, category:varchar)

#### Table: Orders (id:serial primary key, status:varchar, user_id:bigint [foreign key to users table])

#### Table: Order_Products (id:serial primary key, quantity:integer, order_id:bigint [foreign key to orders table], product_id:bigint [foreign key to products table] 