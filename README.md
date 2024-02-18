## Book Store


## Installation and Running the app

#### 1. Clone the repository
#### 2. Copy the .env.local file to .env
```bash
cp .env.local .env
```
#### 3. Run docker compose for database
```bash
docker-compose up -d
```

#### 4. Initialize and run the tests
*Tests will run with the `.env.test` environment file.*
```bash
npm install && npm run migration:seed && npm run test
```

#### 5. Run the application
```bash
npm run start
```
App will be running on <a href="http://localhost:3000" target="_blank">http://localhost:3000</a> by default.

### Default Users
| User | Email            | Password(*decoded*)  | Full Name   | 
|------|------------------|----------------------|-------------|
| #1   | user@mail.com    | password             | User Doe    |
| #2   | manager@mail.com | password             | Manager Doe |
| #3   | admin@mail.com   | password             | Admin Doe   |

---

### Database Diagram
![book-store-db-diagram.png](book-store-db-diagram.png)
---
### API Documentation
**[Postman collection and environment document](https://documenter.getpostman.com/view/22854292/2sA2r823zG)**

### Response Types

```
# General Succeed Response
{
    "data": {...},
    "error": null
}

# Paginated Response
{
    "data": {
        "results": [...],
        "total": 100,
    },
    "error": null
}
```

```
# General Error Response
{
    "data": null,
    "error": {
        "status": 400,
        "name": "Error constructor name",
        "message": "Error message",
        "timestamp": 1708259049433
    }
}

# Validation Error Response
{
    "data": null,
    "error": {
        "status": 400,
        "name": "ValidationException",
        "message": "Validation Failed",
        "errors": [
            {
                "field": "field_name",
                "message": "Error message"
            }
        ],
        "timestamp": 1708259049433
    }
}
```

---
### Endpoints
#### Using Pagination:

>  **limit**: must be a number \
>  **offset**: must be a number \
>  **order**: 'asc' or 'desc' \
>  **orderBy**: keyof Entity \
>  Example: `[GET] /book?limit=10&offset=0&orderBy=name&order=ASC`

#### Authentication
`[GET] /auth/me`: Returns the current user's information. [Requires Authentication]

`[POST] /auth/sign-up`: Register a new user [Public]
> `user` role is assigned by default.

`[POST] /auth/sign-in`: Login a user [Public]
#### User
`[GET] /user`: Returns a list of users. [Required Roles: `admin`]

`[POST] /user`: Create a new user. [Required Roles: `admin`]
#### Book
`[GET] /book`: Returns a paginated list of books. [Requires Authentication]
> Returns a list of books with pagination. \
> Query Params:
> * keyword: Search by book name
> * available: `true` or `false` default(false)
>   * If `true`, returns only books with available inventory 

`[POST] /book`: Create a new book. [Required Roles: `admin`]
> Create book with optionally adding inventory \
> If `inventory` is provided in the request body, it will be added to the store's inventory.
```
# Example request body with inventory
{
    "name": "Book Name",
    "inventory": {
      "storeId": uuid,
      "quantity": 10
    }
}
```
#### Store
`[GET] /store`: Returns a list of stores. [Required Authentication]

`[POST] /store`: Create a new store. [Required Roles: `admin`]
> Create store with optionally adding manager \
> If `manageId` is provided in the request body, it will be assigned as the store's manager.
```
# Example request body with manager
{
    "name": "Store Name",
    "managerId": uuid
}
```
`[PUT] /store/adjust-inventory`: Adjust the inventory of a store. [Required Roles: `manager` or `admin`]
> Adjust the inventory of a store. \
> * If inventory does not exist, it will be created with the provided `quantityChange`.
> * If inventory exists, the `quantityChange` will be added to the current quantity.
> If user is not an `admin`, only the inventory of the store they manage can be adjusted.
```
# Example request body
{
    "storeId": uuid,
    "bookId": uuid,
    "quantityChange": 10
}
```
