import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Badge,
  Avatar,
  Box,
  Container,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications as NotificationsIcon,
  AccountCircle,
  Home,
  SchoolOutlined,
  PostAdd,
  Login,
  PersonAdd,
} from '@mui/icons-material';

const Navbar = () => {
  const [isAuthenticated, _setIsAuthenticated] = useState(false); // Example state
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const toggleDrawer = (open) => (event) => {
    setDrawerOpen(open);
  };

  return (
    <>
      <AppBar position="sticky">
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={toggleDrawer(true)}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>

            <Typography
              variant="h6"
              noWrap
              component={RouterLink}
              to="/"
              sx={{
                mr: 2,
                display: 'flex',
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ProLearnX
            </Typography>

            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              <Button color="inherit" component={RouterLink} to="/">
                Home
              </Button>
              <Button color="inherit" component={RouterLink} to="/learning-plans">
                Learning Plans
              </Button>
            </Box>

            <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center' }}>
              {isAuthenticated ? (
                <>
                  <Button 
                    color="inherit" 
                    component={RouterLink} 
                    to="/create-post"
                    sx={{ mr: 1 }}
                  >
                    Post
                  </Button>
                  <IconButton
                    color="inherit"
                    onClick={handleNotificationsOpen}
                  >
                    <Badge badgeContent={3} color="error">
                      <NotificationsIcon />
                    </Badge>
                  </IconButton>
                  <IconButton
                    edge="end"
                    onClick={handleProfileMenuOpen}
                    color="inherit"
                    sx={{ ml: 1 }}
                  >
                    <Avatar sx={{ width: 32, height: 32 }} />
                  </IconButton>
                </>
              ) : (
                <>
                  <Button color="inherit" component={RouterLink} to="/login">
                    Login
                  </Button>
                  <Button color="inherit" component={RouterLink} to="/register">
                    Register
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Profile menu */}
      <Menu
        anchorEl={anchorEl}
        id="menu-appbar"
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem component={RouterLink} to="/profile/username" onClick={handleMenuClose}>
          My Profile
        </MenuItem>
        <MenuItem component={RouterLink} to="/create-learning-plan" onClick={handleMenuClose}>
          Create Learning Plan
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
      </Menu>

      {/* Notifications menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        keepMounted
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
      >
        <MenuItem onClick={handleNotificationsClose}>
          New like on your post
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          Someone commented on your post
        </MenuItem>
        <MenuItem onClick={handleNotificationsClose}>
          New follower: User123
        </MenuItem>
      </Menu>

      {/* Mobile drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
      >
        <Box
          sx={{ width: 250 }}
          role="presentation"
          onClick={toggleDrawer(false)}
        >
          <List>
            <ListItem button component={RouterLink} to="/">
              <ListItemIcon><Home /></ListItemIcon>
              <ListItemText primary="Home" />
            </ListItem>
            <ListItem button component={RouterLink} to="/learning-plans">
              <ListItemIcon><SchoolOutlined /></ListItemIcon>
              <ListItemText primary="Learning Plans" />
            </ListItem>
            {isAuthenticated ? (
              <>
                <ListItem button component={RouterLink} to="/create-post">
                  <ListItemIcon><PostAdd /></ListItemIcon>
                  <ListItemText primary="Create Post" />
                </ListItem>
                <ListItem button component={RouterLink} to="/profile/username">
                  <ListItemIcon><AccountCircle /></ListItemIcon>
                  <ListItemText primary="My Profile" />
                </ListItem>
              </>
            ) : (
              <>
                <ListItem button component={RouterLink} to="/login">
                  <ListItemIcon><Login /></ListItemIcon>
                  <ListItemText primary="Login" />
                </ListItem>
                <ListItem button component={RouterLink} to="/register">
                  <ListItemIcon><PersonAdd /></ListItemIcon>
                  <ListItemText primary="Register" />
                </ListItem>
              </>
            )}
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Navbar;