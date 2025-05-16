const template = document.getElementById("template");

async function fetchData() {
  try {
    const query = document.getElementById("search").value || "cancer";
    const url = `/articles?query=${encodeURIComponent(query)}`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP Error! Status: ${response.status}`);
    }

    const data = await response.json();

    if (!Array.isArray(data)) {
      throw new Error("Expected array of articles from API.");
    }

    return data;

  } catch (error) {
    console.error("Fetch Error:", error.message);
  }
}

fetchData().then(data => {
  if (!data) return;

  data.forEach(entry => {
    const clone = template.content.cloneNode(true);

    clone.querySelector(".title").innerText = entry.title;
    clone.querySelector(".author-container").innerText = entry.authors;

    // Set article download link (link to article.html with the relevant id)
    clone.querySelector(".link").setAttribute("href", `/article.html?id=${entry.id}`);

    document.querySelector(".container").appendChild(clone);
  });
});
