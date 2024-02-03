import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Button,
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";

// ... (imports)

const DynamicTable = ({ data, setData }) => {
  const [editableCell, setEditableCell] = useState(null);
  const [tableData, setTableData] = useState(data);
  const [headers, setHeaders] = useState([
    ...new Set(data.flatMap((row) => Object.keys(row))),
  ]);

  const handleCellClick = (rowIndex, colIndex) => {
    setEditableCell({
      rowIndex,
      colIndex,
      originalValue: tableData[rowIndex][headers[colIndex]],
    });
  };

  const handleCellChange = (event, header) => {
    const { value } = event.target;
    const { rowIndex, colIndex } = editableCell;

    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === rowIndex ? { ...row, [headers[colIndex]]: value } : row
      )
    );
  };

  const handleCellSave = () => {
    setEditableCell(null);
  };

  const handleCellCancel = () => {
    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === editableCell.rowIndex
          ? {
              ...row,
              [headers[editableCell.colIndex]]: editableCell.originalValue,
            }
          : row
      )
    );
    setEditableCell(null);
  };

  const handleBlur = () => {
    handleCellSave();
  };

  const addRow = () => {
    const newRow = {};
    headers.forEach((header) => {
      newRow[header] = "";
    });
    setTableData([...tableData, newRow]);
  };

  const addColumn = () => {
    const newHeader = prompt("Enter the name for the new column");
    if (newHeader) {
      setTableData((prevData) =>
        prevData.map((row) => ({ ...row, [newHeader]: "" }))
      );
      setHeaders((prevHeaders) => [...prevHeaders, newHeader]);
    }
  };

  return (
    <div>
      <Button variant="contained" color="primary" onClick={addRow}>
        Add Row
      </Button>
      <Button variant="contained" color="primary" onClick={addColumn}>
        Add Column
      </Button>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <React.Fragment key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    style={
                      colIndex === 2 && header === "House"
                        ? {
                            color: row[header] === "Hogwarts" ? "red" : "gold",
                          }
                        : {}
                    }
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {editableCell &&
                    editableCell.rowIndex === rowIndex &&
                    editableCell.colIndex === colIndex ? (
                      <div>
                        <TextField
                          value={row[header]}
                          onChange={(event) => handleCellChange(event, header)}
                          onBlur={handleBlur}
                          autoFocus
                          multiline
                        />
                        <IconButton onClick={handleCellSave}>
                          <DoneIcon />
                        </IconButton>
                        <IconButton onClick={handleCellCancel}>
                          <ClearIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div>
                        {Array.isArray(row[header])
                          ? row[header].map((person, personIndex) => (
                              <React.Fragment key={personIndex}>
                                {person.name || "N/A"}:{" "}
                                {person.description || "N/A"}
                                {personIndex < row[header].length - 1 && <br />}
                              </React.Fragment>
                            ))
                          : row[header] || "N/A"}
                      </div>
                    )}
                  </TableCell>
                ))}
                {/* Add an empty row to separate categories */}
                <TableRow style={{ height: "20px" }}></TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DynamicTable;
