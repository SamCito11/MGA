"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogActions, Button, TextField, Typography, Box, IconButton, Grid } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

export function EditModal({ open, onClose, onConfirm, fields, data, title = "Editar" }) {
  const [formData, setFormData] = useState({})
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (data && open) {
      setFormData({ ...data })
      setErrors({})
    }
  }, [data, open])

  const handleChange = (field) => (event) => {
    const value = event.target.value
    setFormData((prev) => ({
      ...prev,
      [field.id]: value,
    }))

    // Clear error when field is edited
    if (errors[field.id]) {
      setErrors((prev) => ({
        ...prev,
        [field.id]: null,
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    let isValid = true

    fields.forEach((field) => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} es requerido`
        isValid = false
      }

      if (field.validator && formData[field.id]) {
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

  const handleSubmit = () => {
    if (validateForm()) {
      onConfirm(formData)
    }
  }

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
        Actualice los detalles para mantener su información al día.
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        {fields.map((field) => (
          <Grid item xs={12} sm={field.fullWidth ? 12 : 6} key={field.id}>
            <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500 }}>
              {field.label}
            </Typography>
            <TextField
              value={formData[field.id] || ""}
              onChange={handleChange(field)}
              fullWidth
              variant="outlined"
              placeholder={field.placeholder || ""}
              required={field.required}
              error={!!errors[field.id]}
              helperText={errors[field.id]}
              type={field.type || "text"}
              multiline={field.multiline}
              rows={field.rows || 1}
              disabled={field.disabled}
              InputProps={{
                sx: {
                  borderRadius: "8px",
                },
              }}
            />
          </Grid>
        ))}
      </Grid>

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
          onClick={handleSubmit}
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
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  )
}

