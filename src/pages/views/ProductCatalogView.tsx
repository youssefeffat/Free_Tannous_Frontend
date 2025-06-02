import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  Box,
  Container,
  TextField,
  InputAdornment,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Slider,
  SelectChangeEvent,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';

// Dummy data for demonstration
const initialProducts: Product[] = [
  { id: 1, name: 'Elegant Dinner Plate', description: 'Porcelain dinner plate with gold rim', price: 25, category: 'Plates', imageUrl: 'https://via.placeholder.com/150/F0F8FF/000000?text=Plate', color: 'White', material: ['Porcelain'], dimensions: '27cm', handleForm: 'None', borderMaterial: 'Gold' },
  { id: 2, name: 'Ceramic Soup Bowl', description: 'Hand-painted ceramic soup bowl', price: 18, category: 'Bowls', imageUrl: 'https://via.placeholder.com/150/FAEBD7/000000?text=Bowl', color: 'Blue', material: ['Ceramic'], dimensions: '15cm', handleForm: 'Loop', borderMaterial: 'Ceramic' },
  { id: 3, name: 'Wooden Serving Tray', description: 'Acacia wood serving tray with metal handles', price: 45, category: 'Trays', imageUrl: 'https://via.placeholder.com/150/D2B48C/000000?text=Tray', color: 'Brown', material: ['Wood', 'Metal'], dimensions: '40x30cm', handleForm: 'Integrated', borderMaterial: 'Wood' },
  { id: 4, name: 'Glass Dessert Plate', description: 'Clear glass dessert plate with etched design', price: 12, category: 'Plates', imageUrl: 'https://via.placeholder.com/150/E0FFFF/000000?text=DessertPlate', color: 'Clear', material: ['Glass'], dimensions: '20cm', handleForm: 'None', borderMaterial: 'Glass' },
  { id: 5, name: 'Stainless Steel Cutlery Set', description: 'Modern stainless steel cutlery for 6', price: 80, category: 'Cutlery', imageUrl: 'https://via.placeholder.com/150/C0C0C0/000000?text=Cutlery', color: 'Silver', material: ['Stainless Steel'], dimensions: 'Various', handleForm: 'Ergonomic', borderMaterial: 'Stainless Steel' },
  { id: 6, name: 'Melamine Kids Bowl', description: 'Durable melamine bowl with fun animal print', price: 10, category: 'Bowls', imageUrl: 'https://via.placeholder.com/150/ADD8E6/000000?text=KidsBowl', color: 'Green', material: ['Melamine'], dimensions: '12cm', handleForm: 'None', borderMaterial: 'Melamine' },
  { id: 7, name: 'Bamboo Sushi Tray', description: 'Eco-friendly bamboo tray for sushi presentation', price: 30, category: 'Trays', imageUrl: 'https://via.placeholder.com/150/8FBC8F/000000?text=SushiTray', color: 'Natural', material: ['Bamboo'], dimensions: '30x15cm', handleForm: 'None', borderMaterial: 'Bamboo' },
  { id: 8, name: 'Stoneware Side Plate', description: 'Rustic stoneware side plate, dishwasher safe', price: 15, category: 'Plates', imageUrl: 'https://via.placeholder.com/150/CD853F/000000?text=SidePlate', color: 'Cream', material: ['Stoneware'], dimensions: '22cm', handleForm: 'None', borderMaterial: 'Stoneware' },
];

interface Attribute {
  name: string;
  label: string;
  type: 'string' | 'number' | 'selectbox' | 'multi-selectbox' | 'date';
  options?: string[];
  min?: number;
  max?: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  [key: string]: any; // For dynamic attributes
}

const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3', // A shade of blue
    },
    secondary: {
      main: '#ff9800', // A shade of orange
    },
  },
});

