// src/components/menu/Sidebar.jsx
import React, { useState } from 'react';
import { List, ListItem, ListItemText, Collapse, Drawer, Divider, ListItemIcon, Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { FaTachometerAlt, FaTasks, FaUsers, FaChevronDown, FaChevronUp } from 'react-icons/fa';
import logo from '../../assets/logo.png'; // Asegúrate de que el logo esté en la carpeta correcta

const Sidebar = () => {
  const [openTasks, setOpenTasks] = useState(false);

  const handleToggleTasks = () => {
    setOpenTasks(!openTasks);
  };

  const drawerStyle = {
    width: '240px',
    backgroundColor: '#3f0e40',
    color: '#fff',
    height: '100vh',
  };

  const linkStyle = {
    textDecoration: 'none',
    color: 'inherit',
  };

  return (
    <Drawer variant="permanent" anchor="left" PaperProps={{ style: drawerStyle }}>
      <Box display="flex" justifyContent="center" alignItems="center" p={2} style={{ backgroundColor: '#3f0e40' }}>
        <img src={logo} alt="Company Logo" style={{ width: '80%', height: 'auto', backgroundColor: '#3f0e40' }} />
      </Box>
      <Divider style={{ backgroundColor: '#fff' }} />
      <List>
        <ListItem button component={Link} to="/" style={linkStyle}>
          <ListItemIcon style={{ color: '#fff' }}>
            <FaTachometerAlt />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItem>
        <Divider style={{ backgroundColor: '#fff' }} />
        <ListItem button onClick={handleToggleTasks} style={linkStyle}>
          <ListItemIcon style={{ color: '#fff' }}>
            <FaTasks />
          </ListItemIcon>
          <ListItemText primary="Tareas" />
          {openTasks ? <FaChevronUp style={{ color: '#fff' }} /> : <FaChevronDown style={{ color: '#fff' }} />}
        </ListItem>
        <Collapse in={openTasks} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItem button component={Link} to="/clients" style={{ ...linkStyle, paddingLeft: 32 }}>
              <ListItemIcon style={{ color: '#fff' }}>
                <FaUsers />
              </ListItemIcon>
              <ListItemText primary="Clientes" />
            </ListItem>
          </List>
        </Collapse>
      </List>
    </Drawer>
  );
};

export default Sidebar;
