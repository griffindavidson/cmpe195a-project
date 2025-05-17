async function loadArticle() {
	const params = new URLSearchParams(window.location.search);
	const id = params.get("id");

	if (!id) {
		document.getElementById("fullText").innerText = "Missing article ID.";
		return;
	}

	try {
		// Fetch the article data from the backend
		const response = await fetch(`/article/${id}`);
		const data = await response.json();

		if (!response.ok) {
		throw new Error(`Failed to fetch article: ${data.error}`);
		}

		//console.log(data);

		// Display the article's title, authors, and full text
		document.getElementById("title").innerText = data.title || "Untitled";
		document.getElementById("authors").innerText =
		(data.authors || []).map(a => a.name).join(", ") || "Unknown authors";
		//document.getElementById("fullText").innerHTML = data.fullText || "Full text not available.";
		//document.getElementById("abstract").innerText = data.abstract;

		// After displaying article, stream the summary
		if (data.fullText) {
		streamSummary(data.fullText);
		}

	} catch (error) {
		console.error("Load Article Error:", error.message);
		document.getElementById("fullText").innerText = "Failed to load article.";
	}
}

async function streamSummary(text) {
	const response = await fetch('/summarize', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ text })
	});

	const decoder = new TextDecoder();
	const reader = response.body.getReader();
	const summaryElement = document.getElementById("summary");

	let buffer = "";

	while (true) {
		const { value, done } = await reader.read();
		if (done) break;

		buffer += decoder.decode(value, { stream: true });

		// Split by newline-delimited JSON
		const lines = buffer.split("\n");

		// Keep the last partial line in buffer
		buffer = lines.pop();

		for (const line of lines) {
			if (!line.trim()) continue;

			try {
				const data = JSON.parse(line);
				summaryElement.textContent += data.token || "";
			} catch (e) {
				console.warn("Failed to parse JSON chunk:", line);
			}
		}
	}
}

loadArticle();
