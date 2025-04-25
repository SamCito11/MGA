import { Box, Typography, Grid, Paper, Divider, Avatar } from "@mui/material"
import { Person as PersonIcon, School as SchoolIcon } from "@mui/icons-material"
import { StatusButton } from "../../../shared/components/StatusButton"

const VentaCursosDetailContent = ({ curso, clientes, estudiantes }) => {
  // Buscar cliente y estudiante completos
  const clienteCompleto = clientes?.find((c) => `${c.nombre} ${c.apellido}` === curso.cliente)
  const estudianteCompleto = estudiantes?.find((e) => `${e.nombre} ${e.apellido}` === curso.estudiante)

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={3}>
        {/* Sección de Cliente */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%", borderRadius: "8px", bgcolor: "#f8f9fa" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#0455a2", mr: 2 }}>
                <PersonIcon />
              </Avatar>
              <Typography variant="h6">{curso.cliente}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {clienteCompleto && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Tipo de Documento
                  </Typography>
                  <Typography variant="body1">{clienteCompleto.tipoDocumento}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Número de Documento
                  </Typography>
                  <Typography variant="body1">{clienteCompleto.numeroDocumento}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">{clienteCompleto.telefono}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Correo Electrónico
                  </Typography>
                  <Typography variant="body1">{clienteCompleto.correo}</Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Sección de Estudiante */}
        <Grid item xs={12} md={6}>
          <Paper elevation={1} sx={{ p: 2, height: "100%", borderRadius: "8px", bgcolor: "#f8f9fa" }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "#0455a2", mr: 2 }}>
                <SchoolIcon />
              </Avatar>
              <Typography variant="h6">{curso.estudiante}</Typography>
            </Box>

            <Divider sx={{ mb: 2 }} />

            {estudianteCompleto && (
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Tipo de Documento
                  </Typography>
                  <Typography variant="body1">{estudianteCompleto.tipoDocumento}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Número de Documento
                  </Typography>
                  <Typography variant="body1">{estudianteCompleto.numeroDocumento}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Edad
                  </Typography>
                  <Typography variant="body1">{estudianteCompleto.age} años</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" color="textSecondary">
                    Acudiente
                  </Typography>
                  <Typography variant="body1">{estudianteCompleto.acudiente}</Typography>
                </Grid>
              </Grid>
            )}
          </Paper>
        </Grid>

        {/* Sección de Curso */}
        <Grid item xs={12}>
          <Paper elevation={1} sx={{ p: 2, borderRadius: "8px", bgcolor: "#f8f9fa" }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#0455a2" }}>
              Detalles del Curso
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Curso
                </Typography>
                <Typography variant="body1">{curso.curso}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Ciclo
                </Typography>
                <Typography variant="body1">{curso.ciclo}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Clases
                </Typography>
                <Typography variant="body1">{curso.clases}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Valor del Curso
                </Typography>
                <Typography variant="body1">${curso.valor_curso.toLocaleString()}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Valor Pendiente
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                  ${curso.debe.toLocaleString()}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Typography variant="body2" color="textSecondary">
                  Estado
                </Typography>
                <StatusButton status={curso.estado} />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default VentaCursosDetailContent
