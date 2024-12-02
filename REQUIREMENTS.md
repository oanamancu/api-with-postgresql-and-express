# API Requirements
The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application. 

## API Endpoints
#### Products
- Index - 'products' [GET] 
- Show - 'products/:id' [GET] 
- Create - [token required] 'products' [POST]
- [OPTIONAL] Top 5 most popular products - 'products/top5' [GET] 
- [OPTIONAL] Products by category (args: product category) - 'products/:productId/category' [GET]

#### Users
- Index [token required] - 'users' [GET]
- Show [token required] - 'users/:id' [GET]
- Create N[token required] - 'users' [POST]

#### Orders
- Current Order by user (args: user id)[token required] 'orders/current/:userId' [GET]
- [OPTIONAL] Completed Orders by user (args: user id)[token required] 'orders/all/:userId' [GET]

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

