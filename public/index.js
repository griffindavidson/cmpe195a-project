const template = document.getElementById("template");
const container = document.querySelector(".container");

async function fetchData() {
  try {
    const query = document.getElementById("search").value || "cancer";
    const url = `/articles?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP Error! Status: ${response.status}`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Expected array of articles.");
    return data;
  } catch (error) {
    console.error("Fetch Error:", error.message);
    return [];
  }
}

function renderArticles(data) {
  // Remove all article links (but preserve heading and input)
  document.querySelectorAll(".link").forEach(el => el.remove());

  data.forEach(entry => {
    const clone = template.content.cloneNode(true);
    clone.querySelector(".title").innerText = entry.title;
    clone.querySelector(".author-container").innerText = entry.authors;
    clone.querySelector(".link").setAttribute("href", `/article.html?id=${entry.id}`);
    container.appendChild(clone);
  });
}

// Initial fetch
fetchData().then(renderArticles);

// Listen for Enter key in search input
document.getElementById("search").addEventListener("keydown", event => {
  if (event.key === "Enter") {
    fetchData().then(renderArticles);
  }
});
