import React, { useState, useRef } from "react";
import {
  Container,
  Grid,
  Button,
  Toolbar,
  Typography,
  AppBar,
  CssBaseline,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
} from "@mui/material";
import DocumentDisplay from "./components/DocumentDisplay";
import html2pdf from "html2pdf.js";
import DynamicTable from "./components/DynamicTable";
import Dropdowns from "./components/Dropdowns";

const initialVariables = {
  harryPotter: {
    variable1: "Dursleys",
    variable2: "Privet Drive",
    variable3: "Dudley Dursley",
  },
  lordOfTheRings: {
    variable1: "Galadriel",
    variable2: "Sam",
    variable3: "Lorien",
  },
  dynamicTable: {
    variable0: "boy",
    variable1: "friend",
    variable2: "reliable",
    variable3: "Hermione",
  },
};

const tableData = [
  {
    Subject: "Hogwarts",
    People: [
      {
        name: "Harry Potter",
        description: `The ${initialVariables.dynamicTable.variable0} Who Lived`,
      },
      {
        name: "Ron Weasley",
        description: `Best ${initialVariables.dynamicTable.variable1} of Harry`,
      },
      {
        name: initialVariables.dynamicTable.variable3 + " Granger",
        description: `Smart and ${initialVariables.dynamicTable.variable2}`,
      },
    ],
    House: ["Hogwarts", "Ravenclaw", "Gryffindor", "Slytherin", "Hufflepuff"],
  },
  {
    Subject: "Lord of the Rings",
    People: [
      { name: "Frodo", description: "Bearer of the One Ring" },
      { name: "Bilbo", description: "The Hobbit" },
      { name: "Sam", description: "Loyal Friend of Frodo" },
    ],
    House: "The Fellowship",
  },
  // Add more rows as needed
];

const tableHeaders = ["Subject", "People", "House"];

