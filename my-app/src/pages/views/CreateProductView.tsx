import React, { useState, useEffect } from "react";
import { Box, Button, TextField, Typography, Paper, MenuItem, Select, InputLabel, FormControl, CircularProgress, IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

const mockCategories = ["Plates", "Bowls", "Trays", "Cutlery"];

// Predefined fields and their types
const predefinedFields = [
  { name: "Color", type: "select", options: ['White', 'Blue', 'Brown', 'Clear', 'Silver', 'Green', 'Natural', 'Cream'] },
  { name: "Material", type: "multiselect", options: ['Porcelain', 'Ceramic', 'Wood', 'Metal', 'Glass', 'Stainless Steel', 'Melamine', 'Bamboo', 'Stoneware'] },
  { name: "Dimensions", type: "text" },
  { name: "Handle Form", type: "select", options: ['None', 'Loop', 'Integrated', 'Ergonomic'] },
  { name: "Border Material", type: "select", options: ['Gold', 'Ceramic', 'Wood', 'Glass', 'Stainless Steel', 'Melamine', 'Bamboo', 'Stoneware'] },
];

const CreateProductView: React.FC = () => {
  const [productName, setProductName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [addedFields, setAddedFields] = useState<any[]>([]);
  const [fieldToAdd, setFieldToAdd] = useState("");
  const [fieldValues, setFieldValues] = useState<any>({});

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setCategories(mockCategories);
      setLoading(false);
    }, 500);
  }, []);

  const handleAddField = () => {
    if (!fieldToAdd) return;
    const field = predefinedFields.find(f => f.name === fieldToAdd);
    if (field && !addedFields.some(f => f.name === field.name)) {
      setAddedFields([...addedFields, field]);
      setFieldToAdd("");
    }
  };

  const handleFieldValueChange = (name: string, value: any) => {
    setFieldValues({ ...fieldValues, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!productName || !description || !price || !category) {
      setError("All fields are required.");
      return;
    }
    setTimeout(() => {
      setSuccess("Product created successfully!");
      setProductName("");
      setDescription("");
      setPrice("");
      setCategory("");
      setAddedFields([]);
      setFieldValues({});
    }, 1000);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 500, mx: "auto" }}>
      <Paper elevation={3} sx={{ p: 4, mt: 2 }}>
        <Typography variant="h5" fontWeight="bold" mb={2}>
          Create a Product
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Product Name"
            variant="outlined"
            fullWidth
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            margin="normal"
            required
          />
          <TextField
            label="Description"
            variant="outlined"
            fullWidth
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            margin="normal"
            multiline
            rows={3}
            required
          />
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            margin="normal"
            type="number"
            required
          />
          <FormControl fullWidth margin="normal" required>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              label="Category"
              onChange={(e) => setCategory(e.target.value)}
              disabled={loading}
            >
              {loading ? (
                <MenuItem value=""><CircularProgress size={20} /></MenuItem>
              ) : (
                categories.map((cat) => (
                  <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                ))
              )}
            </Select>
          </FormControl>
          {addedFields.map((field) => (
            <Box key={field.name} sx={{ mt: 2 }}>
              {field.type === "select" && (
                <FormControl fullWidth>
                  <InputLabel id={`${field.name}-label`}>{field.name}</InputLabel>
                  <Select
                    labelId={`${field.name}-label`}
                    value={fieldValues[field.name] || ""}
                    label={field.name}
                    onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                  >
                    {field.options.map((opt: string) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {field.type === "multiselect" && (
                <FormControl fullWidth>
                  <InputLabel id={`${field.name}-label`}>{field.name}</InputLabel>
                  <Select
                    labelId={`${field.name}-label`}
                    multiple
                    value={fieldValues[field.name] || []}
                    label={field.name}
                    onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                  >
                    {field.options.map((opt: string) => (
                      <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              {field.type === "text" && (
                <TextField
                  label={field.name}
                  variant="outlined"
                  fullWidth
                  value={fieldValues[field.name] || ""}
                  onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                />
              )}
              {field.type === "number" && (
                <TextField
                  label={field.name}
                  variant="outlined"
                  fullWidth
                  type="number"
                  value={fieldValues[field.name] || ""}
                  onChange={(e) => handleFieldValueChange(field.name, e.target.value)}
                />
              )}
            </Box>
          ))}
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <FormControl fullWidth>
              <InputLabel id="add-field-label">Add Field</InputLabel>
              <Select
                labelId="add-field-label"
                value={fieldToAdd}
                label="Add Field"
                onChange={(e) => setFieldToAdd(e.target.value)}
              >
                {predefinedFields.filter(f => !addedFields.some(af => af.name === f.name)).map((field) => (
                  <MenuItem key={field.name} value={field.name}>{field.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
            <IconButton color="primary" onClick={handleAddField} sx={{ ml: 1 }} disabled={!fieldToAdd}>
              <AddIcon />
            </IconButton>
          </Box>
          {error && (
            <Typography color="error" mt={1}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="success.main" mt={1}>
              {success}
            </Typography>
          )}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Create Product
          </Button>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateProductView;