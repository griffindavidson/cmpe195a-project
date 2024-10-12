import Image from "next/image";
import styles from "./home.css";

export default function Home() {
  return (
    <div>
      <h1>Suggested Articles</h1>
      <div class="suggested-container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
        <div class="item">Item 4</div>
      </div>
      <h1>Saved Articles</h1>
      <div class="saved-container">
        <div class="item">Item 1</div>
        <div class="item">Item 2</div>
        <div class="item">Item 3</div>
      </div>
      <h1>Search</h1>
      <div class="search-container">
        <input type="text" placeholder="search" class="search-textfield"/>
      </div>
    </div>
  );
};
