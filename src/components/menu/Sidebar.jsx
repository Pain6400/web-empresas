import React, { useState, useContext, useEffect  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard, Assignment, Group, ExpandLess, ExpandMore, Settings } from '@mui/icons-material';
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Divider  } from '@mui/material';
import logo from '../../assets/logo.png'; 
import { UserContext } from '../../context/UserContext';
const Sidebar = () => {
  const [openSections, setOpenSections] = useState({});
  const location = useLocation();
  const { user } = useContext(UserContext);

  const hasPermission = (requiredPermissions) => {
    if (!user || !user.permissions || user.permissions.length === 0) {
      return false;
    }
    return requiredPermissions.every(permission => user.permissions.includes(permission));
  };

  const handleClick = (section) => {
    setOpenSections((prevOpenSections) => ({
      ...prevOpenSections,
      [section]: !prevOpenSections[section],
    }));
  };

  useEffect(() => {
    // Define qué secciones deben estar abiertas en función de la ruta actual
    const pathToSectionMap = {
      '/tasks': 'tareas',
      '/tareas/clientes': 'tareas',
      '/configuracion/perfiles': 'configuracion',
      // Agrega más rutas y secciones según sea necesario
    };

    const sectionToOpen = pathToSectionMap[location.pathname];
    if (sectionToOpen) {
      setOpenSections((prevOpenSections) => ({
        ...prevOpenSections,
        [sectionToOpen]: true,
      }));
    }
  }, [location.pathname]);
  return (
    <div style={{ width: '250px', background: '#4B0082', height: '100vh', color: 'white' }}>
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <img 
          src={logo}
          alt="Company Logo" 
          style={{ width: '100px' }}
        />
      </div>
      <Divider style={{ backgroundColor: 'white' }} />
      <List>
        <ListItemButton component={Link} to="/dashboard" selected={location.pathname === '/dashboard'}>
          <ListItemIcon>
            <Dashboard style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        {hasPermission(['Cliente']) && (
          <>
            <ListItemButton onClick={() => handleClick('tareas')}>
              <ListItemIcon>
                <Assignment style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Tareas" />
              {openSections.tareas ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
            </ListItemButton>
            <Collapse in={openSections.tareas} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {hasPermission(['Cliente']) && (
                  <ListItemButton sx={{ pl: 4 }} component={Link} to="/tasks" selected={location.pathname === '/tasks'}>
                    <ListItemIcon>
                      <Group style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </>
        )}
        {/* Configuracion */}
        <ListItemButton onClick={() => handleClick('configuracion')}>
              <ListItemIcon>
                <Settings style={{ color: 'white' }} />
              </ListItemIcon>
              <ListItemText primary="Configuracion" />
              {openSections.configuracion ? <ExpandLess style={{ color: 'white' }} /> : <ExpandMore style={{ color: 'white' }} />}
            </ListItemButton>
            <Collapse in={openSections.configuracion} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {hasPermission(['Cliente']) && (
                  <ListItemButton sx={{ pl: 4 }} component={Link} to="/configuracion/perfiles" selected={location.pathname === '/configuracion/perfiles'}>
                    <ListItemIcon>
                      <Group style={{ color: 'white' }} />
                    </ListItemIcon>
                    <ListItemText primary="Configuracion" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
      </List>
    </div>
  );
};

export default Sidebar;
