// DocumentDisplay.jsx
import React from "react";

const DocumentDisplay = React.forwardRef(({ title, paragraphs }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        flex: 1,
        padding: "20px",
        backgroundColor: "#fff",
        boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
        borderRadius: "5px",
      }}
    >
      <div>
        <h4>{title}</h4>
        {paragraphs &&
          paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
      </div>
    </div>
  );
});

export default DocumentDisplay;
