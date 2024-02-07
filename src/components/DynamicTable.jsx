import React, { useState, useEffect } from "react";
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

const PeopleColumn = ({ people }) => {
  return (
    <div>
      {people.map((person, index) => (
        <React.Fragment key={index}>
          {person.name} - {person.description}
          {index < people.length - 1 && <br />}
        </React.Fragment>
      ))}
    </div>
  );
};

const DynamicTable = ({ data, setData, variableOptions }) => {
  console.log("data: ", data);
  const [editableCell, setEditableCell] = useState(null);
  const [tableData, setTableData] = useState(data);
  const [headers, setHeaders] = useState([
    ...new Set(data.flatMap((row) => Object.keys(row))),
  ]);
  const [key, setKey] = useState(0); // Unique key to force re-render

  useEffect(() => {
    // Update table data when variableOptions changes
    if (variableOptions) {
      setTableData((prevData) =>
        prevData.map((row) => {
          let newRow = { ...row };
          Object.entries(variableOptions).forEach(([variable, value]) => {
            newRow.Subject = newRow.Subject.replace(
              new RegExp("\\$\\{" + variable + "\\}", "g"),
              value
            );
            if (newRow.People) {
              newRow.People = newRow.People.map((person) => ({
                ...person,
                description: person.description.replace(
                  new RegExp("\\$\\{" + variable + "\\}", "g"),
                  value
                ),
              }));
            }
          });
          return newRow;
        })
      );
    }
  }, [variableOptions]);

  const handleCellClick = (rowIndex, colIndex) => {
    const originalValue = tableData[rowIndex][headers[colIndex]];
    const editableValue =
      headers[colIndex] === "People"
        ? originalValue.reduce(
            (accumulator, person, index) =>
              accumulator +
              `${person.name} - ${person.description}${
                index < originalValue.length - 1 ? "\n" : ""
              }`,
            ""
          )
        : JSON.stringify(originalValue);

    setEditableCell({
      rowIndex,
      colIndex,
      originalValue,
      editableValue,
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

    setEditableCell((prevEditableCell) => ({
      ...prevEditableCell,
      editableValue: value, // Update editableValue in the editableCell state
    }));
  };

  const handleCellSave = () => {
    setEditableCell(null);

    setTableData((prevData) =>
      prevData.map((row, i) =>
        i === editableCell.rowIndex
          ? {
              ...row,
              [headers[editableCell.colIndex]]:
                headers[editableCell.colIndex] === "People"
                  ? editableCell.editableValue.split("\n").map((person) => {
                      const [name, description] = person.split(" - ");
                      return { name, description };
                    })
                  : editableCell.editableValue,
            }
          : row
      )
    );
  };

  const handleCellCancel = () => {
    setEditableCell(null);
  };

  const handleBlur = () => {
    handleCellSave();
  };

  const addRow = () => {
    const newRow = {};
    headers.forEach((header) => {
      newRow[header] = header === "People" ? [] : ""; // Initialize "People" as an empty array
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

  const getHouseColor = (house) => {
    switch (house.toLowerCase()) {
      case "hogwarts":
        return "orange";
      case "gryffindor":
        return "red";
      case "slytherin":
        return "green";
      case "hufflepuff":
        return "yellow";
      case "ravenclaw":
        return "purple";
      default:
        return "white";
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
                            padding: "8px", // Add padding for better visibility
                          }
                        : {}
                    }
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {editableCell &&
                    editableCell.rowIndex === rowIndex &&
                    editableCell.colIndex === colIndex ? (
                      <div>
                        {header === "People" ? (
                          <TextField
                            value={editableCell.editableValue}
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
                        ) : Array.isArray(row[header]) ? (
                          row[header].map((word, index) => (
                            <React.Fragment key={index}>
                              <span
                                style={{
                                  color: getHouseColor(word.toLowerCase()),
                                }}
                              >
                                {word}
                              </span>
                              {index < row[header].length - 1 && " / "}
                            </React.Fragment>
                          ))
                        ) : (
                          row[header] || "N/A"
                        )}
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
