"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Grid,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  useTheme,
  IconButton,
  Tooltip,
} from "@mui/material"
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Event as EventIcon,
  MoreVert as MoreVertIcon,
  MusicNote as MusicNoteIcon,
  AccessTime as AccessTimeIcon,
  Room as RoomIcon,
} from "@mui/icons-material"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"

// Datos de ejemplo para el dashboard
const mockProfesores = [
  { id: 1, nombre: "María González", estudiantes: 28, imagen: null, especialidad: "Piano" },
  { id: 2, nombre: "Carlos Rodríguez", estudiantes: 24, imagen: null, especialidad: "Guitarra" },
  { id: 3, nombre: "Ana Martínez", estudiantes: 22, imagen: null, especialidad: "Violín" },
  { id: 4, nombre: "Juan López", estudiantes: 19, imagen: null, especialidad: "Canto" },
  { id: 5, nombre: "Laura Sánchez", estudiantes: 17, imagen: null, especialidad: "Batería" },
]

const mockCursos = [
  { id: 1, nombre: "Guitarra para principiantes", estudiantes: 45, ingresos: 4500 },
  { id: 2, nombre: "Piano avanzado", estudiantes: 32, ingresos: 5600 },
  { id: 3, nombre: "Canto y técnica vocal", estudiantes: 28, ingresos: 3800 },
  { id: 4, nombre: "Violín intermedio", estudiantes: 24, ingresos: 3200 },
  { id: 5, nombre: "Batería básica", estudiantes: 20, ingresos: 2800 },
]

const mockDesertores = [
  { mes: "Enero", cantidad: 5 },
  { mes: "Febrero", cantidad: 3 },
  { mes: "Marzo", cantidad: 7 },
  { mes: "Abril", cantidad: 4 },
  { mes: "Mayo", cantidad: 6 },
  { mes: "Junio", cantidad: 8 },
]

const mockIngresos = [
  { mes: "Enero", ingresos: 12500 },
  { mes: "Febrero", ingresos: 14200 },
  { mes: "Marzo", ingresos: 15800 },
  { mes: "Abril", ingresos: 13600 },
  { mes: "Mayo", ingresos: 16900 },
  { mes: "Junio", ingresos: 18200 },
]

const mockClasesHoy = [
  { id: 1, hora: "09:00", curso: "Piano avanzado", profesor: "María González", aula: "A101" },
  { id: 2, hora: "10:30", curso: "Guitarra para principiantes", profesor: "Carlos Rodríguez", aula: "B202" },
  { id: 3, hora: "12:00", curso: "Canto y técnica vocal", profesor: "Ana Martínez", aula: "C303" },
  { id: 4, hora: "15:30", curso: "Violín intermedio", profesor: "Juan López", aula: "A105" },
  { id: 5, hora: "17:00", curso: "Batería básica", profesor: "Laura Sánchez", aula: "D404" },
]

// Colores para los gráficos
const COLORS = ["#0455a2", "#6c8221", "#5c6bc0", "#26a69a", "#ec407a"]

