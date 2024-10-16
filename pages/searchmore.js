import { useState } from 'react';

export default function Home() {
  const [inputValue, setInputValue] = useState('');
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchSummary = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/getSummary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: inputValue }),
      });

      const data = await response.json();
      setSummary(data.summary);
    } catch (error) {
      setSummary('Error generating summary.');
    }
    setLoading(false);
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>PubMed Article Summarizer</h1>
      <input
        type="text"
        placeholder="Enter PubMed ID or URL"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={{ padding: '0.5rem', width: '100%', marginBottom: '1rem' }}
      />
      <button onClick={fetchSummary} style={{ padding: '0.5rem 1rem' }}>
        {loading ? 'Summarizing...' : 'Generate Summary'}
      </button>

      {summary && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc' }}>
          <h3>Summary:</h3>
          <p>{summary}</p>
        </div>
      )}
    </div>
  );
}
