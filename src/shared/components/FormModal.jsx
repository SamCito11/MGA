"use client"

import {
  Dialog,
  DialogActions,
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
} from "@mui/material"
import { useState, useEffect } from "react"
import { Close as CloseIcon } from "@mui/icons-material"

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

      default:
        return (
          <Box key={field.id} sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <TextField
              fullWidth
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
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "16px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          p: 3,
        },
      }}
    >
      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
            {title}
          </Typography>
          <IconButton
            onClick={onClose}
            aria-label="close"
            sx={{
              color: "text.secondary",
              p: 1,
              "&:hover": {
                backgroundColor: "rgba(0, 0, 0, 0.04)",
              },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {subtitle || "Actualice los detalles para mantener su información al día."}
        </Typography>

        <Box sx={{ mb: 3 }}>
          {Object.entries(groupedFields).map(([section, sectionFields]) => (
            <Box key={section} sx={{ mb: 3 }}>
              {section !== "default" && (
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
                    pb: 1,
                  }}
                >
                  {section}
                </Typography>
              )}
              <Grid container spacing={2}>
                {sectionFields.map((field) => (
                  <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.id}>
                    {renderField(field)}
                  </Grid>
                ))}
              </Grid>
            </Box>
          ))}
        </Box>

        <DialogActions sx={{ p: 0, justifyContent: "flex-end", gap: 1 }}>
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              borderColor: "rgba(0, 0, 0, 0.12)",
            }}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disableElevation
            sx={{
              backgroundColor: "#4f46e5",
              borderRadius: "8px",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              "&:hover": {
                backgroundColor: "#4338ca",
              },
            }}
          >
            {submitButtonText}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}

