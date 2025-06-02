import React, { useState } from "react";
import {
  Box,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Toolbar,
  Typography,
  InputAdornment,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Chip,
  Stack
} from "@mui/material";

// Dummy data for demonstration
const initialAttributes = [
  { id: 1, name: "Color", description: "Product color", type: "selectbox", choices: ['White', 'Blue', 'Brown', 'Clear', 'Silver', 'Green', 'Natural', 'Cream'] },
  { id: 2, name: "Material", description: "Material type", type: "multiselectbox", choices: ['Porcelain', 'Ceramic', 'Wood', 'Metal', 'Glass', 'Stainless Steel', 'Melamine', 'Bamboo', 'Stoneware'] },
  { id: 3, name: "Dimensions", description: "Product dimensions", type: "text" },
  { id: 4, name: "Handle Form", description: "Form of the handle", type: "selectbox", choices: ['None', 'Loop', 'Integrated', 'Ergonomic'] },
  { id: 5, name: "Border Material", description: "Material of the border", type: "selectbox", choices: ['Gold', 'Ceramic', 'Wood', 'Glass', 'Stainless Steel', 'Melamine', 'Bamboo', 'Stoneware'] },
];

type Attribute = {
  id: number;
  name: string;
  description: string;
  type: string;
  choices?: string[];
};

const ATTRIBUTE_TYPES = [
  { value: "selectbox", label: "Select Box" },
  { value: "multiselectbox", label: "Multi Select Box" },
  { value: "text", label: "Text" },
  { value: "number", label: "Number" }
];

const AttributesView: React.FC = () => {
  const [attributes, setAttributes] = useState<Attribute[]>(initialAttributes);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newAttribute, setNewAttribute] = useState<Partial<Attribute>>({ type: "text", choices: [] });
  const [choiceInput, setChoiceInput] = useState("");

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredAttributes = attributes.filter((attribute) =>
    Object.values(attribute)
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDialogOpen = () => {
    setDialogOpen(true);
    setNewAttribute({ type: "text", choices: [] });
    setChoiceInput("");
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleAttributeChange = (field: keyof Attribute, value: any) => {
    setNewAttribute((prev) => ({ ...prev, [field]: value }));
    if (field === "type" && (value === "selectbox" || value === "multiselectbox")) {
      setNewAttribute((prev) => ({ ...prev, choices: [] }));
    }
  };

  const handleAddChoice = () => {
    if (choiceInput.trim() && newAttribute.choices) {
      setNewAttribute((prev) => ({ ...prev, choices: [...(prev.choices || []), choiceInput.trim()] }));
      setChoiceInput("");
    }
  };

  const handleDeleteChoice = (choice: string) => {
    setNewAttribute((prev) => ({ ...prev, choices: (prev.choices || []).filter((c) => c !== choice) }));
  };

  const handleCreateAttribute = () => {
    if (!newAttribute.name || !newAttribute.type) return;
    const attr: Attribute = {
      id: attributes.length + 1,
      name: newAttribute.name,
      description: newAttribute.description || "",
      type: newAttribute.type,
      choices: (newAttribute.type === "selectbox" || newAttribute.type === "multiselectbox") ? newAttribute.choices : undefined
    };
    setAttributes((prev) => [...prev, attr]);
    setDialogOpen(false);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5">Attributes</Typography>
        <Button variant="contained" color="primary" onClick={handleDialogOpen}>
          New Attribute
        </Button>
      </Toolbar>
      <TextField
        label="Filter attributes"
        variant="outlined"
        value={filter}
        onChange={handleFilterChange}
        fullWidth
        margin="normal"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Choices</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAttributes
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((attribute) => (
                <TableRow key={attribute.id}>
                  <TableCell>{attribute.name}</TableCell>
                  <TableCell>{attribute.description}</TableCell>
                  <TableCell>{attribute.type}</TableCell>
                  <TableCell>
                    {(attribute.type === "selectbox" || attribute.type === "multiselectbox") && attribute.choices
                      ? attribute.choices.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell align="right">
                    <IconButton color="primary">
                      <EditIcon />
                    </IconButton>
                    <IconButton color="error">
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            {filteredAttributes.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No attributes found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredAttributes.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
      <Dialog open={dialogOpen} onClose={handleDialogClose} fullWidth maxWidth="sm">
        <DialogTitle>New Attribute</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            value={newAttribute.name || ""}
            onChange={(e) => handleAttributeChange("name", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Description"
            value={newAttribute.description || ""}
            onChange={(e) => handleAttributeChange("description", e.target.value)}
            fullWidth
            margin="normal"
          />
          <TextField
            select
            label="Type"
            value={newAttribute.type || "text"}
            onChange={(e) => handleAttributeChange("type", e.target.value)}
            fullWidth
            margin="normal"
          >
            {ATTRIBUTE_TYPES.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
          {(newAttribute.type === "selectbox" || newAttribute.type === "multiselectbox") && (
            <>
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 2 }}>
                <TextField
                  label="Add Choice"
                  value={choiceInput}
                  onChange={(e) => setChoiceInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      handleAddChoice();
                    }
                  }}
                  size="small"
                />
                <Button onClick={handleAddChoice} variant="outlined" size="small">
                  Add
                </Button>
              </Stack>
              <Stack direction="row" spacing={1} sx={{ mt: 1, flexWrap: "wrap" }}>
                {(newAttribute.choices || []).map((choice) => (
                  <Chip
                    key={choice}
                    label={choice}
                    onDelete={() => handleDeleteChoice(choice)}
                    sx={{ mb: 1 }}
                  />
                ))}
              </Stack>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>Cancel</Button>
          <Button onClick={handleCreateAttribute} variant="contained" color="primary">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AttributesView;