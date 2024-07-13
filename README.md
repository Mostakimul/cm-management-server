##### Live Link: https://cmu-server.vercel.app/

### Frontend Repo Link: https://github.com/Mostakimul/cm-management-client

### API endpoints documentation: https://documenter.getpostman.com/view/16306758/2sA3BuW95Z

### Credentials for admin

```
Email for credentials...
```

## How to Run Locally

### Clone the repository:

```
git clone https://github.com/Mostakimul/cm-management-server.git
```

### Install dependencies:

```
yarn install
```

### Set up environment variables:

Create a .env file in the root directory and add the following:

```
NODE_ENV=development
PORT=PORT_NUMBER
DATABASE_URL="YOUR_DATABASE_URL"
BCRYPT_SALT_ROUNDS=12
DEFAULT_PASSWORD="DEFAULT_PASS"
JWT_ACCESS_SECRET="YOUR_SECRET"
JWT_ACCESS_EXPIRE=10d
JWT_REFRESH_SECRET="YOUR_REFRESH_SECRECT"
JWT_REFRESH_EXPIRES_IN=60d

```

### Run the server:

```
yarn start:dev
```

# Naveen Client

It is sales and inventory management system for pc item.

## Technologies Used

- Typescript
- bcrypt
- cookie-parser
- cors
- dotenv
- express
- http-status
- jsonwebtoken
- mongoose
- zod
