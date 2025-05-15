import React, { useState } from "react";
import "./App.css";

const flamesQuotes = {
  love: "Love is the flower you've got to let grow.",
  affection: "Affection is the glue that binds relationships.",
  friends: "A true friend is the greatest of all blessings.",
  marriage: "Marriage is a mosaic you build with your spouse.",
  enemy: "Sometimes enemies teach us the best lessons.",
  sibling: "Siblings: your first best friends and rivals.",
};

function App() {
  const [name1, setName1] = useState("");
  const [name2, setName2] = useState("");
  const [result, setResult] = useState("");

  const flames = ["friends", "love", "affection", "marriage", "enemy", "sibling"];

  function calculateFlames(n1, n2) {
    let name1Arr = n1.toLowerCase().replace(/\s/g, "").split("");
    let name2Arr = n2.toLowerCase().replace(/\s/g, "").split("");

    name1Arr.forEach((char) => {
      const index = name2Arr.indexOf(char);
      if (index !== -1) {
        name1Arr.splice(name1Arr.indexOf(char), 1);
        name2Arr.splice(index, 1);
      }
    });

    const count = name1Arr.length + name2Arr.length;

    let flamesArr = [...flames];
    let idx = 0;
    while (flamesArr.length > 1) {
      idx = (count % flamesArr.length) - 1;
      if (idx >= 0) {
        flamesArr = [...flamesArr.slice(idx + 1), ...flamesArr.slice(0, idx)];
      } else {
        flamesArr.pop();
      }
    }
    return flamesArr[0];
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name1.trim() || !name2.trim()) {
      alert("Please enter both names.");
      return;
    }

    const res = calculateFlames(name1, name2);
    setResult(res);

    // ✅ Send data to Google Sheet
    try {
      await fetch("https://script.google.com/macros/s/AKfycby4LFLwPqhyL9qducwp2nKD8D2G5x8n-hxnhMVGXewmY71t87Tjd6942owuK-fhKjDniQ/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name1,
          name2,
          result: res,
          timestamp: new Date().toLocaleString(),
        }),
      });
      console.log("Data sent to Google Sheet");
    } catch (err) {
      console.error("Failed to send data:", err);
    }
  };

  return (
    <div className="app-container">
      <h1 className="title">FLAMES Game</h1>
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          placeholder="Enter First Name"
          value={name1}
          onChange={(e) => setName1(e.target.value)}
          required
          className="input-field"
        />
        <input
          type="text"
          placeholder="Enter Second Name"
          value={name2}
          onChange={(e) => setName2(e.target.value)}
          required
          className="input-field"
        />
        <button type="submit" className="submit-button">
          Check
        </button>
      </form>

      {result && (
        <div className={`result-box ${result}`} key={result}>
          <h2 className="result-title">{result.toUpperCase()}</h2>
          <p className="result-quote">{flamesQuotes[result]}</p>
        </div>
      )}
    </div>
  );
}

export default App;