const ProductCatalogView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [priceRange, setPriceRange] = useState<number[]>([0, 1500]);

  useEffect(() => {
    setAppliedSearchTerm(searchTerm);
    setAppliedCategory(selectedCategory);
    setAppliedPriceRange(priceRange);
  }, []);
  const [dynamicAttributes, setDynamicAttributes] = useState<Attribute[]>([]);
  const [dynamicFilterValues, setDynamicFilterValues] = useState<{[key: string]: any}>({});
  const [appliedSearchTerm, setAppliedSearchTerm] = useState('');
  const [appliedCategory, setAppliedCategory] = useState('All');
  const [appliedPriceRange, setAppliedPriceRange] = useState<number[]>([0, 1500]);
  const [appliedDynamicFilterValues, setAppliedDynamicFilterValues] = useState<{[key: string]: any}>({});

  const allCategories = ['All', ...Array.from(new Set(initialProducts.map(p => p.category)))];

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    // Simulate API call to fetch dynamic attributes
    const fetchDynamicAttributes = async () => {
      // In a real application, you would fetch this from your backend
      // For now, we'll use a mock data structure
            const mockAttributes: Attribute[] = [
        { name: 'color', label: 'Color', type: 'selectbox', options: ['White', 'Blue', 'Brown', 'Clear', 'Silver', 'Green', 'Natural', 'Cream'] },
        { name: 'material', label: 'Material', type: 'multi-selectbox', options: ['Porcelain', 'Ceramic', 'Wood', 'Metal', 'Glass', 'Stainless Steel', 'Melamine', 'Bamboo', 'Stoneware'] },
        { name: 'dimensions', label: 'Dimensions', type: 'string' },
        { name: 'handleForm', label: 'Handle Form', type: 'selectbox', options: ['None', 'Loop', 'Integrated', 'Ergonomic'] },
        { name: 'borderMaterial', label: 'Border Material', type: 'selectbox', options: ['Gold', 'Ceramic', 'Wood', 'Glass', 'Stainless Steel', 'Melamine', 'Bamboo', 'Stoneware'] },
      ];
      setDynamicAttributes(mockAttributes);

      // Initialize dynamic filter values
      const initialDynamicFilterValues: {[key: string]: any} = {};
      mockAttributes.forEach(attr => {
        if (attr.type === 'multi-selectbox') {
          initialDynamicFilterValues[attr.name] = [];
        } else if (attr.type === 'number') {
          initialDynamicFilterValues[attr.name] = [attr.min || 0, attr.max || 100];
        } else {
          initialDynamicFilterValues[attr.name] = '';
        }
      });
      setDynamicFilterValues(initialDynamicFilterValues);
      setAppliedDynamicFilterValues(initialDynamicFilterValues);
    };

    fetchDynamicAttributes();
  }, []);

  const handleCategoryChange = (event: any) => {
    setSelectedCategory(event.target.value);
  };

  const handlePriceChange = (event: Event, newValue: number | number[]) => {
    setPriceRange(newValue as number[]);
  };

  const handleApplyFilters = () => {
    setAppliedSearchTerm(searchTerm);
    setAppliedCategory(selectedCategory);
    setAppliedPriceRange(priceRange);
    setAppliedDynamicFilterValues(dynamicFilterValues);
  };

  const filteredProducts = initialProducts.filter(product => {
    const lowerCaseSearchTerm = appliedSearchTerm.toLowerCase();
    const matchesSearchTerm = (
      product.name.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.description.toLowerCase().includes(lowerCaseSearchTerm) ||
      product.price.toString().includes(lowerCaseSearchTerm) ||
      product.imageUrl.toLowerCase().includes(lowerCaseSearchTerm)
    );

    if (!matchesSearchTerm) {
      return false;
    }

    const matchesCategory = appliedCategory === 'All' || product.category === appliedCategory;
    if (!matchesCategory) {
      return false;
    }

    const matchesPriceRange = product.price >= appliedPriceRange[0] && product.price <= appliedPriceRange[1];
    if (!matchesPriceRange) {
      return false;
    }

    // Filter by dynamic attributes
    for (const attr of dynamicAttributes) {
      const filterValue = appliedDynamicFilterValues[attr.name];
      const productAttributeValue = product[attr.name];

      if (filterValue === undefined || filterValue === '' || (Array.isArray(filterValue) && filterValue.length === 0 && attr.type === 'multi-selectbox')) {
        continue; // Skip if no filter value is set for this attribute
      }

      if (productAttributeValue === undefined) {
        return false; // Product doesn't have this attribute, so it doesn't match the filter
      }

      switch (attr.type) {
        case 'string':
          if (typeof productAttributeValue === 'string' && !productAttributeValue.toLowerCase().includes(filterValue.toLowerCase())) {
            return false;
          }
          break;
        case 'number':
          if (typeof productAttributeValue === 'number' && (productAttributeValue < filterValue[0] || productAttributeValue > filterValue[1])) {
            return false;
          }
          break;
        case 'selectbox':
          if (String(productAttributeValue).toLowerCase() !== String(filterValue).toLowerCase()) {
            return false;
          }
          break;
        case 'multi-selectbox':
          if (Array.isArray(productAttributeValue)) {
            if (!filterValue.every((val: any) => {
              const filterValString = String(val);
              return productAttributeValue.map((v: any) => String(v).toLowerCase()).includes(filterValString.toLowerCase());
            })) {
              return false;
            }
          } else if (typeof productAttributeValue === 'string') {
            if (!filterValue.includes(productAttributeValue.toLowerCase())) {
              return false;
            }
          }
          break;
        case 'date':
          // Date filtering logic (to be implemented if needed)
          break;
        default:
          break;
      }
    }

    return true;
  });

  const handleDynamicFilterChange = (attributeName: string, value: any) => {
    setDynamicFilterValues(prev => ({
      ...prev,
      [attributeName]: value,
    }));
  };

  const handleDynamicNumberRangeChange = (attributeName: string) => (
    event: Event, newValue: number | number[]
  ) => {
    setDynamicFilterValues(prev => ({
      ...prev,
      [attributeName]: newValue as number[],
    }));
  };

  const handleDynamicMultiSelectChange = (attributeName: string) => (
    event: SelectChangeEvent<string[]>
  ) => {
    const { value } = event.target;
    setDynamicFilterValues(prev => ({
      ...prev,
      [attributeName]: typeof value === 'string' ? value.split(',') : value,
    }));
  };

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Product Catalog
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mt: 8 }}>
          <Box sx={{ flexShrink: 0, width: { xs: '100%', md: '250px' }, position: { md: 'sticky' }, top: { md: 20 }, alignSelf: { xs: 'center', md: 'flex-start' }, mb: { xs: 4, md: 0 } }}>
            <TextField
              label="Search Products"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel id="category-select-label">Category</InputLabel>
              <Select
                labelId="category-select-label"
                id="category-select"
                value={selectedCategory}
                label="Category"
                onChange={handleCategoryChange}
                color="primary"
              >
                {allCategories.map(category => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ width: '100%', pr: 2 }}>
              <Typography gutterBottom>Price Range</Typography>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelDisplay="auto"
                min={0}
                max={1500}
                step={10}
                marks
                disableSwap
              />
              <Typography variant="body2" color="text.secondary">
                ${priceRange[0]} - ${priceRange[1]}
              </Typography>
            </Box>

            {/* Dynamic Filters */}
            {dynamicAttributes.map(attr => (
              <Box key={attr.name} sx={{ marginBottom: 2 }}>
                <Typography variant="subtitle1" gutterBottom>{attr.label}</Typography>
                {attr.type === 'string' && (
                  <TextField
                    label={attr.label}
                    variant="outlined"
                    fullWidth
                    value={dynamicFilterValues[attr.name] || ''}
                    onChange={(e) => handleDynamicFilterChange(attr.name, e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
                {attr.type === 'number' && (
                  <Box sx={{ width: '100%', padding: '0 10px' }}>
                    <Slider
                      value={dynamicFilterValues[attr.name] || [attr.min || 0, attr.max || 100]}
                      onChange={handleDynamicNumberRangeChange(attr.name)}
                      valueLabelDisplay="auto"
                      min={attr.min || 0}
                      max={attr.max || 100}
                      disableSwap
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography variant="body2">{attr.min || 0}</Typography>
                      <Typography variant="body2">{attr.max || 100}</Typography>
                    </Box>
                  </Box>
                )}
                {(attr.type === 'selectbox' || attr.type === 'multi-selectbox') && attr.options && (
                  <FormControl fullWidth variant="outlined">
                    <InputLabel>{attr.label}</InputLabel>
                    <Select
                        multiple={attr.type === 'multi-selectbox'}
                        value={dynamicFilterValues[attr.name] || (attr.type === 'multi-selectbox' ? [] : '')}
                        onChange={attr.type === 'multi-selectbox' ? handleDynamicMultiSelectChange(attr.name) : (e) => handleDynamicFilterChange(attr.name, e.target.value)}
                        label={attr.label}
                      >
                        {attr.type === 'selectbox' && <MenuItem value="">All</MenuItem>}
                        {attr.type === 'multi-selectbox' && <MenuItem value={[] as string[]}>All</MenuItem>}
                        {attr.options.map(option => (
                          <MenuItem key={option} value={option}>
                            {option}
                          </MenuItem>
                        ))}
                      </Select>
                  </FormControl>
                )}
                {/* Add other types like 'date' if needed */}
              </Box>
            ))}
          <Button
            variant="contained"
            color="primary"
            onClick={handleApplyFilters}
            sx={{ mt: 2, width: '100%' }}
          >
            Search
          </Button>
          </Box>

          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 4, justifyContent: 'center' }}>

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <Box key={product.id} sx={{
                    flexBasis: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(50% - 16px)', lg: 'calc(33.33% - 16px)' },
                    maxWidth: { xs: '100%', sm: 'calc(50% - 16px)', md: 'calc(50% - 16px)', lg: 'calc(33.33% - 16px)' },
                    display: 'flex',
                  }}>
                    <Card sx={{ height: 350, display: 'flex', flexDirection: 'column', bgcolor: '#f5f5f5' }}>
                      <CardMedia
                        component="img"
                        sx={{
                          height: 180,
                          objectFit: 'cover',
                        }}
                        image={product.imageUrl}
                        alt={product.name}
                      />
                      <CardContent sx={{ flexGrow: 1, overflow: 'hidden', minHeight: 100 }}>
                        <Typography gutterBottom variant="h5" component="h2" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {product.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                          {product.description}
                        </Typography>
                        <Typography variant="h6" color="text.primary" sx={{ mt: 1 }}>
                          ${product.price.toFixed(2)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Box>
                ))
              ) : (
                <Box sx={{ width: '100%' }}>
                  <Typography variant="h6" align="center" color="text.secondary">
                    No products found matching your criteria.
                  </Typography>
                </Box>
              )}

            </Box>

          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default ProductCatalogView;