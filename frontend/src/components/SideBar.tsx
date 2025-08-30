import React from 'react';
import { Drawer, List, ListItem, ListItemButton, ListItemText } from '@mui/material';

const SideBar: React.FC = () => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#101F33',
        },
      }}
    >
      <List>
        {['Dashboard', 'Forecasts', 'Mappings', 'Settings'].map((text) => (
          // The 'button' prop is removed from ListItem
          <ListItem key={text} disablePadding>
            {/* Wrap the content in ListItemButton for click effects and actions */}
            <ListItemButton>
              <ListItemText primary={text} sx={{ color: '#FFFFFF' }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default SideBar;