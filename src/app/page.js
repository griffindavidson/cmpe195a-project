import Image from "next/image";
import styles from "./home.css";

export default function Home() {
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
    </div>
  );
};
