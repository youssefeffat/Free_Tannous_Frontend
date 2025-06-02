import React, { useState, useMemo } from "react";
import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Menu,
  MenuItem,
  Button,
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
import ViewColumnIcon from '@mui/icons-material/ViewColumn';

// Dummy data for demonstration
const initialProducts = [
  { id: 1, name: 'Elegant Dinner Plate', description: 'Porcelain dinner plate with gold rim', price: 25, category: 'Plates', color: 'White', material: 'Porcelain', dimensions: '27cm', handleForm: 'None', borderMaterial: 'Gold' },
  { id: 2, name: 'Ceramic Soup Bowl', description: 'Hand-painted ceramic soup bowl', price: 18, category: 'Bowls', color: 'Blue', material: 'Ceramic', dimensions: '15cm', handleForm: 'Loop', borderMaterial: 'Ceramic' },
  { id: 3, name: 'Wooden Serving Tray', description: 'Acacia wood serving tray with metal handles', price: 45, category: 'Trays', color: 'Brown', material: 'Wood', dimensions: '40x30cm', handleForm: 'Integrated', borderMaterial: 'Wood' },
  { id: 4, name: 'Glass Dessert Plate', description: 'Clear glass dessert plate with etched design', price: 12, category: 'Plates', color: 'Clear', material: 'Glass', dimensions: '20cm', handleForm: 'None', borderMaterial: 'Glass' },
  { id: 5, name: 'Stainless Steel Cutlery Set', description: 'Modern stainless steel cutlery for 6', price: 80, category: 'Cutlery', color: 'Silver', material: 'Stainless Steel', dimensions: 'Various', handleForm: 'Ergonomic', borderMaterial: 'Stainless Steel' },
  { id: 6, name: 'Melamine Kids Bowl', description: 'Durable melamine bowl with fun animal print', price: 10, category: 'Bowls', color: 'Green', material: 'Melamine', dimensions: '12cm', handleForm: 'None', borderMaterial: 'Melamine' },
  { id: 7, name: 'Bamboo Sushi Tray', description: 'Eco-friendly bamboo tray for sushi presentation', price: 30, category: 'Trays', color: 'Natural', material: 'Bamboo', dimensions: '30x15cm', handleForm: 'None', borderMaterial: 'Bamboo' },
  { id: 8, name: 'Stoneware Side Plate', description: 'Rustic stoneware side plate, dishwasher safe', price: 15, category: 'Plates', color: 'Cream', material: 'Stoneware', dimensions: '22cm', handleForm: 'None', borderMaterial: 'Stoneware' },
];
type Product = typeof initialProducts[number]

const ProductsView: React.FC = () => {
  const [products] = useState<Product[]>(initialProducts);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(0);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const allColumnKeys = useMemo(() => {
    return Object.keys(initialProducts[0]).filter(key => key !== 'id');
  }, []);

  const [visibleColumns, setVisibleColumns] = useState<string[]>(allColumnKeys);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value);
  };

  const filteredProducts = products.filter((product) =>
    Object.values(product)
      .join(" ")
      .toLowerCase()
      .includes(filter.toLowerCase())
  );

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleColumnVisibilityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    setVisibleColumns(prev =>
      checked ? [...prev, value] : prev.filter(column => column !== value)
    );
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <Box sx={{ width: "100%", maxWidth: 900 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h5">Products</Typography>
        <Button
          aria-controls="column-visibility-menu"
          aria-haspopup="true"
          onClick={handleMenuOpen}
          startIcon={<ViewColumnIcon />}
        >
          Columns
        </Button>
        <Menu
          id="column-visibility-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
        >
          <FormGroup>
            {Object.keys(initialProducts[0]).filter(key => key !== 'id').map((key) => (
              <MenuItem key={key}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={visibleColumns.includes(key)}
                      onChange={handleColumnVisibilityChange}
                      value={key}
                    />
                  }
                  label={key.charAt(0).toUpperCase() + key.slice(1)}
                />
              </MenuItem>
            ))}
          </FormGroup>
        </Menu>
      </Toolbar>
      <TextField
        label="Filter products"
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
              {allColumnKeys.filter((key: string) => visibleColumns.includes(key)).map((key: string) => (
                <TableCell key={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </TableCell>
              ))}
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredProducts
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((product) => (
                <TableRow key={product.id}>
                  {allColumnKeys.filter((key: string) => visibleColumns.includes(key)).map((key: string) => (
                    <TableCell key={key}>
                      {key === 'price' ? `$${(product as any)[key].toFixed(2)}` : (product as any)[key]}
                    </TableCell>
                  ))}
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
            {filteredProducts.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredProducts.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
};

export default ProductsView;