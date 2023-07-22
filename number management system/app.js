const express = require("express");
const axios = require("axios");

const app = express();
const port = 8008;

// Function to retrieve numbers from a URL
async function getNumbersFromURL(url) {
  try {
    const response = await axios.get(url);
    if (response && response.data && response.data.numbers) {
      return response.data.numbers;
    }
  } catch (error) {
    console.error("Error retrieving data from URL:", url);
  }
  return [];
}

// Function to merge arrays and remove duplicates
function mergeArrays(arrays) {
  let mergedNumbers = arrays.join(",");
  const uniqueNumbers = Array.from(new Set(mergedNumbers.split(",")));
  return uniqueNumbers.map(Number).sort((a, b) => a - b);
}

// GET REST API for /numbers
app.get("/numbers", async (req, res) => {
  const urls = req.query.url;
  if (!urls || !Array.isArray(urls)) {
    return res.status(400).json({ error: "Invalid URL parameter." });
  }

  const validURLs = urls.filter((url) => url.startsWith("http://") || url.startsWith("https://"));
  const promises = validURLs.map(getNumbersFromURL);

  try {
    const results = await Promise.all(promises);
    const mergedNumbers = mergeArrays(results);
    return res.json({ numbers: mergedNumbers });
  } catch (error) {
    console.error("Error processing requests:", error);
    return res.status(500).json({ error: "Internal server error." });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Number Management Service listening at http://localhost:${port}`);
});
