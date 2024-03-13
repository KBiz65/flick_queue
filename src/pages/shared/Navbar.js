import React from 'react';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import AccountCircle from '@mui/icons-material/AccountCircle';

const Navbar = () => {
  return (
    <AppBar position="fixed">
      <Toolbar variant="dense">
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          FlickQueue
        </Typography>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="account of current user"
        >
          <AccountCircle />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
