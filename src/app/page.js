'use client'

import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./home.css";

export default function Home() {

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const res = await fetch('/api/fetchPubMedData');
        if (!res.ok) {
          throw new Error('Failed to fetch data');
        }
        const data = await res.json();
        setArticles(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Suggested Articles</h1>
      <div className="suggested-container">
        <div className="item">Item 1</div>
        <div className="item">Item 2</div>
        <div className="item">Item 3</div>
        <div className="item">Item 4</div>
      </div>
      <h1>Saved Articles</h1>
      <div className="saved-container">
        <div className="item">Item 1</div>
        <div className="item">Item 2</div>
        <div className="item">Item 3</div>
      </div>
      <h1>Search</h1>
      <div className="search-container">
        <input type="text" placeholder="search" className="search-textfield"/>

        <div className="search-result-container">
          <div className="search-result-image"></div>
          <div className="search-result-title">Article Title</div>
        </div>
        
        <div className="search-result-container">
          <div className="search-result-image"></div>
          <div className="search-result-title">Article Title</div>
        </div>
      
        <div className="search-result-container">
          <div className="search-result-image"></div>
          <div className="search-result-title">Article Title</div>
        </div>
        
      </div>
      <div class="test">
        <h1>PubMed Articles</h1>
        <ul>
          {articles.map((article, index) => (
            <li key={index}>
              <h2>{article.title}</h2>
              <p><strong>Authors:</strong> {article.authors.join(', ')}</p>
              <p><strong>Source:</strong> {article.source}</p>
              <p><strong>Journal:</strong> {article.journal}</p>
              <p><strong>Volume:</strong> {article.volume}</p>
              <p><strong>Abstract:</strong> {article.abstract}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
