# Express Redis Cache Demo

This project demonstrates how to use Redis as a caching layer in a Node.js Express application to store API responses for posts from the [JSONPlaceholder](https://jsonplaceholder.typicode.com/) API.

## Requirements

- Node.js (v14 or higher)
- Redis (v6 or higher)
- npm (Node package manager)

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/express-redis-cache-demo.git
cd express-redis-cache-demo 
cd express-redis-cache-demo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Start Redis Server

Make sure Redis is running on `localhost:6380`. You can start Redis using the following command:

```bash
redis-server --port 6380
```

### 4. Start the Express Application

Run the Express application using:

```bash
npm start
```

By default, the app will be listening on port `3000`.

## Endpoints

### 1. `GET /posts`

Fetch a list of posts for a specific `userId`. The posts are cached in Redis for 1 hour (3600 seconds) to reduce repeated API calls.

#### Request
```
GET /posts?userId=<userId>
```

#### Example
```
GET /posts?userId=1
```

#### Response
```json
[
  {
    "userId": 1,
    "id": 1,
    "title": "Title 1",
    "body": "Post body 1"
  },
  {
    "userId": 1,
    "id": 2,
    "title": "Title 2",
    "body": "Post body 2"
  },
  ...
]
```

#### Cache Behavior

- The first time a request is made, data is fetched from the JSONPlaceholder API and stored in Redis.
- On subsequent requests for the same `userId`, data is served from the Redis cache, reducing the load on the external API.

### 2. `GET /posts/:id`

Fetch a specific post by its `id` from the JSONPlaceholder API.

#### Request
```
GET /posts/:id
```

#### Example
```
GET /posts/1
```

#### Response
```json
{
  "userId": 1,
  "id": 1,
  "title": "Title 1",
  "body": "Post body 1"
}
```

## Code Overview

### Cache Logic

- The `cacheData` function is used to handle Redis caching for the posts. It stores data in Redis using the `setex` command with a predefined expiration time (`DEFAULT_EXPIRATION`).
  
- Each time a request is made to fetch posts, the application first checks if the data is available in the cache (Redis). If the data exists, it returns the cached result. Otherwise, it fetches the data from the JSONPlaceholder API, caches it, and returns the response.

### `app.js` Main Logic

- Express is used to set up the API routes.
- The `/posts` route fetches posts from Redis if they are cached, or from the JSONPlaceholder API if they are not.
- The `/posts/:id` route fetches individual posts from the JSONPlaceholder API without caching.

## Running Tests

To run tests, you can add test scripts in your `package.json` file. Example:

```bash
npm test
```

### Dependencies

- `express`: Web framework for Node.js.
- `axios`: Promise-based HTTP client for making API requests.
- `cors`: Middleware to enable Cross-Origin Resource Sharing.
- `redis`: Redis client for Node.js to connect to the Redis server.

## Troubleshooting

### Redis Errors

- **ClientClosedError**: This can happen if the Redis connection is closed. Ensure that the Redis server is running and accessible on the correct port (`6380` in this example).
  
- **Connection Refused**: Check if Redis is running and the connection details (host and port) are correct in the `app.js` file.
 
