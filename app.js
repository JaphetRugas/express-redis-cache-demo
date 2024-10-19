const express = require("express");
const axios = require("axios");
const cors = require("cors");
const redis = require("redis");

const redisClient = redis.createClient({
  host: "127.0.0.1",
  port: 6380,
});

const DEFAULT_EXPIRATION = 3600; // Cache expiration in seconds

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Connect to Redis
(async () => {
  await redisClient.connect();
})();

redisClient.on("error", (err) => console.log("Redis Client Error", err));

// Helper function to handle caching
const cacheData = async (key, data) => {
  try {
    await redisClient.setex(key, DEFAULT_EXPIRATION, JSON.stringify(data));
  } catch (error) {
    console.error("Error caching data:", error);
  }
};

// Route for fetching posts
app.get("/posts", async (req, res) => {
  try {
    const userId = req.query.userId;
    const cacheKey = `posts:${userId}`;

    // Check Redis cache
    const cachedPosts = await redisClient.get(cacheKey);
    if (cachedPosts) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedPosts)); // Return cached data
    }

    console.log("Cache miss");
    // If not in cache, fetch from API
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts",
      { params: { userId } }
    );

    // Limit the number of posts
    const limitedData = data.slice(0, 10);

    // Cache the fetched data
    await cacheData(cacheKey, limitedData);

    // Send the response
    res.json(limitedData);
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).json({ message: "Failed to fetch posts" });
  }
});

// Route for fetching a single post by ID
app.get("/posts/:id", async (req, res) => {
  const postId = req.params.id;

  try {
    const { data } = await axios.get(
      `https://jsonplaceholder.typicode.com/posts/${postId}`
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ message: `Failed to fetch post with ID ${postId}` });
  }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
