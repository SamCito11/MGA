"use client"

import { useState } from "react"
import { GenericList } from "../../../shared/components/GenericList"
import { DetailModal } from "../../../shared/components/DetailModal"
import { FormModal } from "../../../shared/components/FormModal"
import { StatusButton } from "../../../shared/components/StatusButton"
import { RolePrivilegeAssignment } from "../../../shared/components/RolePrivilegeAssignment"
import { Button, Chip, Box } from "@mui/material"
import { VpnKey as VpnKeyIcon } from "@mui/icons-material"

const Roles = () => {
  // Simulamos obtener los privilegios desde algún servicio o API
  const [privilegios, setPrivilegios] = useState([
    { id: 1, nombre_privilegio: "Crear" },
    { id: 2, nombre_privilegio: "Ver" },
    { id: 3, nombre_privilegio: "Editar" },
    { id: 4, nombre_privilegio: "Eliminar" },
  ])

  // Initial roles data with privileges
  const [roles, setRoles] = useState([
    {
      id: 1,
      nombre: "Administrador",
      descripcion: "Control total del sistema",
      fecha: "5/11/2024",
      estado: true,
      privileges: [
        { id: 1, nombre_privilegio: "Crear" },
        { id: 2, nombre_privilegio: "Ver" },
        { id: 3, nombre_privilegio: "Editar" },
        { id: 4, nombre_privilegio: "Eliminar" },
      ],
    },
    {
      id: 2,
      nombre: "Secretario",
      descripcion: "Gestión administrativa",
      fecha: "5/11/2024",
      estado: true,
      privileges: [
        { id: 1, nombre_privilegio: "Crear" },
        { id: 2, nombre_privilegio: "Ver" },
      ],
    },
    {
      id: 3,
      nombre: "Profesor",
      descripcion: "Gestión de cursos y estudiantes",
      fecha: "5/11/2024",
      estado: true,
      privileges: [
        { id: 2, nombre_privilegio: "Ver" },
        { id: 3, nombre_privilegio: "Editar" },
      ],
    },
    {
      id: 4,
      nombre: "Estudiantes",
      descripcion: "Acceso limitado para estudiantes",
      fecha: "5/11/2024",
      estado: true,
      privileges: [{ id: 2, nombre_privilegio: "Ver" }],
    },
  ])

  const [selectedRole, setSelectedRole] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [privilegeAssignmentOpen, setPrivilegeAssignmentOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleCreate = () => {
    setIsEditing(false)
    setSelectedRole(null)
    setFormModalOpen(true)
  }

  const handleEdit = (role) => {
    setIsEditing(true)
    setSelectedRole(role)
    setFormModalOpen(true)
  }

  const handleDelete = (role) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar el rol ${role.nombre}?`)
    if (confirmDelete) {
      setRoles((prev) => prev.filter((item) => item.id !== role.id))
    }
  }

  const handleView = (role) => {
    setSelectedRole(role)
    setDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailModalOpen(false)
    setSelectedRole(null)
  }

  const handleCloseForm = () => {
    setFormModalOpen(false)
    setSelectedRole(null)
    setIsEditing(false)
  }

  const handleSubmit = (formData) => {
    if (isEditing) {
      setRoles((prev) =>
        prev.map((item) =>
          item.id === selectedRole.id
            ? {
                ...formData,
                id: item.id,
                fecha: item.fecha,
                privileges: item.privileges || [],
              }
            : item,
        ),
      )
    } else {
      // Generate a new ID for new roles
      const newId = Math.max(...roles.map((r) => r.id)) + 1
      const today = new Date().toLocaleDateString()
      setRoles((prev) => [
        ...prev,
        {
          ...formData,
          id: newId,
          fecha: today,
          privileges: [],
        },
      ])
    }
    handleCloseForm()
  }

  const handleToggleStatus = (roleId) => {
    setRoles((prev) => prev.map((item) => (item.id === roleId ? { ...item, estado: !item.estado } : item)))
  }

  const handleAssignPrivileges = (role) => {
    setSelectedRole(role)
    setPrivilegeAssignmentOpen(true)
  }

  const handleSavePrivilegeAssignment = (data) => {
    const { roleId, privilegeIds } = data

    // Actualizar el rol con los privilegios asignados
    setRoles((prev) =>
      prev.map((role) => {
        if (role.id === roleId) {
          // Obtener los objetos de privilegio completos basados en los IDs
          const assignedPrivileges = privilegios.filter((priv) => privilegeIds.includes(priv.id))

          return {
            ...role,
            privileges: assignedPrivileges,
          }
        }
        return role
      }),
    )
  }

  const columns = [
    { id: "id", label: "ID" },
    { id: "nombre", label: "Nombre" },
    { id: "descripcion", label: "Descripción" },
    { id: "fecha", label: "Fecha Creación" },
    {
      id: "privileges",
      label: "Privilegios",
      render: (value) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value && value.length > 0
            ? value.map((priv) => (
                <Chip key={priv.id} label={priv.nombre_privilegio} size="small" color="primary" variant="outlined" />
              ))
            : "—"}
        </Box>
      ),
    },
    {
      id: "estado",
      label: "Estado",
      render: (value, row) => <StatusButton active={value} onClick={() => handleToggleStatus(row.id)} />,
    },
    {
      id: "actions",
      label: "Acciones",
      render: (_, row) => (
        <Button
          size="small"
          startIcon={<VpnKeyIcon />}
          onClick={() => handleAssignPrivileges(row)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Asignar Privilegios
        </Button>
      ),
    },
  ]

  const detailFields = [
    { id: "id", label: "ID" },
    { id: "nombre", label: "Nombre" },
    { id: "descripcion", label: "Descripción" },
    { id: "fecha", label: "Fecha Creación" },
    {
      id: "privileges",
      label: "Privilegios",
      render: (value) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value && value.length > 0
            ? value.map((priv) => (
                <Chip key={priv.id} label={priv.nombre_privilegio} size="small" color="primary" variant="outlined" />
              ))
            : "—"}
        </Box>
      ),
    },
    { id: "estado", label: "Estado", render: (value) => <StatusButton active={value} /> },
  ]

  const formFields = [
    {
      id: "nombre",
      label: "Nombre",
      type: "text",
      required: true,
    },
    {
      id: "descripcion",
      label: "Descripción",
      type: "text",
      required: true,
    },
    {
      id: "estado",
      label: "Estado",
      type: "switch",
      defaultValue: true,
    },
  ]

  return (
    <>
      <GenericList
        data={roles}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onView={handleView}
        title="Gestión de Roles"
      />

      <DetailModal
        title={`Detalle del Rol: ${selectedRole?.nombre}`}
        data={selectedRole}
        fields={detailFields}
        open={detailModalOpen}
        onClose={handleCloseDetail}
      />

      <FormModal
        title={isEditing ? "Editar Rol" : "Crear Nuevo Rol"}
        fields={formFields}
        initialData={selectedRole}
        open={formModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <RolePrivilegeAssignment
        open={privilegeAssignmentOpen}
        onClose={() => setPrivilegeAssignmentOpen(false)}
        role={selectedRole}
        allPrivileges={privilegios}
        onSave={handleSavePrivilegeAssignment}
      />
    </>
  )
}

export default Roles

