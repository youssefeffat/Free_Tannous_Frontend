import React from "react";
import { Typography, Paper, Box, Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PeopleIcon from "@mui/icons-material/People";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useNavigate } from "react-router-dom";

const DashboardView: React.FC = () => {
  const navigate = useNavigate();
  const productCount = 42;
  const clientCount = 18;
  const ongoingQuotations = 7;

  return (
    <Box sx={{ width: "100%", maxWidth: 1200, mx: "auto", mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Welcome George to Your Dashboard
      </Typography>
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box flex="1" mx={1}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <ShoppingCartIcon color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Products</Typography>
              <Typography variant="h4" fontWeight="bold">{productCount}</Typography>
            </Box>
          </Paper>
        </Box>
        <Box flex="1" mx={1}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <PeopleIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Clients</Typography>
              <Typography variant="h4" fontWeight="bold">{clientCount}</Typography>
            </Box>
          </Paper>
        </Box>
        <Box flex="1" mx={1}>
          <Paper elevation={3} sx={{ p: 3, display: "flex", alignItems: "center" }}>
            <AssignmentIcon color="success" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h6">Ongoing Quotations</Typography>
              <Typography variant="h4" fontWeight="bold">{ongoingQuotations}</Typography>
            </Box>
          </Paper>
        </Box>
      </Box>
      {/* <Typography variant="h6" fontWeight="bold" mb={2}>
        Quick Actions
      </Typography>
      <Box display="flex" justifyContent="space-between">
        <Box flex="1" mx={1}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
            <Button
              variant="contained"
              color="primary"
              startIcon={<AddCircleOutlineIcon />}
              fullWidth
              onClick={() => navigate("/create-product")}
            >
              Create Product
            </Button>
          </Paper>
        </Box>
        <Box flex="1" mx={1}>
          <Paper elevation={2} sx={{ p: 2, textAlign: "center" }}>
            <Button
              variant="outlined"
              color="primary"
              startIcon={<FormatListBulletedIcon />}
              fullWidth
              onClick={() => navigate("/products-list")}
            >
              Product List
            </Button>
          </Paper>
        </Box> 
      </Box>*/}
    </Box>
  );
};

export default DashboardView;
