import React, { useState } from 'react';
import { GenericList } from '../../../shared/components/GenericList';
import { DetailModal } from '../../../shared/components/DetailModal';
import { FormModal } from '../../../shared/components/FormModal';
import { StatusButton } from '../../../shared/components/StatusButton';

const VentaCursos = () => {
  // Datos para los selectores
  const clientes = [
    { id: 'C001', nombre: 'Juan Pérez' },
    { id: 'C002', nombre: 'María Gómez' },
    { id: 'C003', nombre: 'Pedro López' },
    { id: 'C004', nombre: 'Laura Martínez' }
  ];

  const estudiantes = [
    { id: 'E001', nombre: 'Camilo Guilizzoni' },
    { id: 'E002', nombre: 'Carlos Rodríguez' },
    { id: 'E003', nombre: 'Ana Pérez' },
    { id: 'E004', nombre: 'Diego Martínez' }
  ];

  const cursosDisponibles = [
    { id: 'GC001', nombre: 'Guitarra Clásica Nivel 1' },
    { id: 'PI002', nombre: 'Piano Intermedio' },
    { id: 'VI003', nombre: 'Violín Avanzado' },
    { id: 'CA004', nombre: 'Canto Básico' }
  ];

  const ciclos = [
    { id: '4', nombre: '4' },
    { id: '8', nombre: '8' },
    { id: '12', nombre: '12' }
  ];

  const [cursos, setCursos] = useState([
    { 
      id: 'M001',
      cliente: 'Juan Pérez',
      estudiante: 'Camilo Guilizzoni',
      curso: 'Guitarra Clásica Nivel 1',
      ciclo: '4',
      clases: 4,
      valor: 250000,
      pagado: true
    },
    { 
      id: 'M002',
      cliente: 'María Gómez',
      estudiante: 'Carlos Rodríguez',
      curso: 'Piano Intermedio',
      ciclo: '8',
      clases: 8,
      valor: 300000,
      pagado: false
    },
    { 
      id: 'M003',
      cliente: 'Pedro López',
      estudiante: 'Ana Pérez',
      curso: 'Violín Avanzado',
      ciclo: '12',
      clases: 12,
      valor: 350000,
      pagado: true
    },
    { 
      id: 'M004',
      cliente: 'Laura Martínez',
      estudiante: 'Diego Martínez',
      curso: 'Canto Básico',
      ciclo: '4',
      clases: 4,
      valor: 200000,
      pagado: false
    }
  ]);

  const [selectedCurso, setSelectedCurso] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const handleCreate = () => {
    setIsEditing(false);
    setSelectedCurso(null);
    setFormModalOpen(true);
  };

  const handleEdit = (curso) => {
    setIsEditing(true);
    setSelectedCurso(curso);
    setFormModalOpen(true);
  };

  const handleDelete = (curso) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar el curso de ${curso.curso}?`);
    if (confirmDelete) {
      setCursos(prev => prev.filter(item => item.id !== curso.id));
    }
  };

  const handleView = (curso) => {
    setSelectedCurso(curso);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedCurso(null);
  };

  const handleCloseForm = () => {
    setFormModalOpen(false);
    setSelectedCurso(null);
    setIsEditing(false);
  };

  const handleSubmit = (formData) => {
    if (isEditing) {
      setCursos(prev => prev.map(item => {
        if (item.id === selectedCurso.id) {
          const newPagado = formData.pagado;
          return {
            ...item,
            pagado: newPagado
          };
        }
        return item;
      }));
    } else {
      const newId = `M${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;      
      formData.clases = parseInt(formData.clases);
      setCursos(prev => [...prev, { ...formData, id: newId }]);
    }
    handleCloseForm();
  };

  const handleToggleStatus = (cursoId) => {
    setCursos(prev => prev.map(item => {
      if (item.id === cursoId) {
        const newPagado = !item.pagado;
        return { 
          ...item, 
          pagado: newPagado
        };
      }
      return item;
    }));
  };

  const columns = [
    { id: 'id', label: 'ID' },
    { id: 'cliente', label: 'Cliente' },
    { id: 'estudiante', label: 'Estudiante' },
    { id: 'curso', label: 'Curso' },
    { id: 'ciclo', label: 'Ciclo' },
    { id: 'clases', label: 'Clases' },
    { id: 'valor', label: 'Valor', render: (value) => `$${value.toLocaleString()}` },
    { 
      id: 'pagado', 
      label: 'Estado de Pago',
      render: (value, row) => (
        <StatusButton 
          active={value} 
          activeText="PAGADO"
          inactiveText="DEBE"
          onClick={() => handleToggleStatus(row.id)}
          color={value ? 'success' : 'error'}
        />
      )
    }
  ];

  const detailFields = [
    { id: 'cliente', label: 'Cliente' },
    { id: 'estudiante', label: 'Estudiante' },
    { id: 'curso', label: 'Curso' },
    { id: 'ciclo', label: 'Ciclo' },
    { id: 'clases', label: 'Clases' },
    { id: 'valor', label: 'Valor', render: (value) => `$${value.toLocaleString()}` },
    { id: 'pagado', label: 'Estado de Pago', render: (value) => <StatusButton active={value} activeText="PAGADO" inactiveText="DEBE" color={value ? 'success' : 'error'} /> }
  ];

  const formFields = [
    { 
      id: 'cliente', 
      label: 'Cliente', 
      type: 'select', 
      required: true,
      options: clientes.map(c => ({ value: c.nombre, label: c.nombre }))
    },
    { 
      id: 'estudiante', 
      label: 'Estudiante', 
      type: 'select', 
      required: true,
      options: estudiantes.map(e => ({ value: e.nombre, label: e.nombre }))
    },
    { 
      id: 'curso', 
      label: 'Curso', 
      type: 'select', 
      required: true,
      options: cursosDisponibles.map(c => ({ value: c.nombre, label: c.nombre }))
    },
    { 
      id: 'ciclo', 
      label: 'Ciclo', 
      type: 'select', 
      required: true,
      options: ciclos.map(c => ({ value: c.id, label: c.id }))
    },
    { id: 'clases', label: 'Clases', type: 'number', required: true },
    { id: 'valor', label: 'Valor', type: 'number', required: true },
    { id: 'pagado', label: 'Estado de Pago', type: 'switch', defaultValue: false }
  ];

  return (
    <>
      <GenericList
        data={cursos}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        onCreate={handleCreate}
        title="Inscripcion de Cursos"
      />
      
      <DetailModal
        title={`Detalle del Curso: ${selectedCurso?.curso}`}
        data={selectedCurso}
        fields={detailFields}
        open={detailModalOpen}
        onClose={handleCloseDetail}
      />

      <FormModal
        title={isEditing ? 'Editar Estado de Pago' : 'Crear Nuevo Curso'}
        fields={isEditing ? [{ id: 'pagado', label: 'Estado de Pago', type: 'switch', defaultValue: false }] : formFields}
        initialData={selectedCurso}
        open={formModalOpen}
        onClose={handleCloseForm}
        onSubmit={handleSubmit}
      />
    </>
  );
};

export default VentaCursos;