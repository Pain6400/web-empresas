import React, { useState, useContext, useEffect  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard, Assignment, Group, Calculate, Category, QrCode, HowToReg, Class, History,
  ExpandLess, ExpandMore, Settings, PersonSearch, VerifiedUser, Inventory, Payments,
  More
} from '@mui/icons-material';
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
    return requiredPermissions.some(permission => user.permissions.includes(permission));
  };

  const hasRoles = (requiredRoles) => {
    if (!user || !user.roles || user.roles.length === 0) {
      return false;
    }
    return requiredRoles.some(rol => user.roles.includes(rol));
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
      '/tareas/clientes': 'tareas',
      '/seguridad/perfiles': 'seguridad',
      '/seguridad/usuarios': 'seguridad',
      '/seguridad/permisos': 'seguridad',
      '/mantenimientos/clientes': 'mantenimientos',
      '/mantenimientos/bodegas': 'mantenimientos',
      '/mantenimientos/unidadMedida': 'mantenimientos',
      '/mantenimientos/ivs': 'mantenimientos',
      '/mantenimientos/proveedores': 'mantenimientos',
      '/mantenimientos/clasificacionProducto': 'mantenimientos',
      '/mantenimientos/productos': 'mantenimientos',
      '/mantenimientos/cAIHistorico': 'mantenimientos',
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
    <div
      style={{
        width: "250px",
        background: "#0b40a8",
        height: "150vh",
        color: "white",
      }}
    >
      <div style={{ padding: "20px", textAlign: "center" }}>
        <img src={logo} alt="Company Logo" style={{ width: "100px" }} />
      </div>
      <Divider style={{ backgroundColor: "white" }} />
      <List>
        <ListItemButton
          component={Link}
          to="/dashboard"
          selected={location.pathname === "/dashboard"}
        >
          <ListItemIcon>
            <Dashboard style={{ color: "white" }} />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        {hasRoles(["Admin"]) && (
          <>
            <ListItemButton onClick={() => handleClick("tareas")}>
              <ListItemIcon>
                <Assignment style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Tareas" />
              {openSections.tareas ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={openSections.tareas} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {(hasRoles(["Admin"]) || hasPermission(["Cle"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/tasks"
                    selected={location.pathname === "/tasks"}
                  >
                    <ListItemIcon>
                      <Group style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </>
        )}

        {/* Mantenimientos */}
        {(hasRoles(["Admin", "Mantenimientos"]) ||
          hasPermission(["Clientes"])) && (
          <>
            <ListItemButton onClick={() => handleClick("mantenimientos")}>
              <ListItemIcon>
                <Assignment style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Mantenimientos" />
              {openSections.mantenimientos ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse
              in={openSections.mantenimientos}
              timeout="auto"
              unmountOnExit
            >
              <List component="div" disablePadding>
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["Clientes"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/clientes"
                    selected={location.pathname === "/mantenimientos/clientes"}
                  >
                    <ListItemIcon>
                      <Group style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Clientes" />
                  </ListItemButton>
                )}
                {/* Bodegas */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["Bodegas"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/bodegas"
                    selected={location.pathname === "/mantenimientos/bodegas"}
                  >
                    <ListItemIcon>
                      <Inventory style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Bodegas" />
                  </ListItemButton>
                )}
                {/* Unidad Medida */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["UnidadesMedidas"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/unidadMedida"
                    selected={
                      location.pathname === "/mantenimientos/unidadMedida"
                    }
                  >
                    <ListItemIcon>
                      <Calculate style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Unidad Medida" />
                  </ListItemButton>
                )}
                {/* IVS */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["IVS"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/ivs"
                    selected={location.pathname === "/mantenimientos/ivs"}
                  >
                    <ListItemIcon>
                      <Payments style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="IVS" />
                  </ListItemButton>
                )}
                {/* Tipo Producto */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["TipoProducto"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/tipoProducto"
                    selected={
                      location.pathname === "/mantenimientos/tipoProducto"
                    }
                  >
                    <ListItemIcon>
                      <Category style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="TipoProducto" />
                  </ListItemButton>
                )}
                {/* Proveedor */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["Proveedor"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/proveedores"
                    selected={
                      location.pathname === "/mantenimientos/proveedores"
                    }
                  >
                    <ListItemIcon>
                      <HowToReg style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Proveedores" />
                  </ListItemButton>
                )}
                {/* Proveedor */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["ClasificacionProducto"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/clasificacionProducto"
                    selected={
                      location.pathname ===
                      "/mantenimientos/clasificacionProducto"
                    }
                  >
                    <ListItemIcon>
                      <Class style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Clasificacion Producto" />
                  </ListItemButton>
                )}
                {/* Productos */}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["Productos"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/mantenimientos/productos"
                    selected={
                      location.pathname ===
                      "/mantenimientos/productos"
                    }
                  >
                    <ListItemIcon>
                      <More style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Productos" />
                  </ListItemButton>
                )}
                {(hasRoles(["Admin", "Mantenimientos"]) ||
                  hasPermission(["CAIHistorico"])) && (
                    <ListItemButton
                      sx={{ pl: 4 }}
                      component={Link}
                      to="/mantenimientos/cAIHistorico"
                      selected={
                        location.pathname ===
                        "/mantenimientos/cAIHistorico"
                      }
                    >
                      <ListItemIcon>
                        <History style={{ color: "white" }} />
                      </ListItemIcon>
                      <ListItemText primary="CAI Historico" />
                    </ListItemButton>
                  )}
              </List>
            </Collapse>
          </>
        )}

        {/* Configuracion */}
        {(hasRoles(["Admin"]) ||
          hasPermission(["usuarios", "Perfil", "Permisos", "Clie"])) && (
          <>
            <ListItemButton onClick={() => handleClick("seguridad")}>
              <ListItemIcon>
                <Settings style={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText primary="Seguridad" />
              {openSections.seguridad ? (
                <ExpandLess style={{ color: "white" }} />
              ) : (
                <ExpandMore style={{ color: "white" }} />
              )}
            </ListItemButton>
            <Collapse in={openSections.seguridad} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {(hasRoles(["Admin"]) || hasPermission(["Usuario"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/seguridad/usuarios"
                    selected={location.pathname === "/seguridad/usuarios"}
                  >
                    <ListItemIcon>
                      <Group style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Usuarios" />
                  </ListItemButton>
                )}
                {(hasRoles(["Admin"]) || hasPermission(["Perfil"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/seguridad/perfiles"
                    selected={location.pathname === "/seguridad/perfiles"}
                  >
                    <ListItemIcon>
                      <PersonSearch style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Perfiles" />
                  </ListItemButton>
                )}
                {(hasRoles(["Admin"]) || hasPermission(["Permisos"])) && (
                  <ListItemButton
                    sx={{ pl: 4 }}
                    component={Link}
                    to="/seguridad/permisos"
                    selected={location.pathname === "/seguridad/permisos"}
                  >
                    <ListItemIcon>
                      <VerifiedUser style={{ color: "white" }} />
                    </ListItemIcon>
                    <ListItemText primary="Permisos" />
                  </ListItemButton>
                )}
              </List>
            </Collapse>
          </>
        )}
      </List>
    </div>
  );
};

export default Sidebar;
