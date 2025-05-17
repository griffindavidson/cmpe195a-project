/*
async function fetchSpringer() {
    try {
        const apikey = "100bbb6466e78500a03f96dd24fd3547";

        const response = await fetch("https://api.springernature.com/openaccess/json?api_key=100bbb6466e78500a03f96dd24fd3547&callback=&s=1&p=10&q=");

        const data = await response.json();

        return data;
    } catch(error) {
        console.error(error.message);
    }
}

async function fetchSci() {
    try {
        const key = "18da09db577161ccc710fb6da09bb6f9"

        const request = new Request("https://api.elsevier.com/content/search/sciencedirect?apiKey=18da09db577161ccc710fb6da09bb6f9&query=cancer", {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${key}`,
                "X-ELS-APIKey": `${key}`
            }
        });

        const response = await fetch(request);

        const data = await response.json();

        console.log(data);

    } catch(error) {
        console.error(error.message);
    }
}

*/

//console.log(sci().then(data => console.log(data))); CVAOaxycKSgdjrN4mqTi78UpXPQ5lLFh
/*
async function fetchCore(query = "cancer") {
    try {
        const key = "CVAOaxycKSgdjrN4mqTi78UpXPQ5lLFh";  // Replace with your actual key

        const url = `https://api.core.ac.uk/v3/search/works?q=${encodeURIComponent(query)}&page=1&pageSize=5`;

        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${key}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("CORE API fetch failed:", error.message);
    }
}
*/

// file: fetchCore.js
//import fetch from 'node-fetch'; // if using ESM
//const fetch = require('node-fetch'); // if using CommonJS

async function fetchCore(query = "cancer") {
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
    return null;
  }
}

// Call the function and log the result
fetchCore("cancer").then(data => {
  if (data && data.results) {
    const articles = data.results.map(paper => ({
      title: paper.title,
      authors: (paper.authors || []).map(a => a.name).join("; "),
      downloadUrl: paper.downloadUrl || "No download URL available",
      text: paper.abstract
    }));

    console.log(articles);
  } else {
    console.log("No results found or bad API key.");
  }
});

