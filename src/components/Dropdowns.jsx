import React from "react";
import { TextField } from "@mui/material";

const Dropdowns = ({ category, variables, onChange }) => {
  const handleVariableChange = (variable, value) => {
    onChange(category, variable, value);
  };

  return (
    <div>
      {Object.keys(variables).map((variableName) => (
        <TextField
          key={variableName}
          label={variableName.charAt(0).toUpperCase() + variableName.slice(1)}
          value={variables[variableName]}
          onChange={(e) => handleVariableChange(variableName, e.target.value)}
        />
      ))}
    </div>
  );
};

export default Dropdowns;
