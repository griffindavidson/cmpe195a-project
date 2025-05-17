const { default: ollama } = require('ollama');
const express = require("express");
require('dotenv').config();
const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.json());

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
    const response = await fetch(`https://api.core.ac.uk/v3/works/${id}?api_key=CVAOaxycKSgdjrN4mqTi78UpXPQ5lLFh`, {
      headers: {
        "Accept": "application/json"
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
      abstract: data.abstract,
      fullText: fullText
    });
  } catch (err) {
    console.error("Error fetching full article:", err.message);
    res.status(500).json({ error: "Failed to fetch full article" });
  }
});

app.post('/summarize', async (req, res) => {
  try {
    const fullText = req.body.text;
    if (!fullText) {
      return res.status(400).json({ error: 'Missing text to summarize.' });
    }
    
    console.log("Starting summarization with Ollama...");
    
    // Set headers for streaming
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    
    // Make sure Ollama is properly configured and the model exists
    const modelName = process.env.MODEL || 'gemma:1b';
    console.log(`Using model: ${modelName}`);
    
    const response = await ollama.chat({
      model: modelName,
      messages: [
        { role: 'system', content: 'Your job is to summarize the following article while remaining accurate and only using the data on the article, concise, coherent with your response, and capture the full essence of the message of the article in your response' },
        { role: 'user', content: fullText }
      ],
      stream: true
    });
    
    for await (const part of response) {
      if (part.message?.content) {
        // Send each token as it arrives
        //console.log(part.message.content);
        res.write(JSON.stringify({ token: part.message.content, done: part.done }) + '\n');
      }
      if (part.done) {
        console.log("Summarization complete");
        res.end();
      }
    }
  } catch (error) {
    console.error('Summarization failed:', error);
    res.status(500).json({ error: `Summarization failed: ${error.message}` });
  }
});

app.listen(PORT, () => {
  console.log(`Application Started: http://localhost:${PORT}`);
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
    throw error; // Re-throw to be handled by the route handler
  }
}