const express = require("express");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/posts", async (req, res) => {
  try {
    const { userId } = req.params;
    const { data } = await axios.get(
      "https://jsonplaceholder.typicode.com/posts",
      { params: userId }
    );
    res.json(data);
  } catch (error) {
    console.error("Error fetching posts: ", error);
    res.status(500).json({ mesage: "Failed to fetch posts" });
  }
});

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

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