const Dashboard = () => {
  const theme = useTheme()
  const [loading, setLoading] = useState(true)

  // Simular carga de datos
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  // Calcular total de estudiantes desertores
  const totalDesertores = mockDesertores.reduce((sum, item) => sum + item.cantidad, 0)

  // Calcular total de ingresos
  const totalIngresos = mockIngresos.reduce((sum, item) => sum + item.ingresos, 0)

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        Dashboard
      </Typography>

      <Grid container spacing={3}>
        {/* Tarjetas de resumen */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Profesores con más estudiantes
              </Typography>
              <Tooltip title="Más opciones">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <List sx={{ flexGrow: 1 }}>
              {mockProfesores.map((profesor) => (
                <ListItem
                  key={profesor.id}
                  sx={{
                    px: 0,
                    borderBottom: "1px solid rgba(0,0,0,0.06)",
                    "&:last-child": { borderBottom: "none" },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar sx={{ bgcolor: COLORS[profesor.id % COLORS.length] }}>
                      {profesor.imagen ? (
                        <img src={profesor.imagen || "/placeholder.svg"} alt={profesor.nombre} />
                      ) : (
                        profesor.nombre.charAt(0)
                      )}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={profesor.nombre}
                    secondary={profesor.especialidad}
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                  <Chip
                    label={`${profesor.estudiantes} estudiantes`}
                    size="small"
                    sx={{
                      bgcolor: "rgba(4, 85, 162, 0.1)",
                      color: "#0455a2",
                      fontWeight: 500,
                    }}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Top 5 cursos más solicitados */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Top 5 cursos más solicitados
              </Typography>
              <Tooltip title="Más opciones">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
              <TableContainer sx={{ flexGrow: 1 }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 600 }}>Curso</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 600 }}>
                        Estudiantes
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        Ingresos
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {mockCursos.map((curso) => (
                      <TableRow key={curso.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <MusicNoteIcon sx={{ mr: 1, color: COLORS[curso.id % COLORS.length] }} />
                            {curso.nombre}
                          </Box>
                        </TableCell>
                        <TableCell align="center">{curso.estudiantes}</TableCell>
                        <TableCell align="right">${curso.ingresos.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Box sx={{ mt: 3, height: 250 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={mockCursos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="nombre" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="estudiantes" name="Estudiantes" fill="#0455a2" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Reporte de estudiantes desertores */}
        <Grid item xs={12} md={4}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Estudiantes desertores
              </Typography>
              <Tooltip title="Más opciones">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#ef5350", width: 56, height: 56, mr: 2 }}>
                <TrendingDownIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  {totalDesertores}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total de desertores en 2024
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockDesertores} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <RechartsTooltip />
                  <Line type="monotone" dataKey="cantidad" name="Desertores" stroke="#ef5350" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Ingresos de cursos por mes */}
        <Grid item xs={12} md={8}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
              height: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Ingresos de cursos por mes
              </Typography>
              <Tooltip title="Más opciones">
                <IconButton size="small">
                  <MoreVertIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
              <Avatar sx={{ bgcolor: "#6c8221", width: 56, height: 56, mr: 2 }}>
                <TrendingUpIcon />
              </Avatar>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 600 }}>
                  ${totalIngresos.toLocaleString()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Ingresos totales en 2024
                </Typography>
              </Box>
            </Box>
            <Box sx={{ flexGrow: 1, height: 250 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={mockIngresos} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="mes" />
                  <YAxis />
                  <RechartsTooltip formatter={(value) => [`$${value.toLocaleString()}`, "Ingresos"]} />
                  <Line type="monotone" dataKey="ingresos" name="Ingresos" stroke="#6c8221" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </Grid>

        {/* Clases del día */}
        <Grid item xs={12}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Clases del día
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <EventIcon sx={{ mr: 1 }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {new Date().toLocaleDateString("es-ES", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </Typography>
              </Box>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 600 }}>Hora</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Curso</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Profesor</TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>Aula</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 600 }}>
                      Estado
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {mockClasesHoy.map((clase) => (
                    <TableRow key={clase.id}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <AccessTimeIcon sx={{ mr: 1, fontSize: 18, color: "#0455a2" }} />
                          {clase.hora}
                        </Box>
                      </TableCell>
                      <TableCell>{clase.curso}</TableCell>
                      <TableCell>{clase.profesor}</TableCell>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <RoomIcon sx={{ mr: 1, fontSize: 18, color: "#6c8221" }} />
                          {clase.aula}
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={
                            new Date().getHours() >= Number.parseInt(clase.hora.split(":")[0])
                              ? "Completada"
                              : "Pendiente"
                          }
                          size="small"
                          color={
                            new Date().getHours() >= Number.parseInt(clase.hora.split(":")[0]) ? "success" : "primary"
                          }
                          variant="outlined"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default Dashboard

