"use client"

import { useState, useContext } from "react"
import { Link } from "react-router-dom"
import {
  Drawer,
  List,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Collapse,
  Box,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
  Tooltip,
  Toolbar,
} from "@mui/material"
import Navbar from "./Navbar"
import {
  ExpandLess,
  ExpandMore,
  Dashboard,
  Security,
  Settings,
  MusicNote,
  ShoppingCart,
  People,
  Person,
  VpnKey,
  School,
  Schedule,
  Class,
  MeetingRoom,
  Payment,
  AssignmentTurnedIn,
} from "@mui/icons-material"
import { ThemeContext } from "../contexts/ThemeContext"

const Navigation = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"))
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { darkMode } = useContext(ThemeContext)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const toggleDrawerCollapse = () => {
    setIsCollapsed(!isCollapsed)
  }

  const [openMenus, setOpenMenus] = useState({})

  const handleSubmenuClick = (key) => {
    if (isCollapsed) {
      // Si está colapsado, expandir primero
      setIsCollapsed(false)
      // Esperar un poco para que se expanda y luego abrir el menú
      setTimeout(() => {
        setOpenMenus((prev) => ({
          ...prev,
          [key]: true,
        }))
      }, 300)
      return
    }

    setOpenMenus((prev) => {
      // Si el menú que se está clickeando ya está abierto, simplemente lo cerramos
      if (prev[key]) {
        return {
          ...prev,
          [key]: false,
        }
      }

      // Si el menú está cerrado, lo abrimos y cerramos todos los demás
      const newState = {}
      Object.keys(prev).forEach((menuKey) => {
        newState[menuKey] = false // Cerrar todos los menús
      })

      return {
        ...newState,
        [key]: true, // Abrir solo el menú clickeado
      }
    })
  }

  const menuItems = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: <Dashboard />,
    },
    {
      label: "Servicios Musicales",
      icon: <MusicNote />,
      submenu: [
        { label: "Profesores", path: "/servicios-musicales/profesores", icon: <People /> },
        {
          label: "Programación de Profesores",
          path: "/servicios-musicales/programacion-profesores",
          icon: <Schedule />,
        },
        { label: "Cursos/Matrículas", path: "/servicios-musicales/cursos-matriculas", icon: <School /> },
        { label: "Aulas", path: "/servicios-musicales/aulas", icon: <MeetingRoom /> },
        { label: "Clases", path: "/servicios-musicales/clases", icon: <Class /> },
      ],
    },
    {
      label: "Venta de Servicios",
      icon: <ShoppingCart />,
      submenu: [
        { label: "Clientes", path: "/venta-servicios/clientes", icon: <People /> },
        { label: "Estudiantes", path: "/venta-servicios/estudiantes", icon: <School /> },
        { label: "Venta de Matrículas", path: "/venta-servicios/venta-matriculas", icon: <ShoppingCart /> },
        { label: "Venta de Cursos", path: "/venta-servicios/venta-cursos", icon: <ShoppingCart /> },
        { label: "Pagos", path: "/venta-servicios/pagos", icon: <Payment /> },
        { label: "Programación de Clases", path: "/venta-servicios/programacion-clases", icon: <Schedule /> },
        { label: "Asistencia", path: "/venta-servicios/asistencia", icon: <AssignmentTurnedIn /> },
      ],
    },
    {
      label: "Configuración",
      icon: <Settings />,
      submenu: [
        { label: "Roles", path: "/configuracion/roles", icon: <VpnKey /> },
        { label: "Usuarios", path: "/configuracion/usuarios", icon: <Person /> },
        { label: "Privilegios", path: "/configuracion/privilegios", icon: <Security /> },
      ],
    },
  ]

  const renderMenuItem = (item) => {
    if (item.submenu) {
      return (
        <div key={item.label}>
          <Tooltip title={isCollapsed ? item.label : ""} placement="right" arrow>
            <ListItemButton
              onClick={() => handleSubmenuClick(item.label)}
              sx={{
                borderRadius: "8px",
                mb: 0.5,
                mx: 1,
                justifyContent: isCollapsed ? "center" : "flex-start",
                "&:hover": {
                  backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                },
                "& .MuiTouchRipple-root": {
                  color: "#6c8221",
                },
                "& .MuiTouchRipple-rippleVisible": {
                  animationDuration: "550ms",
                  opacity: 0.35,
                },
              }}
              TouchRippleProps={{
                style: {
                  color: "#6c8221",
                },
              }}
            >
              <ListItemIcon sx={{ 
                minWidth: isCollapsed ? 0 : "40px", 
                color: darkMode ? "#90caf9" : "#0455a2", 
                mr: isCollapsed ? 0 : 2 
              }}>
                {item.icon}
              </ListItemIcon>
              {!isCollapsed && (
                <>
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: 500,
                      color: darkMode ? "#ffffff" : "#333",
                    }}
                  />
                  {openMenus[item.label] ? <ExpandLess /> : <ExpandMore />}
                </>
              )}
            </ListItemButton>
          </Tooltip>
          {!isCollapsed && (
            <Collapse in={openMenus[item.label]} timeout="auto" unmountOnExit>
              <List component="div" disablePadding>
                {item.submenu.map((subItem) => (
                  <ListItemButton
                    key={subItem.path}
                    component={Link}
                    to={subItem.path}
                    sx={{
                      pl: 4,
                      py: 0.75,
                      borderRadius: "8px",
                      mx: 1,
                      mb: 0.5,
                      "&:hover": {
                        backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
                      },
                      // Cambiar el color del efecto ripple
                      "& .MuiTouchRipple-root": {
                        color: "#6c8221",
                      },
                      "& .MuiTouchRipple-rippleVisible": {
                        animationDuration: "550ms",
                        opacity: 0.35,
                      },
                    }}
                    TouchRippleProps={{
                      style: {
                        color: "#6c8221",
                      },
                    }}
                  >
                    <ListItemIcon sx={{ 
                      minWidth: "40px", 
                      color: darkMode ? "#90caf9" : "#0455a2", 
                      fontSize: "1.25rem" 
                    }}>
                      {subItem.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={subItem.label}
                      primaryTypographyProps={{
                        fontSize: "0.875rem",
                        fontWeight: 400,
                        color: darkMode ? "#ffffff" : "#555",
                      }}
                    />
                  </ListItemButton>
                ))}
              </List>
            </Collapse>
          )}
        </div>
      )
    }

    return (
      <Tooltip title={isCollapsed ? item.label : ""} placement="right" arrow>
        <ListItemButton
          key={item.path}
          component={Link}
          to={item.path}
          sx={{
            borderRadius: "8px",
            mb: 0.5,
            mx: 1,
            justifyContent: isCollapsed ? "center" : "flex-start",
            "&:hover": {
              backgroundColor: darkMode ? "rgba(255, 255, 255, 0.08)" : "rgba(0, 0, 0, 0.04)",
            },
            // Cambiar el color del efecto ripple
            "& .MuiTouchRipple-root": {
              color: "#6c8221",
            },
            "& .MuiTouchRipple-rippleVisible": {
              animationDuration: "550ms",
              opacity: 0.35,
            },
          }}
          TouchRippleProps={{
            style: {
              color: "#6c8221",
            },
          }}
        >
          <ListItemIcon sx={{ 
            minWidth: isCollapsed ? 0 : "40px", 
            color: darkMode ? "#90caf9" : "#0455a2", 
            mr: isCollapsed ? 0 : 2 
          }}>
            {item.icon}
          </ListItemIcon>
          {!isCollapsed && (
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
                color: darkMode ? "#ffffff" : "#333",
              }}
            />
          )}
        </ListItemButton>
      </Tooltip>
    )
  }

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar
        onMenuClick={handleDrawerToggle}
        isDrawerCollapsed={isCollapsed}
        toggleDrawerCollapse={toggleDrawerCollapse}
      />
      <Drawer
        variant={isMobile ? "temporary" : "permanent"}
        open={isMobile ? mobileOpen : true}
        onClose={handleDrawerToggle}
        sx={{
          height: "100%",
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: isCollapsed ? 70 : 250,
            boxSizing: "border-box",
            backgroundColor: darkMode ? "#121212" : "#ffffff",
            color: darkMode ? "#ffffff" : "#333333",
            borderRight: darkMode ? "1px solid rgba(255, 255, 255, 0.12)" : "1px solid rgba(0, 0, 0, 0.12)",
            boxShadow: darkMode ? "0 4px 20px 0 rgba(0,0,0,0.2)" : "0 4px 20px 0 rgba(0,0,0,0.05)",
            height: "100%",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          },
        }}
      >
        <Toolbar /> {/* Espacio para el navbar */}
        {!isCollapsed && (
          <>
            <Box sx={{ px: 1, py: 1 }}>
            
            </Box>
          </>
        )}
        <List sx={{ px: isCollapsed ? 0 : 1, mt: isCollapsed ? 2 : 0 }}>{menuItems.map(renderMenuItem)}</List>
        {!isCollapsed && (
          <Box sx={{ mt: "auto", p: 2 }}>
            <Divider sx={{ 
              borderColor: darkMode ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", 
              mb: 2 
            }} />
            <ListItemButton
              component={Link}
              to="/auth"
              sx={{
                borderRadius: "8px",
                backgroundColor: "#0455a2", // Botón azul
                color: "white",
                "&:hover": {
                  backgroundColor: "#033b70",
                },
                // Cambiar el color del efecto ripple
                "& .MuiTouchRipple-root": {
                  color: "#6c8221",
                },
                "& .MuiTouchRipple-rippleVisible": {
                  animationDuration: "550ms",
                  opacity: 0.35,
                },
              }}
              TouchRippleProps={{
                style: {
                  color: "#6c8221",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: "40px", color: "white" }}>
                <Security />
              </ListItemIcon>
              <ListItemText
                primary="Autenticación"
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  color: "white",
                }}
              />
            </ListItemButton>
          </Box>
        )}
        {isCollapsed && (
          <Box sx={{ mt: "auto", p: 1, display: "flex", justifyContent: "center" }}>
            <Tooltip title="Autenticación" placement="right" arrow>
              <ListItemButton
                component={Link}
                to="/auth"
                sx={{
                  borderRadius: "8px",
                  backgroundColor: "#0455a2",
                  color: "white",
                  width: 40,
                  height: 40,
                  minWidth: 40,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  p: 0,
                  "&:hover": {
                    backgroundColor: "#033b70",
                  },
                  // Cambiar el color del efecto ripple
                  "& .MuiTouchRipple-root": {
                    color: "#6c8221",
                  },
                  "& .MuiTouchRipple-rippleVisible": {
                    animationDuration: "550ms",
                    opacity: 0.35,
                  },
                }}
                TouchRippleProps={{
                  style: {
                    color: "#6c8221",
                  },
                }}
              >
                <Security fontSize="small" />
              </ListItemButton>
            </Tooltip>
          </Box>
        )}
      </Drawer>
    </Box>
  )
}

export default Navigation

