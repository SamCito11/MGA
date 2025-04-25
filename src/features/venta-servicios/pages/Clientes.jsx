import React, { useState, useEffect } from 'react';
import { GenericList } from '../../../shared/components/GenericList';
import { DetailModal } from '../../../shared/components/DetailModal';
import { FormModal } from '../../../shared/components/FormModal';
import { StatusButton } from '../../../shared/components/StatusButton';

const Clientes = () => {
  const [clientes, setClientes] = useState([
    { 
      id: 1, 
      nombre: 'Juan', 
      apellido: 'Pérez', 
      tipoDocumento: 'CC', 
      numeroDocumento: '1234567890', 
      fechaNacimiento: '1993-05-15', 
      age: 30, 
      direccion: 'Calle 123', 
      telefono: '123456789', 
      correo: 'juan.perez@email.com',
      acudiente: 'María López',
      estado: true 
    },
    { 
      id: 2, 
      nombre: 'María', 
      apellido: 'Gómez', 
      tipoDocumento: 'TI', 
      numeroDocumento: '0987654321', 
      fechaNacimiento: '1998-08-20', 
      age: 25, 
      direccion: 'Avenida 456', 
      telefono: '987654321', 
      correo: 'maria.gomez@email.com',
      acudiente: 'Pedro Gómez',
      estado: false 
    },
    // Add more clients as needed
  ]);

  const [selectedCliente, setSelectedCliente] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedCliente(null);
    setFormModalOpen(true);
  };

  const handleEdit = (cliente) => {
    setIsEditing(true);
    setSelectedCliente(cliente);
    setFormModalOpen(true);
  };

  const handleDelete = (cliente) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar el cliente ${cliente.nombre}?`);
    if (confirmDelete) {
      setClientes(prev => prev.filter(item => item.id !== cliente.id));
    }
  };

  const handleView = (cliente) => {
    setSelectedCliente(cliente);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedCliente(null);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setSelectedCliente(null);
    setIsEditing(false);
  };

  const calcularEdad = (fechaNacimiento) => {
    if (!fechaNacimiento) return 0;
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();
    
    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }
    
    return edad;
  };

  const handleSubmit = (formData) => {
    // Calcular la edad basada en la fecha de nacimiento
    const edadCalculada = calcularEdad(formData.fechaNacimiento);
    const datosCompletos = { ...formData, age: edadCalculada };
    
    if (isEditing) {
      setClientes(prev => prev.map(item => 
        item.id === selectedCliente.id ? { ...datosCompletos, id: item.id } : item
      ));
    } else {
      const newId = Math.max(...clientes.map(c => c.id), 0) + 1;
      setClientes(prev => [...prev, { ...datosCompletos, id: newId }]);
    }
    handleCloseForm();
  };

  const handleToggleStatus = (clienteId) => {
    setClientes(prev => prev.map(item => 
      item.id === clienteId ? { ...item, estado: !item.estado } : item
    ));
  };

  const columns = [
    { id: 'nombre', label: 'Nombre' },
    { id: 'apellido', label: 'Apellido' },
    { id: 'tipoDocumento', label: 'Tipo Documento' },
    { id: 'numeroDocumento', label: 'N° Documento' },
    { id: 'fechaNacimiento', label: 'Fecha Nacimiento' },
    { id: 'age', label: 'Edad' },
    { id: 'direccion', label: 'Dirección' },
    { id: 'telefono', label: 'Teléfono' },
    { 
      id: 'estado', 
      label: 'Estado',
      render: (value, row) => (
        <StatusButton 
          active={value} 
          onClick={() => handleToggleStatus(row.id)}
        />
      )
    }
  ];

  const detailFields = [
    { id: 'nombre', label: 'Nombre' },
    { id: 'apellido', label: 'Apellido' },
    { id: 'tipoDocumento', label: 'Tipo Documento' },
    { id: 'numeroDocumento', label: 'N° Documento' },
    { id: 'fechaNacimiento', label: 'Fecha Nacimiento' },
    { id: 'age', label: 'Edad' },
    { id: 'direccion', label: 'Dirección' },
    { id: 'telefono', label: 'Teléfono' },
    { id: 'correo', label: 'Correo Electrónico' },
    { id: 'acudiente', label: 'Acudiente' },
    { id: 'estado', label: 'Estado', render: (value) => <StatusButton active={value} /> }
  ];

  const formFields = [
    { id: 'nombre', label: 'Nombre', type: 'text', required: true },
    { id: 'apellido', label: 'Apellido', type: 'text', required: true },
    { 
      id: 'tipoDocumento', 
      label: 'Tipo Documento', 
      type: 'select', 
      options: [
        { value: 'CC', label: 'Cédula de Ciudadanía (CC)' },
        { value: 'TI', label: 'Tarjeta de Identidad (TI)' },
        { value: 'CE', label: 'Cédula de Extranjería (CE)' },
        { value: 'PA', label: 'Pasaporte (PA)' },
        { value: 'RC', label: 'Registro Civil (RC)' },
        { value: 'NIT', label: 'NIT' }
      ],
      required: true 
    },
    { id: 'numeroDocumento', label: 'N° Documento', type: 'text', required: true },
    { id: 'fechaNacimiento', label: 'Fecha de Nacimiento', type: 'date', required: true },
    { id: 'direccion', label: 'Dirección', type: 'text', required: true },
    { id: 'telefono', label: 'Teléfono', type: 'text', required: true },
    { id: 'correo', label: 'Correo Electrónico', type: 'email', required: true },
    { id: 'acudiente', label: 'Acudiente', type: 'text', required: true },
    { id: 'estado', label: 'Estado', type: 'switch', defaultValue: true }
  ];
  
  // Actualizar la edad cuando cambia la fecha de nacimiento
  useEffect(() => {
    if (selectedCliente && selectedCliente.fechaNacimiento) {
      const edadCalculada = calcularEdad(selectedCliente.fechaNacimiento);
      setSelectedCliente(prev => ({ ...prev, age: edadCalculada }));
    }
  }, [selectedCliente?.fechaNacimiento]);

  return (
    <>
      <GenericList
        data={clientes}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        title="Gestión de Clientes"
      />
      
      <DetailModal
        title={`Detalle del Cliente: ${selectedCliente?.nombre}`}
        data={selectedCliente}
        fields={detailFields}
        open={detailModalOpen}
        onClose={handleCloseDetail}
      />

      <FormModal
        title={isEditing ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
        fields={formFields}
        initialData={selectedCliente}
        open={formModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Clientes;