const App = () => {
  const [variables, setVariables] = useState(initialVariables);
  const [selectedCategory, setSelectedCategory] = useState("harryPotter");
  const [selectedView, setSelectedView] = useState("single"); // 'single' or 'all'

  const documentDisplayRef = useRef(null);

  const handleDropdownChange = (category, variable, value) => {
    setVariables((prevVariables) => ({
      ...prevVariables,
      [category]: {
        ...prevVariables[category],
        [variable]: value,
      },
    }));
    console.log("Updated variables:", category, variable, value);
  };

  const generateDocumentContent = () => {
    const currentVariables = variables[selectedCategory];
    let content = [];

    if (selectedView === "all") {
      // Add content for Harry Potter
      content = [
        <p key="harryPotter-intro1">
          Nearly ten years had passed since the{" "}
          <strong>{currentVariables["variable1"]}</strong> had woken up to find
          their nephew on the front step, but {currentVariables["variable2"]}{" "}
          had hardly changed at all. The sun rose on the same tidy front gardens
          and lit up the brass number four on the{" "}
          {currentVariables["variable1"]}' front door; it crept into their
          living room, which was almost exactly the same as it had been on the
          night when Mr. {currentVariables["variable1"]} had seen that fateful
          news report about the owls. Only the photographs on the mantelpiece
          really showed how much time had passed. Ten years ago, there had been
          lots of pictures of what looked like a large pink beach ball wearing
          different-colored bonnets - but {currentVariables["variable3"]} was no
          longer a baby, and now the photographs showed a large blond boy riding
          his first bicycle, on a carousel at the fair, playing a computer game
          with his father, being hugged and kissed by his mother. The room held
          no sign at all that another boy lived in the house, too.
        </p>,
        <blockquote key="harryPotter-quote1">"Up! Get up! Now!"</blockquote>,
        <ul key="harryPotter-list1">
          <li>Bullet Point 1</li>
          <li>Bullet Point 2</li>
        </ul>,
      ];

      // Add content for Lord of the Rings
      content.push(
        <p key="lordOfTheRings-intro1">
          It takes a hobbit to describe the paradoxical majesty and merriment of{" "}
          <strong>{currentVariables["variable1"]}</strong>.{" "}
          {currentVariables["variable2"]} explains how folk get confused by her
          power. She sees into their hearts and makes them look at their mixed
          motives and ambitions, and some believe that she planted the dark
          motives there herself. (You can read more about this power{" "}
          <a href="#">here</a> and <a href="#">here</a>.)
        </p>,
        <blockquote key="lordOfTheRings-quote1">
          “Beautiful she is, sir! Lovely! Sometimes like a great tree in flower,
          sometimes like a white daffadowndilly, small and slender like. Hard as
          di’monds, soft as moonlight. Warm as sunlight, cold as frost in the
          stars. Proud and far-off as a snow-mountain, and as merry as any lass
          I ever saw with daisies in her hair in springtime.… It strikes me that
          folk takes their peril with them into {currentVariables["variable3"]},
          and finds it there because they’ve brought it. But perhaps you could
          call her perilous, because she’s so strong in herself. You, you could
          dash yourself to pieces on her, like a ship on a rock; or drownd
          yourself, like a hobbit in a river. But neither rock nor river would
          be to blame.” Sam, The Two Towers, Book 2, “Chapter V: The Window on
          the West,” p. 687
        </blockquote>,
        <ul key="lordOfTheRings-list2">
          <li>Bullet Point 1</li>
          <li>Bullet Point 2</li>
        </ul>
      );

      // Add content for Dynamic Table
      content.push(
        <DynamicTable
          headers={tableHeaders}
          data={tableData}
          variables={variables[selectedCategory]} // Ensure that this line is correct
        />
      );
    } else {
      // Add content for selected category
      content = [
        <p key={`${selectedCategory}-intro1`}>
          // Your dynamic content for the selected category goes here
        </p>,
        <blockquote key={`${selectedCategory}-quote1`}>
          // Your dynamic content for the selected category goes here
        </blockquote>,
        <ul key={`${selectedCategory}-list1`}>
          <li>Bullet Point 1</li>
          <li>Bullet Point 2</li>
        </ul>,
      ];

      // Add dynamic table if the selected category is "dynamicTable"
      if (selectedCategory === "dynamicTable") {
        content.push(
          <DynamicTable
            headers={tableHeaders}
            data={tableData}
            variables={variables[selectedCategory]} // Ensure that this line is correct
          />
        );
      }
    }

    return content;
  };

  const handleExportPDF = async () => {
    const pdfOptions = {
      margin: 10,
      filename: "my_document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const contentElement = documentDisplayRef.current;
    const pdfBlob = await html2pdf()
      .from(contentElement)
      .set(pdfOptions)
      .outputPdf("blob");

    const downloadLink = document.createElement("a");
    downloadLink.href = URL.createObjectURL(pdfBlob);
    downloadLink.download = pdfOptions.filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };

  const generateParagraphs = (variables, category) => {
    if (category === "harryPotter") {
      return [
        <p key={`${category}-intro1`}>
          Nearly ten years had passed since the{" "}
          <strong>{variables["variable1"]}</strong> had woken up to find their
          nephew on the front step, but {variables["variable2"]} had hardly
          changed at all. The sun rose on the same tidy front gardens and lit up
          the brass number four on the {variables["variable1"]}' front door; it
          crept into their living room, which was almost exactly the same as it
          had been on the night when Mr. {variables["variable1"]} had seen that
          fateful news report about the owls. Only the photographs on the
          mantelpiece really showed how much time had passed. Ten years ago,
          there had been lots of pictures of what looked like a large pink beach
          ball wearing different-colored bonnets - but {variables["variable3"]}{" "}
          was no longer a baby, and now the photographs showed a large blond boy
          riding his first bicycle, on a carousel at the fair, playing a
          computer game with his father, being hugged and kissed by his mother.
          The room held no sign at all that another boy lived in the house, too.
        </p>,
        <blockquote key={`${category}-quote1`}>"Up! Get up! Now!"</blockquote>,
        <ul key={`${category}-list1`}>
          <li>Bullet Point 1</li>
          <li>Bullet Point 2</li>
        </ul>,
      ];
    } else if (category === "lordOfTheRings") {
      return [
        <p key={`${category}-intro1`}>
          It takes a hobbit to describe the paradoxical majesty and merriment of{" "}
          <strong>{variables["variable1"]}</strong>. {variables["variable2"]}{" "}
          explains how folk get confused by her power. She sees into their
          hearts and makes them look at their mixed motives and ambitions, and
          some believe that she planted the dark motives there herself. (You can
          read more about this power <a href="#">here</a> and{" "}
          <a href="#">here</a>.)
        </p>,
        <blockquote key={`${category}-quote1`}>
          “Beautiful she is, sir! Lovely! Sometimes like a great tree in flower,
          sometimes like a white daffadowndilly, small and slender like. Hard as
          di’monds, soft as moonlight. Warm as sunlight, cold as frost in the
          stars. Proud and far-off as a snow-mountain, and as merry as any lass
          I ever saw with daisies in her hair in springtime.… It strikes me that
          folk takes their peril with them into {variables["variable3"]}, and
          finds it there because they’ve brought it. But perhaps you could call
          her perilous, because she’s so strong in herself. You, you could dash
          yourself to pieces on her, like a ship on a rock; or drownd yourself,
          like a hobbit in a river. But neither rock nor river would be to
          blame.” Sam, The Two Towers, Book 2, “Chapter V: The Window on the
          West,” p. 687
        </blockquote>,
        <ul key={`${category}-list2`}>
          <li>Bullet Point 1</li>
          <li>Bullet Point 2</li>
        </ul>,
      ];
    }
    return [];
  };

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        marginTop: "20px",
      }}
    >
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">My Blog</Typography>
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Grid container style={{ width: "100%" }}>
        <Grid
          item
          xs={12}
          md={4}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px", // Add spacing at the bottom
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <FormControl style={{ minWidth: "120px", marginBottom: "10px" }}>
                <InputLabel id="view-select-label">View</InputLabel>
                <Select
                  labelId="view-select-label"
                  id="view-select"
                  value={selectedView}
                  onChange={(e) => setSelectedView(e.target.value)}
                >
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="all">All</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {selectedView !== "all" && (
              <Grid item xs={12}>
                <FormControl
                  style={{ minWidth: "120px", marginBottom: "10px" }}
                >
                  <InputLabel id="category-select-label">Category</InputLabel>
                  <Select
                    labelId="category-select-label"
                    id="category-select"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <MenuItem value="harryPotter">Harry Potter</MenuItem>
                    <MenuItem value="lordOfTheRings">
                      Lord of the Rings
                    </MenuItem>
                    <MenuItem value="dynamicTable">Dynamic Table</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            )}
          </Grid>
          <Dropdowns
            category={selectedCategory}
            variables={variables[selectedCategory]}
            onChange={handleDropdownChange}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <DocumentDisplay
            ref={documentDisplayRef}
            title="My Blog Document"
            paragraphs={generateDocumentContent()}
          />
          {selectedView === "all" && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleExportPDF}
            >
              Export to PDF
            </Button>
          )}
        </Grid>
      </Grid>
      <Toolbar>
        <Button variant="contained" color="primary">
          Save
        </Button>
      </Toolbar>
    </Container>
  );
};

export default App;
