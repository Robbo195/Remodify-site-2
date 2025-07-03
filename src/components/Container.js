import React from "react";

const Container = ({ children }) => {
  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "1rem" }}>
      {children}
    </div>
  );
};

export default Container;
