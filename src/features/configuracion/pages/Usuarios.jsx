"use client"

import { useState } from "react"
import { GenericList } from "../../../shared/components/GenericList"
import { DetailModal } from "../../../shared/components/DetailModal"
import { FormModal } from "../../../shared/components/FormModal"
import { StatusButton } from "../../../shared/components/StatusButton"
import { UserRoleAssignment } from "../../../shared/components/UserRoleAssignment"
import { Button, Chip, Box } from "@mui/material"
import { PersonAdd as PersonAddIcon } from "@mui/icons-material"

const Usuarios = () => {
  // Simulamos obtener los roles desde algún servicio o API
  const [roles, setRoles] = useState([
    { id: 1, nombre: "Administrador", descripcion: "Control total del sistema", estado: true },
    { id: 2, nombre: "Secretario", descripcion: "Gestión administrativa", estado: true },
    { id: 3, nombre: "Profesor", descripcion: "Gestión de cursos y estudiantes", estado: true },
    { id: 4, nombre: "Estudiante", descripcion: "Acceso limitado para estudiantes", estado: true },
  ])

  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      nombre: "Juan Pérez",
      tel: "123456789",
      correo: "juan@example.com",
      estado: true,
      roles: [{ id: 1, nombre: "Administrador" }],
      primaryRoleId: 1,
    },
    {
      id: 2,
      nombre: "Ana Gómez",
      tel: "987654321",
      correo: "ana@example.com",
      estado: false,
      roles: [
        { id: 3, nombre: "Profesor" },
        { id: 4, nombre: "Estudiante" },
      ],
      primaryRoleId: 3,
    },
  ])

  const [selectedUsuario, setSelectedUsuario] = useState(null)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [formModalOpen, setFormModalOpen] = useState(false)
  const [roleAssignmentOpen, setRoleAssignmentOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  const handleCreate = () => {
    setIsEditing(false)
    setSelectedUsuario(null)
    setFormModalOpen(true)
  }

  const handleEdit = (usuario) => {
    setIsEditing(true)
    setSelectedUsuario(usuario)
    setFormModalOpen(true)
  }

  const handleDelete = (usuario) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar al usuario ${usuario.nombre}?`)
    if (confirmDelete) {
      setUsuarios((prev) => prev.filter((item) => item.id !== usuario.id))
    }
  }

  const handleView = (usuario) => {
    setSelectedUsuario(usuario)
    setDetailModalOpen(true)
  }

  const handleCloseDetail = () => {
    setDetailModalOpen(false)
    setSelectedUsuario(null)
  }

  const handleCloseForm = () => {
    setFormModalOpen(false)
    setSelectedUsuario(null)
    setIsEditing(false)
  }

  const handleSubmit = (formData) => {
    if (isEditing) {
      setUsuarios((prev) =>
        prev.map((item) =>
          item.id === selectedUsuario.id
            ? {
                ...formData,
                id: item.id,
                roles: item.roles || [],
                primaryRoleId: item.primaryRoleId,
              }
            : item,
        ),
      )
    } else {
      const newId = Math.max(...usuarios.map((u) => u.id)) + 1
      setUsuarios((prev) => [
        ...prev,
        {
          ...formData,
          id: newId,
          roles: [],
          primaryRoleId: null,
        },
      ])
    }
    handleCloseForm()
  }

  const handleToggleStatus = (usuarioId) => {
    setUsuarios((prev) => prev.map((item) => (item.id === usuarioId ? { ...item, estado: !item.estado } : item)))
  }

  const handleAssignRoles = (usuario) => {
    setSelectedUsuario(usuario)
    setRoleAssignmentOpen(true)
  }

  const handleSaveRoleAssignment = (data) => {
    const { userId, roleIds, primaryRoleId } = data

    // Actualizar el usuario con los roles asignados
    setUsuarios((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          // Obtener los objetos de rol completos basados en los IDs
          const assignedRoles = roles.filter((role) => roleIds.includes(role.id))

          return {
            ...user,
            roles: assignedRoles,
            primaryRoleId: primaryRoleId,
          }
        }
        return user
      }),
    )
  }

  function getPrimaryRoleName(user) {
    // Add null checks
    if (!user || !user.roles || !user.roles.length) {
      return 'No role assigned';
    }
    
    const primaryRole = user.roles.find(role => role.id === user.primaryRoleId);
    return primaryRole ? primaryRole.name : 'No primary role';
  }

  const columns = [
    { id: "id", label: "ID" },
    { id: "nombre", label: "Nombre" },
    { id: "tel", label: "Tel" },
    { id: "correo", label: "Correo" },
    {
      id: "roles",
      label: "Roles",
      render: (value, row) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value && value.length > 0
            ? value.map((role) => (
                <Chip
                  key={role.id}
                  label={role.nombre}
                  size="small"
                  color={role.id === row.primaryRoleId ? "primary" : "default"}
                />
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
          startIcon={<PersonAddIcon />}
          onClick={() => handleAssignRoles(row)}
          sx={{
            borderRadius: "8px",
            textTransform: "none",
            fontWeight: 500,
          }}
        >
          Asignar Roles
        </Button>
      ),
    },
  ]

  const detailFields = [
    { id: "id", label: "ID" },
    { id: "nombre", label: "Nombre" },
    { id: "tel", label: "Tel" },
    { id: "correo", label: "Correo" },
    {
      id: "roles",
      label: "Roles",
      render: (value) => (
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
          {value && value.length > 0
            ? value.map((role) => (
                <Chip
                  key={role.id}
                  label={role.nombre}
                  size="small"
                  color={role.id === selectedUsuario?.primaryRoleId ? "primary" : "default"}
                />
              ))
            : "—"}
        </Box>
      ),
    },
    {
      id: "primaryRoleId",
      label: "Rol Principal",
      render: (_, row) => getPrimaryRoleName(row),
    },
    { id: "estado", label: "Estado", render: (value) => <StatusButton active={value} /> },
  ]

  const formFields = [
    { id: "nombre", label: "Nombre", type: "text", required: true },
    { id: "tel", label: "Tel", type: "text", required: true },
    { id: "correo", label: "Correo", type: "email", required: true },
    { id: "estado", label: "Estado", type: "switch", defaultValue: true },
  ]

  return (
    <>
      <GenericList
        data={usuarios}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
        title="Gestión de Usuarios"
      />

      <DetailModal
        title={`Detalle del Usuario: ${selectedUsuario?.nombre}`}
        data={selectedUsuario}
        fields={detailFields}
        open={detailModalOpen}
        onClose={handleCloseDetail}
      />

      <FormModal
        title={isEditing ? "Editar Usuario" : "Crear Nuevo Usuario"}
        fields={formFields}
        initialData={selectedUsuario}
        open={formModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />

      <UserRoleAssignment
        open={roleAssignmentOpen}
        onClose={() => setRoleAssignmentOpen(false)}
        user={selectedUsuario}
        allRoles={roles}
        onSave={handleSaveRoleAssignment}
      />
    </>
  )
}

export default Usuarios



