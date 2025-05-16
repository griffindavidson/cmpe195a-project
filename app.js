const { default: ollama } = require('ollama');
const express = require("express");
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(express.static('public'));

app.get('/', (request, response) => {
    response.sendFile(__dirname + "/public/index.html");
});

app.get('/articles', async (req, res) => {
    const query = req.query.query || "cancer";

    try {
        const data = await fetchArticles(query);

    if (!data || !data.results) {
        return res.status(500).json({ error: "Invalid response from CORE API." });
    }

    const articles = data.results.map(paper => ({
        id: paper.id, // <-- Needed for lookup
        title: paper.title,
        authors: (paper.authors || []).map(a => a.name).join("; "),
        downloadUrl: paper.downloadUrl || "No download URL available"
    }));

    res.json(articles);

    } catch (error) {
        console.error("Error fetching articles:", error.message);
        res.status(500).json({ error: "Server failed to fetch articles." });
    }
});

app.get("/article/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const response = await fetch(`https://api.core.ac.uk/v3/works/${id}`, {
            headers: {
                "Accept": "application/json",
                "Authorization": "Bearer CVAOaxycKSgdjrN4mqTi78UpXPQ5lLFh"
            }
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch article with ID ${id}`);
        }

        const data = await response.json();
        // Check if full text exists and send it
        const fullText = data.fullText || "Full text not available.";
        
        res.json({
            title: data.title,
            authors: data.authors,
            fullText: fullText
        });
        
    } catch (err) {
        console.error("Error fetching full article:", err.message);
        res.status(500).json({ error: "Failed to fetch full article" });
    }
});

app.post("/summarize", async (req, res) => {
  try {
    const fullText = req.body.text;

    if (!fullText) {
      return res.status(400).json({ error: "Missing text to summarize." });
    }

    // Prepare streaming response
    res.setHeader("Content-Type", "application/json");
    res.flushHeaders();

    const response = await ollama.chat({
      model: process.env.MODEL || "llama3",
      messages: [
        { role: "system", content: "Summarize the following text." },
        { role: "user", content: fullText }
      ],
      stream: true
    });

    for await (const part of response) {
      // Stream each token to the client
      res.write(JSON.stringify({ token: part.message.content, done: part.done }));

      if (part.done) {
        res.end();
      }
    }
  } catch (error) {
    console.error("Summarization failed:", error.message);
    res.status(500).json({ error: "Something went wrong during summarization." });
  }
});

app.listen(PORT, () => {
    console.log(`Application Started: http://localhost:${PORT}`)
});

async function fetchArticles(query) {
    try {

        const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&page=1&pageSize=5&api_key=CVAOaxycKSgdjrN4mqTi78UpXPQ5lLFh`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        
        return data;

    } catch (error) {
        console.error("CORE API fetch failed:", error.message);
        res.status(500).json({ error: "Failed to fetch articles from CORE API." });
    }
}