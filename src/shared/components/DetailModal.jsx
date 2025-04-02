"use client"
import { Dialog, Button, Typography, Box, IconButton, Table, TableBody, TableRow, TableCell } from "@mui/material"
import { Close as CloseIcon } from "@mui/icons-material"

export const DetailModal = ({ open, onClose, title, data, fields }) => {
  if (!data) return null

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.08)",
          p: 2,
        },
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
          {title}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{
            color: "text.secondary",
            p: 0.5,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </Box>

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
        Detalles completos del registro.
      </Typography>

      <Table size="small" sx={{ mb: 2 }}>
        <TableBody>
          {fields.map((field) => (
            <TableRow
              key={field.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "& td, & th": { py: 1.5, px: 1 },
              }}
            >
              <TableCell
                component="th"
                scope="row"
                sx={{
                  width: "40%",
                  color: "text.secondary",
                  fontWeight: 500,
                  borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                }}
              >
                {field.label}
              </TableCell>
              <TableCell
                sx={{
                  fontWeight: 500,
                  borderBottom: "1px solid rgba(224, 224, 224, 0.5)",
                }}
              >
                {field.render ? field.render(data[field.id]) : data[field.id] || "—"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button
          onClick={onClose}
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
          Cerrar
        </Button>
      </Box>
    </Dialog>
  )
}

