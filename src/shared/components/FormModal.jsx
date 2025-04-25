
"use client"

import {
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  TextField,
  Switch,
  FormControlLabel,
  Box,
  IconButton,
  Typography,
  Grid,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  Checkbox,
  Radio,
  RadioGroup,
  ListItemText,
  Paper,
} from "@mui/material"
import { useState, useEffect } from "react"
import { Close as CloseIcon } from "@mui/icons-material"
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"

export const FormModal = ({
  title,
  subtitle,
  fields,
  initialData,
  open,
  onClose,
  onSubmit,
  submitButtonText = "Guardar Cambios",
}) => {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (open) {
      if (initialData) {
        setFormData({ ...initialData })
      } else {
        const defaultData = {}
        fields.forEach((field) => {
          defaultData[field.id] = field.defaultValue || ""
        })
        setFormData(defaultData)
      }
      setErrors({})
    }
  }, [initialData, fields, open])

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))

    // Clear error when field is edited
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    fields.forEach((field) => {
      if (
        field.required &&
        (formData[field.id] === undefined || formData[field.id] === null || formData[field.id] === "")
      ) {
        newErrors[field.id] = `${field.label} es requerido`
        isValid = false
      }

      if (field.validator && formData[field.id] !== undefined && formData[field.id] !== null) {
        const validationError = field.validator(formData[field.id])
        if (validationError) {
          newErrors[field.id] = validationError
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const renderField = (field) => {
    switch (field.type) {
      case "switch":
        return (
          <Box key={field.id} sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={!!formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  color="primary"
                />
              }
              label={field.label}
              sx={{
                width: "100%",
                ml: 0,
                "& .MuiFormControlLabel-label": {
                  flex: 1,
                  fontWeight: 500,
                },
              }}
            />
            {errors[field.id] && <FormHelperText error>{errors[field.id]}</FormHelperText>}
          </Box>
        )

      case "select":
        return (
          <Box key={field.id} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <FormControl fullWidth variant="outlined" error={!!errors[field.id]}>
              <Select
                value={formData[field.id] || ""}
                onChange={(e) => handleChange(field.id, e.target.value)}
                displayEmpty
                disabled={field.disabled}
                sx={{
                  borderRadius: "8px",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: errors[field.id] ? "error.main" : "rgba(0, 0, 0, 0.23)",
                  },
                }}
              >
                <MenuItem value="" disabled>
                  <Typography color="text.secondary">Seleccionar {field.label}</Typography>
                </MenuItem>
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
            </FormControl>
          </Box>
        )

      case "multiSelect":
        return (
          <Box key={field.id} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <FormControl fullWidth variant="outlined" error={!!errors[field.id]}>
              <Select
                multiple
                value={Array.isArray(formData[field.id]) ? formData[field.id] : []}
                onChange={(e) => handleChange(field.id, e.target.value)}
                renderValue={(selected) => selected.join(", ")}
                disabled={field.disabled}
              >
                {field.options?.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    <Checkbox
                      checked={Array.isArray(formData[field.id]) && formData[field.id].indexOf(option.value) > -1}
                    />
                    <ListItemText primary={option.label} />
                  </MenuItem>
                ))}
              </Select>
              {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
            </FormControl>
          </Box>
        )

      case "checkbox":
        return (
          <Box key={field.id} sx={{ mb: 2 }}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!formData[field.id]}
                  onChange={(e) => handleChange(field.id, e.target.checked)}
                  color="primary"
                  disabled={field.disabled}
                />
              }
              label={field.label}
              sx={{
                width: "100%",
                ml: 0,
                "& .MuiFormControlLabel-label": {
                  flex: 1,
                  fontWeight: 500,
                },
              }}
            />
            {errors[field.id] && <FormHelperText error>{errors[field.id]}</FormHelperText>}
          </Box>
        )

      case "radio":
        return (
          <Box key={field.id} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <FormControl fullWidth error={!!errors[field.id]}>
              <RadioGroup value={formData[field.id] || ""} onChange={(e) => handleChange(field.id, e.target.value)}>
                {field.options?.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio color="primary" disabled={field.disabled} />}
                    label={option.label}
                  />
                ))}
              </RadioGroup>
              {errors[field.id] && <FormHelperText>{errors[field.id]}</FormHelperText>}
            </FormControl>
          </Box>
        )

      case "permissionsTable":
        return (
          <Box key={field.id}>
            <Typography sx={{ 
                mb: 0.5, 
                color: '#666', 
                fontSize: '0.75rem',
                textDecoration: 'none'
              }}>
                {field.section}
              </Typography>
            <TableContainer 
              component={Paper} 
              sx={{ 
                mt: 0.5,
                '& .MuiTableCell-root': {
                  padding: '1px 2px',
                  fontSize: '0.75rem',
                  height: '24px',
                  lineHeight: '1'
                },
                '& .MuiCheckbox-root': {
                  padding: '1px',
                  '& .MuiSvgIcon-root': {
                    fontSize: '18px'
                  }
                }
              }}
            >
              <Table size="small" sx={{ tableLayout: 'fixed' }}>
                <TableHead>
                  <TableRow>
                    <TableCell>Módulo</TableCell>
                    <TableCell align="center" sx={{ width: '60px' }}>Visualizar</TableCell>
                    <TableCell align="center" sx={{ width: '60px' }}>Crear</TableCell>
                    <TableCell align="center" sx={{ width: '60px' }}>Editar</TableCell>
                    <TableCell align="center" sx={{ width: '60px' }}>Eliminar</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {field.modules.map((module) => (
                    <TableRow key={module.id}>
                      <TableCell sx={{ whiteSpace: 'normal', wordBreak: 'break-word' }}>{module.label}</TableCell>
                      {['visualizar', 'crear', 'editar', 'eliminar'].map((action) => (
                        <TableCell key={`${module.id}-${action}`} align="center">
                          <Checkbox
                            size="small"
                            checked={formData[`${module.id}-${action}`] || false}
                            onChange={(e) => handleChange(`${module.id}-${action}`, e.target.checked)}
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )

      default:
        return (
          <Box key={field.id} sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
              size="small"
              type={field.type || "text"}
              value={formData[field.id] || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              variant="outlined"
              placeholder={field.placeholder || ""}
              error={!!errors[field.id]}
              helperText={errors[field.id]}
              multiline={field.multiline}
              rows={field.rows || 1}
              disabled={field.disabled}
              InputProps={{
                inputProps: {
                  min: field.min,
                  max: field.max,
                },
                sx: {
                  borderRadius: "8px",
                },
              }}
            />
          </Box>
        )
    }
  }

  // Agrupar campos por secciones si están definidas
  const groupedFields = fields.reduce((acc, field) => {
    const section = field.section || "default"
    if (!acc[section]) {
      acc[section] = []
    }
    acc[section].push(field)
    return acc
  }, {})

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "8px",
          maxHeight: '90vh',
          '& .MuiDialogContent-root': {
            overflowX: 'hidden'
          }
        },
      }}
    >
      <Box
        sx={{
          bgcolor: "#0455a2",
          color: "white",
          p: 1,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: '1rem' }}>
          {title}
        </Typography>
        <IconButton onClick={onClose} sx={{ color: "white", p: 0.5 }}>
          <CloseIcon />
        </IconButton>
      </Box>

      <form onSubmit={handleSubmit}>
        <DialogContent
          sx={{
            p: 1,
            '& .MuiBox-root': { mb: 0.75 },
            '& .MuiTypography-root': { 
              fontSize: '0.75rem',  // Reduced from 0.875rem
              color: '#555',
              mb: 0.25,            // Reduced from 0.5
              fontWeight: 500
            },
            '& .MuiFormControl-root': { 
              mb: 0.5,             // Reduced from 0.75
              '& .MuiInputBase-root': {
                minHeight: '30px',  // Reduced from 32px
                fontSize: '0.75rem' // Reduced from 0.875rem
              }
            },
            '& .MuiTextField-root': {
              '& .MuiInputBase-root': {
                height: '30px',     // Reduced from 32px
                fontSize: '0.75rem' // Reduced from 0.875rem
              }
            },
            '& .MuiSelect-select': {
              height: '30px !important',    // Reduced from 32px
              minHeight: '30px !important', // Reduced from 32px
              fontSize: '0.75rem',          // Reduced from 0.875rem
              padding: '2px 8px'            // Reduced padding
            },
            '& .MuiFormControlLabel-root': {
              marginLeft: 0,
              marginRight: 0,
              minHeight: '30px'    // Reduced from 32px
            },
            '& .MuiFormControlLabel-label': {
              fontSize: '0.75rem'  // Reduced from 0.875rem
            }
          }}
        >
          <Grid container spacing={1}>
            {fields
              .filter(field => field.id !== 'programacion') // Remove programacion field
              .map((field) => (
                <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.id}>
                  {renderField(field)}
                </Grid>
              ))}
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 1, bgcolor: "#f5f5f5", gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            size="small"
            sx={{ 
              borderRadius: "4px", 
              px: 2,
              py: 0.5,
              fontSize: '0.875rem',
              minHeight: '30px'
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            size="small"
            sx={{ 
              borderRadius: "4px", 
              px: 2,
              py: 0.5,
              fontSize: '0.875rem',
              bgcolor: "#0455a2",
              minHeight: '30px'
            }}
          >
            {submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
