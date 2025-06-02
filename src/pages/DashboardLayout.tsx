import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import ReceiptIcon from '@mui/icons-material/Receipt';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';

import MenuIcon from "@mui/icons-material/Menu";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import HomeIcon from "@mui/icons-material/Home";
import QuizIcon from "@mui/icons-material/Quiz";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ListAltIcon from "@mui/icons-material/ListAlt";
import InventoryIcon from '@mui/icons-material/Inventory';
import DataUsageRoundedIcon from '@mui/icons-material/DataUsageRounded';
import AssignmentIndRoundedIcon from '@mui/icons-material/AssignmentIndRounded';

import { useNavigate } from "react-router-dom";
import DashboardView from "./views/DashboardView";
import CreateProductView from "./views/CreateProductView";
// import MyFriends from "./views/MyFriends";
import CategoriesView from "./views/CategoriesView";
import ProductsView from "./views/ProductsView";
import AttributesView from "./views/AttributesView";
import ProductCatalogView from "./views/ProductCatalogView";

const drawerWidth = 240;

const DashboardLayout: React.FC = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));
  const [drawerOpen, setDrawerOpen] = useState(isDesktop);
  const [selectedView, setSelectedView] = useState<
  "dashboard" | "create" | "list" | "MyQuizzes" | "friends" | "quiz" | "attributes" | "categories" | "product_management" | "products_management" | "master_data" | "products_catalog" | "inventory_management" | "quotation_management" | "invoices_management" | "crm"
  >("dashboard");
  const [menuOpenState, setMenuOpenState] = useState<Record<string, boolean>>({});

  const navigate = useNavigate();

  const toggleDrawer = () => {
    setDrawerOpen((prev) => !prev);
  };

  const toggleMenuOpen = (menuKey: string) => {
    setMenuOpenState(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

  const renderContent = () => {
    switch (selectedView) {
      case "create":
        return <CreateProductView />;
      case "list":
        return <ProductsView />;
      case "products_management":
        return <DashboardView />;
      case "master_data":
        return <DashboardView />;
      case "categories":
        return <CategoriesView />;
      case "attributes":
        return <AttributesView />;
      case "products_catalog":
        return <ProductCatalogView />;
      default:
        return <DashboardView />;
    }
  };

  // Define types for menu items
  type NestedMenuItem = {
    text: string;
    icon: React.ReactElement;
    key: "attributes" | "categories";
  };

  type SubMenuItem = {
    text: string;
    icon: React.ReactElement;
    key: "create" | "list" | "product_management" | "quotation_management";
    items?: NestedMenuItem[];
  };

  type MenuItem = {
    text: string;
    icon: React.ReactElement;
    key: "dashboard" | "products_management" | "master_data" | "friends" | "products_catalog" | "inventory_management" | "quotation_management" | "invoices_management" | "crm";
    items?: SubMenuItem[];
  };

  const menuItems: MenuItem[] = [
    { text: "Dashboard", icon: <HomeIcon />, key: "dashboard" },
    {
      text: "Product Catalog",
      icon: <ShoppingCartIcon />,
      key: "products_catalog",
    },
    {
      text: "Products Management",
      icon: <QuizIcon />, // You may want to change the icon
      key: "products_management",
      items: [
        {
          text: "Create a Product",
          icon: <AddCircleOutlineIcon />, // You may want to change the icon
          key: "create",
        },
        { text: "Products List", icon: <FormatListBulletedIcon />, key: "list" },
      ],
    },
    {
      text: "Inventory Management",
      icon: <InventoryIcon  />,
      key: "inventory_management"
    },
    {
      text: "Invoices Management",
      icon: <ReceiptIcon />,
      key: "invoices_management"
    },
    {
      text: "CRM",
      icon: <AssignmentIndRoundedIcon />,
      key: "crm",
      items: [
        {
          text: "Quotation Management",
          icon: <ListAltIcon />,
          key: "quotation_management"
        }
      ]
    },
    {
      text: "Master Data",
      icon: <DataUsageRoundedIcon />,
      key: "master_data",
      items: [
        {
          text: "Product Management",
          icon: <QuizIcon />,
          key: "product_management",
          items: [
            { text: "Attributes", icon: <ListAltIcon />, key: "attributes" },
            { text: "Categories", icon: <ListAltIcon />, key: "categories" },
          ],
        },
      ],
    }
  ];

  // Menu compte
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleAccount = () => {
    handleMenuClose();
    navigate("/account"); // ou la page souhaitée
  };

  const handleLogout = () => {
    localStorage.clear();
    handleMenuClose();
    navigate("/login");
  };

  const drawer = (
    <Box sx={{ width: drawerWidth, height: "100%" }}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
        >
          Menu
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <React.Fragment key={item.key}>
            {item.items ? (
              <>
                <ListItemButton
                  onClick={() => toggleMenuOpen(item.key)}
                  sx={{ pl: 2 }}
                >
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ ml: 1 }} />
                </ListItemButton>
                {menuOpenState[item.key] && (
                  <List component="div" disablePadding>
                    {item.items.map((subItem) => (
                      <React.Fragment key={subItem.key}>
                        {subItem.items ? (
                          <>
                            <ListItemButton 
                              sx={{ pl: 4 }}
                              onClick={() => toggleMenuOpen(subItem.key)}
                            >
                              {subItem.icon}
                              <ListItemText primary={subItem.text} sx={{ ml: 1 }} />
                            </ListItemButton>
                            {menuOpenState[subItem.key] && subItem.items && (
                              <List component="div" disablePadding>
                                {subItem.items.map((nestedItem) => (
                                  <ListItem key={nestedItem.key} disablePadding>
                                    <ListItemButton
                                      selected={selectedView === nestedItem.key}
                                      onClick={() => {
                                        setSelectedView(nestedItem.key);
                                        if (!isDesktop) {
                                          setDrawerOpen(false);
                                        }
                                      }}
                                      sx={{ pl: 6 }}
                                    >
                                      {nestedItem.icon}
                                      <ListItemText primary={nestedItem.text} sx={{ ml: 1 }} />
                                    </ListItemButton>
                                  </ListItem>
                                ))}
                              </List>
                            )}
                          </>
                        ) : (
                          <ListItem disablePadding>
                            <ListItemButton
                              selected={selectedView === subItem.key}
                              onClick={() => {
                                setSelectedView(subItem.key);
                                if (!isDesktop) {
                                  setDrawerOpen(false);
                                }
                              }}
                              sx={{ pl: 4 }}
                            >
                              {subItem.icon}
                              <ListItemText primary={subItem.text} sx={{ ml: 1 }} />
                            </ListItemButton>
                          </ListItem>
                        )}
                      </React.Fragment>
                    ))}
                  </List>
                )}
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  selected={selectedView === item.key}
                  onClick={() => {
                    setSelectedView(item.key);
                    if (!isDesktop) {
                      setDrawerOpen(false);
                    }
                  }}
                  sx={{ pl: 2 }}
                >
                  {item.icon}
                  <ListItemText primary={item.text} sx={{ ml: 1 }} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
        ))}
      </List>
    </Box>
  );

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const pseudo = user?.pseudo || "UserName";

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* AppBar qui prend toute la largeur et reste au-dessus du drawer */}
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={toggleDrawer} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          {/* <Avatar sx={{ bgcolor: "white", color: "grey", mr: 1 }}></Avatar> */}
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            {pseudo}'s Space
          </Typography>
          <IconButton sx={{ bgcolor: "white", mr: 1 }}>
            <SettingsIcon sx={{ color: "grey" }} />
          </IconButton>
          <Tooltip title="Compte">
            <IconButton onClick={handleMenuClick} sx={{ bgcolor: "white" }}>
              <AccountCircleIcon sx={{ color: "grey" }} />
            </IconButton>
          </Tooltip>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              elevation: 3,
              sx: {
                mt: 1.5,
                minWidth: 160,
              },
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleAccount}>Mon compte</MenuItem>
            <MenuItem onClick={handleLogout}>Se déconnecter</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {!isDesktop && (
        <Drawer
          anchor="left"
          variant="temporary"
          open={drawerOpen}
          onClose={toggleDrawer}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      {isDesktop && (
        <Drawer
          variant="persistent"
          open={drawerOpen}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
            },
          }}
        >
          {drawer}
        </Drawer>
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          width: {
            xs: "100%",
            sm: drawerOpen ? `calc(100% - ${drawerWidth}px)` : "100%",
          },
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
        }}
      >
        {renderContent()}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
