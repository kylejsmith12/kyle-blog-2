// src/components/Dropdowns.jsx
import React from "react";
import { Input, InputLabel, FormControl } from "@mui/material";

const Dropdowns = ({ category, variables, onChange }) => {
  const handleChange = (variable, event) => {
    onChange(category, variable, event.target.value);
  };

  return (
    <div>
      {Object.entries(variables).map(([variable, value]) => (
        <FormControl key={variable} fullWidth style={{ marginBottom: "10px" }}>
          <InputLabel>{variable}</InputLabel>
          <Input
            type="text"
            value={value}
            onChange={(e) => handleChange(variable, e)}
          />
        </FormControl>
      ))}
    </div>
  );
};

export default Dropdowns;
