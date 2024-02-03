// src/components/VariableOptions.js
import React, { useState } from "react";
import { Card, TextField, Button, Select, MenuItem } from "@mui/material";

const VariableOptions = ({ paragraphs, onVariableChange }) => {
  const [selectedParagraph, setSelectedParagraph] = useState(
    paragraphs && paragraphs.length > 0 ? paragraphs[0] : null
  );

  const handleParagraphChange = (event) => {
    setSelectedParagraph(event.target.value);
  };

  return (
    <Card>
      {paragraphs && paragraphs.length > 0 && (
        <Select value={selectedParagraph} onChange={handleParagraphChange}>
          {paragraphs.map((paragraph, index) => (
            <MenuItem key={index} value={paragraph}>
              {`Paragraph ${index}`}
            </MenuItem>
          ))}
          <MenuItem value="all">All Paragraphs</MenuItem>
        </Select>
      )}

      <TextField label="Add Variable" />
      <Button variant="contained">Add Variable</Button>
    </Card>
  );
};

export default VariableOptions;
