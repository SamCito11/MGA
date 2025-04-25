"use client"

import React from "react"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Paper,
  Alert,
  IconButton,
  InputAdornment,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
} from "@mui/material"
import {
  Person as PersonIcon,
  School as SchoolIcon,
  EventNote as EventNoteIcon,
  ArrowForward as ArrowForwardIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Search as SearchIcon,
  CalendarMonth as CalendarIcon,
  AttachMoney as AttachMoneyIcon,
} from "@mui/icons-material"

const VentaMatriculasForm = ({
  open,
  onClose,
  onSubmit,
  isEditing,
  clientes,
  estudiantes,
  matriculas,
  cursosDisponibles, // Recibir la prop aquí
  setClientes,
  setEstudiantes,
  initialData = null,
}) => {
  // Estados para los pasos del formulario
  const [activeStep, setActiveStep] = useState(0)
  const [transition, setTransition] = useState("slideLeft")
  const [alertMessage, setAlertMessage] = useState({ show: false, message: "", severity: "info" })

  // Estados para los datos del formulario
  const [clienteData, setClienteData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    tipoDocumento: "CC",
    numeroDocumento: "",
    fechaNacimiento: "",
    age: "",
    direccion: "",
    telefono: "",
    correo: "",
    acudiente: "",
    estado: true,
  })

  const [estudianteData, setEstudianteData] = useState({
    id: null,
    nombre: "",
    apellido: "",
    tipoDocumento: "TI",
    numeroDocumento: "",
    fechaNacimiento: "",
    age: "",
    direccion: "",
    telefono: "",
    correo: "",
    acudiente: "",
    estado: true,
  })

  const [matriculaData, setMatriculaData] = useState({
    id: null,
    cliente: "",
    estudiante: "",
    fechaInicio: "",
    fechaFin: "",
    valor: "",
    descuento: "0",
    valorFinal: "",
    observaciones: "",
    estado: "activa",
  })

  const [cursoData, setCursoData] = useState({
    id: null,
    curso: "",
    clases: "",
    valorCurso: "",
    debe: "",
    estado: "debe",
  })

  // Estados para búsqueda y filtrado
  const [clienteSearchTerm, setClienteSearchTerm] = useState("")
  const [estudianteSearchTerm, setEstudianteSearchTerm] = useState("")
  const [filteredClientes, setFilteredClientes] = useState([])
  const [filteredEstudiantes, setFilteredEstudiantes] = useState([])
  const [clienteLoading, setClienteLoading] = useState(false)
  const [estudianteLoading, setEstudianteLoading] = useState(false)
  const [clienteNotFound, setClienteNotFound] = useState(false)
  const [estudianteNotFound, setEstudianteNotFound] = useState(false)
  const [clienteCreated, setClienteCreated] = useState(false)
  const [estudianteCreated, setEstudianteCreated] = useState(false)
  const [showClienteResults, setShowClienteResults] = useState(false)
  const [showEstudianteResults, setShowEstudianteResults] = useState(false)

  const tiposDocumento = [
    { value: "CC", label: "Cédula de Ciudadanía (CC)" },
    { value: "TI", label: "Tarjeta de Identidad (TI)" },
    { value: "CE", label: "Cédula de Extranjería (CE)" },
    { value: "PA", label: "Pasaporte (PA)" },
    { value: "RC", label: "Registro Civil (RC)" },
    { value: "NIT", label: "NIT" },
  ]

  // Función para capitalizar la primera letra
  const capitalizeFirstLetter = (string) => {
    if (!string) return ""
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase()
  }

  // Inicializar datos si estamos editando
  useEffect(() => {
    if (isEditing && initialData) {
      // Buscar cliente y estudiante completos
      const clienteCompleto = clientes.find((c) => `${c.nombre} ${c.apellido}` === initialData.cliente)
      const estudianteCompleto = estudiantes.find((e) => `${e.nombre} ${e.apellido}` === initialData.estudiante)

      // Establecer datos
      if (clienteCompleto) setClienteData(clienteCompleto)
      if (estudianteCompleto) setEstudianteData(estudianteCompleto)

      setMatriculaData({
        ...initialData,
        cliente: clienteCompleto ? `${clienteCompleto.nombre} ${clienteCompleto.apellido}` : initialData.cliente,
        estudiante: estudianteCompleto
          ? `${estudianteCompleto.nombre} ${estudianteCompleto.apellido}`
          : initialData.estudiante,
      })

      setCursoData({
        curso: initialData.curso || "",
        clases: initialData.clases || "",
        valorCurso: initialData.valorCurso || "",
        debe: initialData.debe || "",
        estado: initialData.estado || "debe",
      })
    } else {
      resetFormData()
    }
  }, [isEditing, initialData, clientes, estudiantes])

  useEffect(() => {
    // Si hay una matrícula seleccionada (edición), cargar su valor
    if (isEditing && initialData && initialData.valor) {
      setMatriculaData((prev) => ({
        ...prev,
        valor: initialData.valor.toString(),
      }))
    }
    // Si no, puedes dejar el valor vacío o cargar un valor por defecto
  }, [isEditing, initialData])

  useEffect(() => {
    // Valor anual fijo, por ejemplo 350000
    const VALOR_ANUAL_MATRICULA = 350000
    if (activeStep === 2 && !matriculaData.valor) {
      setMatriculaData((prev) => ({
        ...prev,
        valor: VALOR_ANUAL_MATRICULA.toString(),
      }))
    }
  }, [activeStep])

  useEffect(() => {
    if (activeStep === 2) {
      const hoy = new Date();
      const fechaInicio = hoy.toISOString().split("T")[0];
      const fechaFin = new Date(hoy.setFullYear(hoy.getFullYear() + 1)).toISOString().split("T")[0];
      setMatriculaData((prev) => ({
        ...prev,
        fechaInicio: prev.fechaInicio || fechaInicio,
        fechaFin: prev.fechaFin || fechaFin,
      }));
    }
  }, [activeStep]);

  // Resetear formulario
  const resetFormData = () => {
    setClienteData({
      id: null,
      nombre: "",
      apellido: "",
      tipoDocumento: "CC",
      numeroDocumento: "",
      fechaNacimiento: "",
      age: "",
      direccion: "",
      telefono: "",
      correo: "",
      acudiente: "",
      estado: true,
    })

    setEstudianteData({
      id: null,
      nombre: "",
      apellido: "",
      tipoDocumento: "TI",
      numeroDocumento: "",
      fechaNacimiento: "",
      age: "",
      direccion: "",
      telefono: "",
      correo: "",
      acudiente: "",
      estado: true,
    })

    setMatriculaData({
      id: null,
      cliente: "",
      estudiante: "",
      fechaInicio: "",
      fechaFin: "",
      valor: "",
      descuento: "0",
      valorFinal: "",
      observaciones: "",
      estado: "activa",
    })

    setCursoData({
      id: null,
      curso: "",
      clases: "",
      valorCurso: "",
      debe: "",
      estado: "debe",
    })

    setClienteSearchTerm("")
    setEstudianteSearchTerm("")
    setFilteredClientes([])
    setFilteredEstudiantes([])
    setClienteNotFound(false)
    setEstudianteNotFound(false)
    setClienteCreated(false)
    setEstudianteCreated(false)
    setShowClienteResults(false)
    setShowEstudianteResults(false)
    setAlertMessage({ show: false, message: "", severity: "info" })
    setActiveStep(0)
  }

  // Manejadores para el formulario multi-paso
  const handleNext = () => {
    // Validar datos antes de avanzar
    if (activeStep === 0 && (!clienteData.nombre || !clienteData.apellido || !clienteData.numeroDocumento)) {
      setAlertMessage({
        show: true,
        message: "Por favor complete los datos del cliente",
        severity: "error",
      })
      return
    }

    if (activeStep === 1 && (!estudianteData.nombre || !estudianteData.apellido || !estudianteData.numeroDocumento)) {
      setAlertMessage({
        show: true,
        message: "Por favor complete los datos del estudiante",
        severity: "error",
      })
      return
    }

    if (activeStep === 3 && !cursoData.curso) {
      setAlertMessage({
        show: true,
        message: "Por favor seleccione un curso",
        severity: "error",
      })
      return
    }

    setAlertMessage({ show: false, message: "", severity: "info" })
    setTransition("slideLeft")
    setActiveStep((prev) => prev + 1)

    // Si avanzamos al paso de matrícula, actualizar datos
    if (activeStep === 1) {
      setMatriculaData((prev) => ({
        ...prev,
        cliente: `${clienteData.nombre} ${clienteData.apellido}`,
        estudiante: `${estudianteData.nombre} ${estudianteData.apellido}`,
      }))
    }
  }

  const handleBack = () => {
    setTransition("slideRight")
    setActiveStep((prev) => prev - 1)
  }

  // Función para calcular edad
  const calculateAge = (birthDate) => {
    if (!birthDate) return ""
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Filtrar clientes mientras se escribe
  const handleClienteSearch = (searchTerm) => {
    setClienteSearchTerm(searchTerm)
    setClienteCreated(false)
    setClienteLoading(true)

    if (searchTerm.trim() === "") {
      setFilteredClientes([])
      setClienteNotFound(false)
      setShowClienteResults(false)
      setClienteLoading(false)
      return
    }

    // Mostrar resultados después de un breve retraso para evitar demasiadas actualizaciones
    setTimeout(() => {
      const searchTermLower = searchTerm.toLowerCase()
      const matches = clientes.filter(
        (cliente) =>
          cliente.nombre.toLowerCase().includes(searchTermLower) ||
          cliente.apellido.toLowerCase().includes(searchTermLower) ||
          cliente.numeroDocumento.includes(searchTerm),
      )

      setFilteredClientes(matches)
      setClienteNotFound(matches.length === 0)
      setShowClienteResults(true)
      setClienteLoading(false)
    }, 300)
  }

  // Filtrar estudiantes mientras se escribe
  const handleEstudianteSearch = (searchTerm) => {
    setEstudianteSearchTerm(searchTerm)
    setEstudianteCreated(false)
    setEstudianteLoading(true)

    if (searchTerm.trim() === "") {
      setFilteredEstudiantes([])
      setEstudianteNotFound(false)
      setShowEstudianteResults(false)
      setEstudianteLoading(false)
      return
    }

    // Mostrar resultados después de un breve retraso para evitar demasiadas actualizaciones
    setTimeout(() => {
      const searchTermLower = searchTerm.toLowerCase()
      const matches = estudiantes.filter(
        (estudiante) =>
          estudiante.nombre.toLowerCase().includes(searchTermLower) ||
          estudiante.apellido.toLowerCase().includes(searchTermLower) ||
          estudiante.numeroDocumento.includes(searchTerm),
      )

      setFilteredEstudiantes(matches)
      setEstudianteNotFound(matches.length === 0)
      setShowEstudianteResults(true)
      setEstudianteLoading(false)
    }, 300)
  }

  // Crear cliente nuevo
  const createNewCliente = () => {
    if (!clienteData.nombre || !clienteData.apellido || !clienteData.numeroDocumento) {
      setAlertMessage({
        show: true,
        message: "Complete los campos requeridos para crear el cliente",
        severity: "error",
      })
      return
    }

    const newId = Math.max(...clientes.map((c) => c.id)) + 1
    const newCliente = {
      ...clienteData,
      id: newId,
      age: calculateAge(clienteData.fechaNacimiento),
      estado: true,
    }

    setClientes((prev) => [...prev, newCliente])
    setClienteData(newCliente)
    setClienteNotFound(false)
    setClienteCreated(true)
    setShowClienteResults(false)

    setAlertMessage({
      show: true,
      message: "Cliente creado correctamente",
      severity: "success",
    })
  }

  // Crear estudiante nuevo
  const createNewEstudiante = () => {
    if (!estudianteData.nombre || !estudianteData.apellido || !estudianteData.numeroDocumento) {
      setAlertMessage({
        show: true,
        message: "Complete los campos requeridos para crear el estudiante",
        severity: "error",
      })
      return
    }

    const newId = Math.max(...estudiantes.map((e) => e.id)) + 1
    const newEstudiante = {
      ...estudianteData,
      id: newId,
      age: calculateAge(estudianteData.fechaNacimiento),
      estado: true,
    }

    setEstudiantes((prev) => [...prev, newEstudiante])
    setEstudianteData(newEstudiante)
    setEstudianteNotFound(false)
    setEstudianteCreated(true)
    setShowEstudianteResults(false)

    setAlertMessage({
      show: true,
      message: "Estudiante creado correctamente",
      severity: "success",
    })
  }

  // Seleccionar cliente de la lista
  const handleSelectCliente = (cliente) => {
    setClienteData(cliente)
    setClienteSearchTerm("")
    setFilteredClientes([])
    setClienteNotFound(false)
    setShowClienteResults(false)
  }

  // Seleccionar estudiante de la lista
  const handleSelectEstudiante = (estudiante) => {
    setEstudianteData(estudiante)
    setEstudianteSearchTerm("")
    setFilteredEstudiantes([])
    setEstudianteNotFound(false)
    setShowEstudianteResults(false)
  }

  // Calcular valor final con descuento
  useEffect(() => {
    if (matriculaData.valor) {
      const valor = Number.parseFloat(matriculaData.valor)
      const descuento = Number.parseFloat(matriculaData.descuento || 0)
      const valorFinal = valor - descuento
      setMatriculaData((prev) => ({
        ...prev,
        valorFinal: valorFinal >= 0 ? valorFinal.toString() : "0",
      }))
    }
  }, [matriculaData.valor, matriculaData.descuento])

  // Actualizar edad al cambiar fecha de nacimiento
  useEffect(() => {
    if (clienteData.fechaNacimiento) {
      const edad = calculateAge(clienteData.fechaNacimiento)
      setClienteData((prev) => ({ ...prev, age: edad }))
    }
  }, [clienteData.fechaNacimiento])

  useEffect(() => {
    if (estudianteData.fechaNacimiento) {
      const edad = calculateAge(estudianteData.fechaNacimiento)
      setEstudianteData((prev) => ({ ...prev, age: edad }))
    }
  }, [estudianteData.fechaNacimiento])

  useEffect(() => {
    if (cursoData.curso) {
      const cursoSeleccionado = cursosDisponibles.find((c) => c.nombre === cursoData.curso)
      if (cursoSeleccionado) {
        setMatriculaData((prev) => ({
          ...prev,
          valor: cursoSeleccionado.precio.toString(),
        }))
      }
    }
  }, [cursoData.curso, cursosDisponibles])

  // Manejar envío del formulario
  const handleSubmit = () => {
    // Validar datos
    if (
      !clienteData.nombre ||
      !estudianteData.nombre ||
      !matriculaData.fechaInicio ||
      !matriculaData.fechaFin ||
      !cursoData.curso // Solo valida que el curso esté seleccionado
    ) {
      setAlertMessage({
        show: true,
        message: "Por favor complete todos los campos requeridos",
        severity: "error",
      })
      return
    }

    // Preparar datos para guardar
    const clienteNombreCompleto = `${clienteData.nombre} ${clienteData.apellido}`
    const estudianteNombreCompleto = `${estudianteData.nombre} ${estudianteData.apellido}`

    const nuevaMatricula = {
      cliente: clienteNombreCompleto,
      estudiante: estudianteNombreCompleto,
      fechaInicio: matriculaData.fechaInicio,
      fechaFin: matriculaData.fechaFin,
      valor: Number.parseFloat(matriculaData.valor),
      descuento: Number.parseFloat(matriculaData.descuento || 0),
      valorFinal: Number.parseFloat(matriculaData.valorFinal),
      observaciones: matriculaData.observaciones,
      estado: matriculaData.estado,
      curso: cursoData.curso,
      clases: cursoData.clases,
      valorCurso: cursoData.valorCurso,
      debe: cursoData.debe,
    }

    onSubmit(nuevaMatricula)
  }

  // Renderizado del contenido del paso actual
  const renderStepContent = () => {
    const slideClass = transition === "slideLeft" ? "slide-left" : "slide-right"

    switch (activeStep) {
      case 0:
        return (
          <Box className={slideClass} sx={{ animation: `${slideClass} 0.3s forwards` }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#0455a2", fontWeight: 500 }}>
              Datos del Cliente
            </Typography>

            <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Buscar cliente (nombre, apellido o documento)"
                    variant="outlined"
                    size="small"
                    value={clienteSearchTerm}
                    onChange={(e) => handleClienteSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: clienteLoading && (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ),
                    }}
                    autoFocus
                  />
                </Grid>
              </Grid>

              {showClienteResults && filteredClientes.length > 0 && (
                <Paper
                  elevation={3}
                  sx={{
                    mt: 1,
                    maxHeight: "200px",
                    overflow: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                  }}
                >
                  <List dense>
                    {filteredClientes.map((cliente) => (
                      <ListItem
                        key={cliente.id}
                        button
                        onClick={() => handleSelectCliente(cliente)}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(4, 85, 162, 0.08)",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#0455a2" }}>
                            <PersonIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${cliente.nombre} ${cliente.apellido}`}
                          secondary={`${cliente.tipoDocumento}: ${cliente.numeroDocumento}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {clienteNotFound && clienteSearchTerm !== "" && (
                <Alert
                  severity="info"
                  sx={{ mt: 2 }}
                  action={
                    <Button color="inherit" size="small" onClick={createNewCliente} disabled={clienteCreated}>
                      {clienteCreated ? "Creado" : "Crear Nuevo"}
                    </Button>
                  }
                >
                  Cliente no encontrado. Complete los datos y cree uno nuevo.
                </Alert>
              )}

              {clienteCreated && (
                <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon fontSize="inherit" />}>
                  Cliente creado correctamente
                </Alert>
              )}
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  value={clienteData.nombre}
                  onChange={(e) => setClienteData({ ...clienteData, nombre: capitalizeFirstLetter(e.target.value) })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  value={clienteData.apellido}
                  onChange={(e) => setClienteData({ ...clienteData, apellido: capitalizeFirstLetter(e.target.value) })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipo Documento</InputLabel>
                  <Select
                    value={clienteData.tipoDocumento}
                    onChange={(e) => setClienteData({ ...clienteData, tipoDocumento: e.target.value })}
                    label="Tipo Documento"
                  >
                    {tiposDocumento.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Número de Documento"
                  value={clienteData.numeroDocumento}
                  onChange={(e) => setClienteData({ ...clienteData, numeroDocumento: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Nacimiento"
                  value={clienteData.fechaNacimiento}
                  onChange={(e) => setClienteData({ ...clienteData, fechaNacimiento: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Edad"
                  value={clienteData.age}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={clienteData.direccion}
                  onChange={(e) => setClienteData({ ...clienteData, direccion: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={clienteData.telefono}
                  onChange={(e) => setClienteData({ ...clienteData, telefono: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  value={clienteData.correo}
                  onChange={(e) => setClienteData({ ...clienteData, correo: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Acudiente"
                  value={clienteData.acudiente}
                  onChange={(e) => setClienteData({ ...clienteData, acudiente: e.target.value })}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        )

      case 1:
        return (
          <Box className={slideClass} sx={{ animation: `${slideClass} 0.3s forwards` }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#0455a2", fontWeight: 500 }}>
              Datos del Estudiante
            </Typography>

            <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Buscar estudiante (nombre, apellido o documento)"
                    variant="outlined"
                    size="small"
                    value={estudianteSearchTerm}
                    onChange={(e) => handleEstudianteSearch(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                      endAdornment: estudianteLoading && (
                        <InputAdornment position="end">
                          <CircularProgress size={20} />
                        </InputAdornment>
                      ),
                    }}
                    autoFocus
                  />
                </Grid>
              </Grid>

              {showEstudianteResults && filteredEstudiantes.length > 0 && (
                <Paper
                  elevation={3}
                  sx={{
                    mt: 1,
                    maxHeight: "200px",
                    overflow: "auto",
                    border: "1px solid #e0e0e0",
                    borderRadius: "4px",
                  }}
                >
                  <List dense>
                    {filteredEstudiantes.map((estudiante) => (
                      <ListItem
                        key={estudiante.id}
                        button
                        onClick={() => handleSelectEstudiante(estudiante)}
                        sx={{
                          "&:hover": {
                            bgcolor: "rgba(4, 85, 162, 0.08)",
                          },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "#0455a2" }}>
                            <SchoolIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={`${estudiante.nombre} ${estudiante.apellido}`}
                          secondary={`${estudiante.tipoDocumento}: ${estudiante.numeroDocumento}`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              )}

              {estudianteNotFound && estudianteSearchTerm !== "" && (
                <Alert
                  severity="info"
                  sx={{ mt: 2 }}
                  action={
                    <Button color="inherit" size="small" onClick={createNewEstudiante} disabled={estudianteCreated}>
                      {estudianteCreated ? "Creado" : "Crear Nuevo"}
                    </Button>
                  }
                >
                  Estudiante no encontrado. Complete los datos y cree uno nuevo.
                </Alert>
              )}

              {estudianteCreated && (
                <Alert severity="success" sx={{ mt: 2 }} icon={<CheckCircleIcon fontSize="inherit" />}>
                  Estudiante creado correctamente
                </Alert>
              )}
            </Paper>

            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Nombre"
                  value={estudianteData.nombre}
                  onChange={(e) =>
                    setEstudianteData({ ...estudianteData, nombre: capitalizeFirstLetter(e.target.value) })
                  }
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Apellido"
                  value={estudianteData.apellido}
                  onChange={(e) =>
                    setEstudianteData({ ...estudianteData, apellido: capitalizeFirstLetter(e.target.value) })
                  }
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Tipo Documento</InputLabel>
                  <Select
                    value={estudianteData.tipoDocumento}
                    onChange={(e) => setEstudianteData({ ...estudianteData, tipoDocumento: e.target.value })}
                    label="Tipo Documento"
                  >
                    {tiposDocumento.map((tipo) => (
                      <MenuItem key={tipo.value} value={tipo.value}>
                        {tipo.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Número de Documento"
                  value={estudianteData.numeroDocumento}
                  onChange={(e) => setEstudianteData({ ...estudianteData, numeroDocumento: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  type="date"
                  label="Fecha de Nacimiento"
                  value={estudianteData.fechaNacimiento}
                  onChange={(e) => setEstudianteData({ ...estudianteData, fechaNacimiento: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Edad"
                  value={estudianteData.age}
                  InputProps={{ readOnly: true }}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Dirección"
                  value={estudianteData.direccion}
                  onChange={(e) => setEstudianteData({ ...estudianteData, direccion: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Teléfono"
                  value={estudianteData.telefono}
                  onChange={(e) => setEstudianteData({ ...estudianteData, telefono: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Correo Electrónico"
                  type="email"
                  value={estudianteData.correo}
                  onChange={(e) => setEstudianteData({ ...estudianteData, correo: e.target.value })}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Acudiente"
                  value={estudianteData.acudiente}
                  onChange={(e) => setEstudianteData({ ...estudianteData, acudiente: e.target.value })}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </Box>
        )

      case 2:
        return (
          <Box className={slideClass} sx={{ animation: `${slideClass} 0.3s forwards` }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#0455a2", fontWeight: 500 }}>
              Datos de la Matrícula
            </Typography>
            <Paper elevation={0} sx={{ p: 2, mb: 3, border: "1px solid #e0e0e0", borderRadius: "8px" }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0455a2" }}>Cliente</Typography>
                  <Typography>{matriculaData.cliente}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" sx={{ color: "#0455a2" }}>Estudiante</Typography>
                  <Typography>{matriculaData.estudiante}</Typography>
                </Grid>
              </Grid>
            </Paper>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Fecha de Inicio"
                  type="date"
                  value={matriculaData.fechaInicio}
                  onChange={(e) => setMatriculaData({ ...matriculaData, fechaInicio: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Fecha de Fin"
                  type="date"
                  value={matriculaData.fechaFin}
                  onChange={(e) => setMatriculaData({ ...matriculaData, fechaFin: e.target.value })}
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12}>
                <Divider sx={{ my: 2 }}>Información de Pago</Divider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  label="Valor de la Matrícula"
                  type="number"
                  value={matriculaData.valor}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Monto de Descuento"
                  type="number"
                  value={matriculaData.descuento}
                  onChange={(e) => setMatriculaData({ ...matriculaData, descuento: e.target.value })}
                  margin="normal"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Total a Pagar"
                  type="number"
                  value={matriculaData.valorFinal}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ fontWeight: 700, fontSize: "1.3rem" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Observaciones"
                  value={matriculaData.observaciones}
                  onChange={(e) => setMatriculaData({ ...matriculaData, observaciones: e.target.value })}
                  margin="normal"
                  multiline
                  minRows={2}
                />
              </Grid>
            </Grid>
          </Box>
        )

      case 3:
        // Obtener el curso seleccionado
        const cursoSeleccionado = cursosDisponibles.find(c => c.nombre === cursoData.curso);

        // Obtener profesores del curso (soporta array o string)
        let profesoresCurso = [];
        if (cursoSeleccionado) {
          if (Array.isArray(cursoSeleccionado.profesores)) {
            profesoresCurso = cursoSeleccionado.profesores;
          } else if (cursoSeleccionado.profesor) {
            profesoresCurso = [cursoSeleccionado.profesor];
          }
        }

        return (
          <Box className={slideClass} sx={{ animation: `${slideClass} 0.3s forwards` }}>
            <Typography variant="h6" sx={{ mb: 2, color: "#0455a2", fontWeight: 500 }}>
              Información del Curso
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="curso-label">Curso</InputLabel>
                  <Select
                    labelId="curso-label"
                    value={cursoData.curso}
                    label="Curso"
                    onChange={e => {
                      const curso = cursosDisponibles.find(c => c.nombre === e.target.value);
                      setCursoData(prev => ({
                        ...prev,
                        curso: e.target.value,
                        clases: "4",
                        profesor: curso?.profesor || "",
                        valorCurso: curso ? Math.round(Number(curso.precio) / Number(curso.numeroDeClases || 1)) * 4 : "",
                      }));
                    }}
                  >
                    {cursosDisponibles.map(curso => (
                      <MenuItem key={curso.id} value={curso.nombre}>
                        {curso.nombre}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="clases-label">Cantidad de Clases</InputLabel>
                  <Select
                    labelId="clases-label"
                    value={cursoData.clases}
                    label="Cantidad de Clases"
                    onChange={e => {
                      if (!cursoSeleccionado) return;
                      const precioPorClase = Math.round(Number(cursoSeleccionado.precio) / Number(cursoSeleccionado.numeroDeClases || 1));
                      setCursoData(prev => ({
                        ...prev,
                        clases: e.target.value,
                        valorCurso: precioPorClase * Number(e.target.value),
                      }));
                    }}
                  >
                    <MenuItem value="4">4</MenuItem>
                    <MenuItem value="8">8</MenuItem>
                    <MenuItem value="12">12</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth margin="normal" required>
                  <InputLabel id="profesor-label">Profesor</InputLabel>
                  <Select
                    labelId="profesor-label"
                    value={cursoData.profesor || ""}
                    label="Profesor"
                    onChange={e =>
                      setCursoData(prev => ({
                        ...prev,
                        profesor: e.target.value,
                      }))
                    }
                  >
                    {profesoresCurso.map(prof => (
                      <MenuItem key={prof} value={prof}>
                        {prof}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Valor del Curso"
                  type="number"
                  value={cursoData.valorCurso}
                  margin="normal"
                  InputProps={{
                    readOnly: true,
                    startAdornment: (
                      <InputAdornment position="start">
                        <AttachMoneyIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
          </Box>
        )

      default:
        return null
    }
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "10px",
          overflow: "hidden",
          height: "90vh", // Ajustar la altura del modal
        },
      }}
    >
      <DialogTitle
        sx={{
          bgcolor: "#0455a2",
          color: "white",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 2,
        }}
      >
        {isEditing ? "Editar Matrícula" : "Nueva Matrícula"}
        <IconButton onClick={onClose} sx={{ color: "white" }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ pt: 3, pb: 1, mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
          <Step>
            <StepLabel
              icon={<PersonIcon color={activeStep >= 0 ? "primary" : "disabled"} />}
              StepIconProps={{
                completed: activeStep > 0,
                active: activeStep === 0,
              }}
            >
              Cliente
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              icon={<SchoolIcon color={activeStep >= 1 ? "primary" : "disabled"} />}
              StepIconProps={{
                completed: activeStep > 1,
                active: activeStep === 1,
              }}
            >
              Estudiante
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              icon={<EventNoteIcon color={activeStep >= 2 ? "primary" : "disabled"} />}
              StepIconProps={{
                completed: activeStep > 2,
                active: activeStep === 2,
              }}
            >
              Matrícula
            </StepLabel>
          </Step>
          <Step>
            <StepLabel
              icon={<EventNoteIcon color={activeStep >= 3 ? "primary" : "disabled"} />}
              StepIconProps={{
                completed: activeStep > 3,
                active: activeStep === 3,
              }}
            >
              Curso
            </StepLabel>
          </Step>
        </Stepper>

        {alertMessage.show && (
          <Alert
            severity={alertMessage.severity}
            sx={{ mb: 2 }}
            onClose={() => setAlertMessage({ show: false, message: "", severity: "info" })}
          >
            {alertMessage.message}
          </Alert>
        )}

        <Box sx={{ flexGrow: 1, overflow: "auto" }}>
          {renderStepContent()}
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0, bgcolor: "#f9f9f9" }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{
            borderColor: "#0455a2",
            color: "#0455a2",
            "&:hover": {
              borderColor: "#033b70",
              bgcolor: "rgba(4, 85, 162, 0.04)",
            },
          }}
        >
          Cancelar
        </Button>

        {activeStep > 0 && (
          <Button
            onClick={handleBack}
            variant="outlined"
            startIcon={<ArrowForwardIcon sx={{ transform: "rotate(180deg)" }} />}
            sx={{
              borderColor: "#0455a2",
              color: "#0455a2",
              "&:hover": {
                borderColor: "#033b70",
                bgcolor: "rgba(4, 85, 162, 0.04)",
              },
            }}
          >
            Anterior
          </Button>
        )}

        {activeStep < 3 ? (
          <Button
            onClick={handleNext}
            variant="contained"
            endIcon={<ArrowForwardIcon />}
            sx={{
              bgcolor: "#0455a2",
              "&:hover": {
                bgcolor: "#033b70",
              },
            }}
          >
            Siguiente
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: "#0455a2",
              "&:hover": {
                bgcolor: "#033b70",
              },
            }}
          >
            {isEditing ? "Actualizar" : "Guardar"}
          </Button>
        )}
      </DialogActions>

      <style jsx global>{`
        @keyframes slide-left {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slide-right {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </Dialog>
  )
}

export default VentaMatriculasForm
