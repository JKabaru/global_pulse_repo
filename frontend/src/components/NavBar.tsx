import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const NavBar: React.FC = () => {
  return (
    <AppBar position="static" color="transparent" elevation={0}>
      <Toolbar>
        <MenuIcon />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1, ml: 2 }}>
          GlobalPulse Admin
        </Typography>
        <Button color="inherit">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;