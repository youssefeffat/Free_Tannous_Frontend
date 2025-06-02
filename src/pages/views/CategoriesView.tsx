import React, { useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination, // Added TablePagination
  TableRow,
  TextField,
  Toolbar,
  Typography,
  InputAdornment
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

// Dummy data for demonstration
const initialCategories = [
  { id: 1, name: "Plates", description: "Various types of plates" },
  { id: 2, name: "Bowls", description: "Different sizes and styles of bowls" },
  { id: 3, name: "Trays", description: "Serving and decorative trays" },
  { id: 4, name: "Cutlery", description: "Knives, forks, spoons, etc." },
];

// Remove dummy data and update Category type
type Category = {
  id: number;
  name: string;
  description: string;
  subcategory?: Category | null;
};

const CategoriesView: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [filter, setFilter] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [currentCategory, setCurrentCategory] = useState<Partial<Category>>({});
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(null);
  const [page, setPage] = useState(0); // Added page state
  const [rowsPerPage, setRowsPerPage] = useState(5); // Added rowsPerPage state


  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredCategories = categories.filter((cat) =>
    Object.values(cat)
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const handleOpenDialog = (mode: "create" | "edit", category?: Category) => {
    setDialogMode(mode);
    setCurrentCategory(category || {});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setCurrentCategory({});
  };

  const handleDialogChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentCategory({ ...currentCategory, [e.target.name]: e.target.value });
  };

  const handleSaveCategory = () => {
    if (dialogMode === "create") {
      const newCategory = {
        id: categories.length ? Math.max(...categories.map((c) => c.id)) + 1 : 1,
        name: currentCategory.name || "",
        description: currentCategory.description || "",
      };
      setCategories([...categories, newCategory]);
    } else if (dialogMode === "edit" && currentCategory.id) {
      setCategories(
        categories.map((cat) =>
          cat.id === currentCategory.id ? { ...cat, ...currentCategory } : cat
        )
      );
    }
    handleCloseDialog();
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      setCategories(categories.filter((cat) => cat.id !== categoryToDelete.id));
    }
    setDeleteDialogOpen(false);
    setCategoryToDelete(null);
  };

  // Added handleChangePage function
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Added handleChangeRowsPerPage function
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5">Categories</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog("create")}
        >
          New Category
        </Button>
      </Toolbar>
      <TextField
        label="Filter categories"
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
              <TableCell>Subcategory</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCategories
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage) // Added slicing for pagination
              .map((category) => (
              <TableRow key={category.id}>
                <TableCell>{category.name}</TableCell>
                <TableCell>{category.description}</TableCell>
                <TableCell>{category.subcategory ? category.subcategory.name : "-"}</TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog("edit", category)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteCategory(category)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
            {filteredCategories.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center"> {/* Updated colSpan to 4 */}
                  No categories found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {/* Added TablePagination component */}
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredCategories.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>{dialogMode === "create" ? "Create Category" : "Edit Category"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            name="name"
            label="Name"
            type="text"
            fullWidth
            value={currentCategory.name || ""}
            onChange={handleDialogChange}
          />
          <TextField
            margin="dense"
            name="description"
            label="Description"
            type="text"
            fullWidth
            value={currentCategory.description || ""}
            onChange={handleDialogChange}
          />
          <TextField
            select
            margin="dense"
            name="subcategory"
            label="Subcategory"
            fullWidth
            value={currentCategory.subcategory?.id || ""}
            onChange={(e) => {
              const selectedId = Number(e.target.value);
              const selectedSub = categories.find((cat) => cat.id === selectedId) || null;
              setCurrentCategory({ ...currentCategory, subcategory: selectedSub });
            }}
            SelectProps={{ native: true }}
          >
            <option value="">None</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCategory} variant="contained">
            {dialogMode === "create" ? "Create" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Category</DialogTitle>
        <DialogContent>
          Are you sure you want to delete the category "{categoryToDelete?.name}"?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={confirmDeleteCategory} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesView;