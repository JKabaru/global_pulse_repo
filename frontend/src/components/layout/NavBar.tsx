import React from 'react';
import { AppBar, Toolbar, Typography, Button } from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const Navbar: React.FC = () => {
  return (
    <AppBar position="static" color="inherit">
      <Toolbar>
        <Button color="inherit">
          <MenuIcon />
        </Button>
        <Typography variant="h6" style={{ flexGrow: 1, marginLeft: '20px' }}>
          GlobalPulse Admin Dashboard
        </Typography>
        <Button color="inherit">Logout</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;