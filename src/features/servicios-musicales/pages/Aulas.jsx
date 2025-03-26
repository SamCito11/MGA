import { useState } from 'react';
import { GenericList } from '../../../shared/components/GenericList';
import { DetailModal } from '../../../shared/components/DetailModal';
import { StatusButton } from '../../../shared/components/StatusButton';
import { FormModal } from '../../../shared/components/FormModal';

const Aulas = () => {
  const [aulas, setAulas] = useState([
    { id: 'A01', capacidad: 5, estado: true, ubicacion: 'Edificio Principal, Planta Baja' },
    { id: 'A02', capacidad: 8, estado: true, ubicacion: 'Edificio Principal, Primer Piso' },
    { id: 'A03', capacidad: 3, estado: true, ubicacion: 'Ala de Ciencias, Planta Baja' },
    { id: 'A04', capacidad: 5, estado: true, ubicacion: 'Edificio Principal, Segundo Piso' },
    { id: 'A05', capacidad: 4, estado: true, ubicacion: 'Edificio de Artes, Planta Baja' },
    { id: 'A06', capacidad: 3, estado: true, ubicacion: 'Edificio Principal, Primer Piso' },
    { id: 'A07', capacidad: 6, estado: true, ubicacion: 'Ala de Tecnología, Segundo Piso' },
    { id: 'A08', capacidad: 7, estado: true, ubicacion: 'Edificio Principal, Tercer Piso' },
    { id: 'A09', capacidad: 4, estado: true, ubicacion: 'Edificio de Idiomas, Planta Baja' },
    { id: 'A10', capacidad: 5, estado: true, ubicacion: 'Edificio Principal, Primer Piso' },
  ]);

  const [selectedAula, setSelectedAula] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const detailFields = [
    { id: 'id', label: 'Número de Aula' },
    { id: 'capacidad', label: 'Capacidad', render: (value) => `${value} estudiantes` },
    { id: 'ubicacion', label: 'Ubicación' },
    { id: 'estado', label: 'Estado', render: (value) => <StatusButton active={value} /> }
  ];

  const formFields = [
    { 
      id: 'id', 
      label: 'Número de Aula', 
      type: 'text',
      required: true,
      disabled: isEditing
    },
    { 
      id: 'capacidad', 
      label: 'Capacidad', 
      type: 'number',
      required: true,
      min: 1
    },
    { 
      id: 'ubicacion', 
      label: 'Ubicación', 
      type: 'text',
      required: true
    },
    { 
      id: 'estado', 
      label: 'Estado', 
      type: 'switch',
      defaultValue: true
    }
  ];

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedAula(null);
    setFormModalOpen(true);
  };

  const handleEdit = (aula) => {
    setIsEditing(true);
    setSelectedAula(aula);
    setFormModalOpen(true);
  };

  const handleDelete = (aula) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar el aula ${aula.id}?`);
    if (confirmDelete) {
      setAulas(prev => prev.filter(item => item.id !== aula.id));
    }
  };

  const handleView = (aula) => {
    setSelectedAula(aula);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedAula(null);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setSelectedAula(null);
    setIsEditing(false);
  };

  const handleSubmit = (formData) => {
    if (isEditing) {
      setAulas(prev => prev.map(item => 
        item.id === selectedAula.id ? { ...formData } : item
      ));
    } else {
      setAulas(prev => [...prev, formData]);
    }
    handleCloseForm();
  };

  const handleToggleStatus = (aulaId) => {
    setAulas(prev => prev.map(item => 
      item.id === aulaId ? { ...item, estado: !item.estado } : item
    ));
  };

  const columns = [
    { id: 'id', label: 'Número de Aula' },
    { id: 'capacidad', label: 'Capacidad', render: (value) => `${value} estudiantes` },
    { id: 'ubicacion', label: 'Ubicación' },
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

  return (
    <>
      <GenericList
        data={aulas}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        onView={handleView}
        title="Gestión de Aulas"
      />
      
      <DetailModal
        title={`Detalle del Aula ${selectedAula?.id}`}
        data={selectedAula}
        fields={detailFields}
        open={detailModalOpen}
        onClose={handleCloseDetail}
      />

      <FormModal
        title={isEditing ? 'Editar Aula' : 'Crear Nueva Aula'}
        fields={formFields}
        initialData={selectedAula}
        open={formModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default Aulas;