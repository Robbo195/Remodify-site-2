import React, { useEffect, useState } from 'react';
import Fuse from 'fuse.js';

const Results = () => {
  const [results, setResults] = useState([]);
  const [searchInputs, setSearchInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadInventoryAndSearch = async () => {
      try {
        // ✅ Load inventory from mock JSON file in /public
        const response = await fetch("/parts.json");
        if (!response.ok) {
          throw new Error(`Failed to fetch parts: ${response.statusText}`);
        }
        const inventory = await response.json();

        // Extract search parameters from URL
        const params = new URLSearchParams(window.location.search);
        const search = {
          year: params.get("year") || "",
          manufacturer: params.get("manufacturer") || "",
          model: params.get("model") || "",
          partNumber: params.get("partNumber") || "",
          keyword: params.get("keyword") || ""
        };
        setSearchInputs(search);

        const searchString = Object.values(search).filter(Boolean).join(" ").toLowerCase();

        const fuse = new Fuse(inventory, {
          keys: [
            { name: "year", weight: 0.15 },
            { name: "manufacturer", weight: 0.25 },
            { name: "model", weight: 0.25 },
            { name: "partNumber", weight: 0.2 },
            { name: "description", weight: 0.15 }
          ],
          threshold: 0.4,
          includeScore: true
        });

        const searchResults = searchString
          ? fuse.search(searchString)
          : inventory.map(item => ({ item, score: 0 }));

        setResults(searchResults);
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };

    loadInventoryAndSearch();
  }, []);

  const renderResults = () => {
    if (loading) {
      return <p>Loading results...</p>;
    }

    if (error) {
      return <p>Error: {error}</p>;
    }

    if (results.length === 0) {
      return <p>No parts matched your search.</p>;
    }

    return results.map(({ item, score }) => (
      <div key={item.partNumber}>
        <strong>{item.year} {item.manufacturer} {item.model}</strong><br />
        Part #: {item.partNumber}<br />
        Description: {item.description}<br />
        Match Score: {(1 - score).toFixed(2)}
      </div>
    ));
  };

  return (
    <div className="page-section">
      <div className="container text-start">
        <h1 className="title-underline-1">Results</h1>
        <p className="fst-italic">
          You searched for a {searchInputs.year} {searchInputs.manufacturer} {searchInputs.model} {searchInputs.partNumber && `part number ${searchInputs.partNumber}`} {searchInputs.keyword && `(${searchInputs.keyword})`}.
        </p>
        <div id="resultsContainer">
          {renderResults()}
        </div>
      </div>
    </div>
  );
};

export default Results;