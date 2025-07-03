import React from "react";

const Carousel = ({ children }) => {
  return (
    <div style={{ display: "flex", overflowX: "auto", gap: "1rem", padding: "1rem", border: "1px solid #ccc" }}>
      {children}
    </div>
  );
};

export default Carousel;
