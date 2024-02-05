// DynamicTable.jsx
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
} from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import ClearIcon from "@mui/icons-material/Clear";
import PeopleColumn from "./PeopleColumn"; // Import the PeopleColumn component

const DynamicTable = ({ headers, data }) => {
  const [editableCell, setEditableCell] = useState(null);
  const [tableData, setTableData] = useState(data);

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
        i === rowIndex
          ? {
              ...row,
              [headers[colIndex]]:
                header === "People" ? JSON.parse(value) : value,
            }
          : row
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

  return (
    <div>
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
              <TableRow key={rowIndex}>
                {headers.map((header, colIndex) => (
                  <TableCell
                    key={colIndex}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {editableCell &&
                    editableCell.rowIndex === rowIndex &&
                    editableCell.colIndex === colIndex ? (
                      <div>
                        {header === "People" ? (
                          <TextField
                            value={JSON.stringify(editableCell.originalValue)}
                            onChange={(event) =>
                              handleCellChange(event, header)
                            }
                            onBlur={handleBlur}
                            autoFocus
                            multiline
                          />
                        ) : (
                          <TextField
                            value={row[header]}
                            onChange={(event) =>
                              handleCellChange(event, header)
                            }
                            onBlur={handleBlur}
                            autoFocus
                            multiline
                          />
                        )}
                        <IconButton onClick={handleCellSave}>
                          <DoneIcon />
                        </IconButton>
                        <IconButton onClick={handleCellCancel}>
                          <ClearIcon />
                        </IconButton>
                      </div>
                    ) : (
                      <div>
                        {header === "People" ? (
                          <PeopleColumn people={row[header]} />
                        ) : (
                          row[header] || "N/A"
                        )}
                      </div>
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default DynamicTable;
