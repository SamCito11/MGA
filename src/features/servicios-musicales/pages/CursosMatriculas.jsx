import { useState } from 'react';
import { 
  Box, 
  Tabs, 
  Tab, 
  Typography, 
  Paper
} from '@mui/material';
import { GenericList } from '../../../shared/components/GenericList';
import { DetailModal } from '../../../shared/components/DetailModal';
import { FormModal } from '../../../shared/components/FormModal';
import { StatusButton } from '../../../shared/components/StatusButton';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`tabpanel-${index}`}
      aria-labelledby={`tab-${index}`}
      {...other}
      style={{ height: 'calc(100% - 48px)' }}
    >
      {value === index && (
        <Box sx={{ height: '100%' }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const CursosMatriculas = () => {
  const [tabValue, setTabValue] = useState(0);

  // Cursos state
  const [cursos, setCursos] = useState([
    { 
      id: 'GC001', 
      nombre: 'Guitarra Clásica Nivel 1', 
      descripcion: 'Curso básico de guitarra clásica', 
      profesor: 'Juan Pérez',
      duracion: '3 meses',
      capacidad: 15,
      precio: 250000,
      numeroDeClases: 24,
      estado: true 
    },
    { 
      id: 'PI002', 
      nombre: 'Piano Intermedio', 
      descripcion: 'Técnicas intermedias de piano', 
      profesor: 'Maria Gómez',
      duracion: '4 meses',
      capacidad: 10,
      precio: 300000,
      numeroDeClases: 32,
      estado: true 
    },
    { 
      id: 'VI003', 
      nombre: 'Violín Avanzado', 
      descripcion: 'Perfeccionamiento de técnicas de violín', 
      profesor: 'Carlos Sánchez',
      duracion: '6 meses',
      capacidad: 8,
      precio: 350000,
      numeroDeClases: 48,
      estado: true 
    },
    { 
      id: 'CA004', 
      nombre: 'Canto Básico', 
      descripcion: 'Introducción a técnicas vocales', 
      profesor: 'Laura Méndez',
      duracion: '2 meses',
      capacidad: 12,
      precio: 200000,
      numeroDeClases: 16,
      estado: true 
    }
  ]);
  const [selectedCurso, setSelectedCurso] = useState(null);
  const [cursoDetailOpen, setCursoDetailOpen] = useState(false);
  const [cursoFormOpen, setCursoFormOpen] = useState(false);
  const [isEditingCurso, setIsEditingCurso] = useState(false);

  // Matriculas state
  const [matriculas, setMatriculas] = useState([
    { 
      id: 'M001',
      nombre: 'Matrícula Guitarra - Camilo',
      estudiante: 'Camilo Guilizzoni',
      curso: 'Guitarra Clásica Nivel 1',
      fecha_inicio: '01/03/2024',
      fecha_fin: '01/06/2024',
      valor: 250000,
      pagado: true,
      estado: true 
    },
    { 
      id: 'M002',
      nombre: 'Matrícula Piano - Carlos',
      estudiante: 'Carlos Rodríguez',
      curso: 'Piano Intermedio',
      fecha_inicio: '15/02/2024',
      fecha_fin: '15/06/2024',
      valor: 300000,
      pagado: false,
      estado: true 
    },
    { 
      id: 'M003',
      nombre: 'Matrícula Violín - Ana',
      estudiante: 'Ana Pérez',
      curso: 'Violín Avanzado',
      fecha_inicio: '10/01/2024',
      fecha_fin: '10/07/2024',
      valor: 350000,
      pagado: true,
      estado: true 
    },
    { 
      id: 'M004',
      nombre: 'Matrícula Canto - Diego',
      estudiante: 'Diego Martínez',
      curso: 'Canto Básico',
      fecha_inicio: '05/04/2024',
      fecha_fin: '05/06/2024',
      valor: 200000,
      pagado: false,
      estado: true 
    }
  ]);
  const [selectedMatricula, setSelectedMatricula] = useState(null);
  const [matriculaDetailOpen, setMatriculaDetailOpen] = useState(false);
  const [matriculaFormOpen, setMatriculaFormOpen] = useState(false);
  const [isEditingMatricula, setIsEditingMatricula] = useState(false);

  // Tab handling
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Cursos handlers
  const handleCreateCurso = () => {
    setIsEditingCurso(false);
    setSelectedCurso(null);
    setCursoFormOpen(true);
  };

  const handleEditCurso = (curso) => {
    setIsEditingCurso(true);
    setSelectedCurso(curso);
    setCursoFormOpen(true);
  };

  const handleDeleteCurso = (curso) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar el curso ${curso.nombre}?`);
    if (confirmDelete) {
      setCursos(prev => prev.filter(item => item.id !== curso.id));
    }
  };

  const handleViewCurso = (curso) => {
    setSelectedCurso(curso);
    setCursoDetailOpen(true);
  };

  const handleCloseCursoDetail = () => {
    setCursoDetailOpen(false);
    setSelectedCurso(null);
  };

  const handleCloseCursoForm = () => {
    setCursoFormOpen(false);
    setSelectedCurso(null);
    setIsEditingCurso(false);
  };

  const handleSubmitCurso = (formData) => {
    if (isEditingCurso) {
      setCursos(prev => prev.map(item => 
        item.id === selectedCurso.id ? { ...formData, id: item.id } : item
      ));
    } else {
      // Generate a new ID for new courses
      const prefix = formData.nombre.substring(0, 2).toUpperCase();
      const newId = `${prefix}${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setCursos(prev => [...prev, { ...formData, id: newId }]);
    }
    handleCloseCursoForm();
  };

  const handleToggleCursoStatus = (cursoId) => {
    setCursos(prev => prev.map(item => 
      item.id === cursoId ? { ...item, estado: !item.estado } : item
    ));
  };

  // Matriculas handlers
  const handleCreateMatricula = () => {
    setIsEditingMatricula(false);
    setSelectedMatricula(null);
    setMatriculaFormOpen(true);
  };

  const handleEditMatricula = (matricula) => {
    setIsEditingMatricula(true);
    setSelectedMatricula(matricula);
    setMatriculaFormOpen(true);
  };

  const handleDeleteMatricula = (matricula) => {
    const confirmDelete = window.confirm(`¿Está seguro de eliminar la matrícula ${matricula.id}?`);
    if (confirmDelete) {
      setMatriculas(prev => prev.filter(item => item.id !== matricula.id));
    }
  };

  const handleViewMatricula = (matricula) => {
    setSelectedMatricula(matricula);
    setMatriculaDetailOpen(true);
  };

  const handleCloseMatriculaDetail = () => {
    setMatriculaDetailOpen(false);
    setSelectedMatricula(null);
  };

  const handleCloseMatriculaForm = () => {
    setMatriculaFormOpen(false);
    setSelectedMatricula(null);
    setIsEditingMatricula(false);
  };

  const handleSubmitMatricula = (formData) => {
    if (isEditingMatricula) {
      setMatriculas(prev => prev.map(item => 
        item.id === selectedMatricula.id ? { ...formData, id: item.id } : item
      ));
    } else {
      // Generate a new ID for new matriculas
      const newId = `M${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`;
      setMatriculas(prev => [...prev, { ...formData, id: newId }]);
    }
    handleCloseMatriculaForm();
  };

  const handleToggleMatriculaStatus = (matriculaId) => {
    setMatriculas(prev => prev.map(item => 
      item.id === matriculaId ? { ...item, estado: !item.estado } : item
    ));
  };

  // Cursos columns and fields
  const cursosColumns = [
    { id: 'nombre', label: 'Nombre Curso' },
    { id: 'descripcion', label: 'Información' },
    { id: 'capacidad', label: 'Capacidad' },
    { id: 'numeroDeClases', label: 'Número de Clases' },
    { id: 'precio', label: 'Precio', render: (value) => `$${value.toLocaleString()}` },
    { 
      id: 'estado', 
      label: 'Estado',
      render: (value, row) => (
        <StatusButton 
          active={value} 
          onClick={() => handleToggleCursoStatus(row.id)}
        />
      )
    }
  ];

  const cursosDetailFields = [
    { id: 'id', label: 'Código' },
    { id: 'nombre', label: 'Nombre' },
    { id: 'descripcion', label: 'Descripción' },
    { id: 'profesor', label: 'Profesor' },
    { id: 'duracion', label: 'Duración' },
    { id: 'numeroDeClases', label: 'Número de Clases' },
    { id: 'precio', label: 'Precio', render: (value) => `$${value.toLocaleString()}` },
    { id: 'estado', label: 'Estado', render: (value) => <StatusButton active={value} /> }
  ];

  const cursosFormFields = [
    { 
      id: 'nombre', 
      label: 'Nombre Curso', 
      type: 'text',
      required: true
    },
    { 
      id: 'descripcion', 
      label: 'Información', 
      type: 'text',
      required: true
    },
    { 
      id: 'capacidad', 
      label: 'Capacidad', 
      type: 'number',
      required: true,
      min: 1
    },
    { 
      id: 'numeroDeClases', 
      label: 'Número de Clases', 
      type: 'number',
      required: true,
      min: 1
    },
    { 
      id: 'precio', 
      label: 'Precio', 
      type: 'number',
      required: true,
      min: 0
    },
    { 
      id: 'estado', 
      label: 'Estado', 
      type: 'switch',
      defaultValue: true
    }
  ];

  // Matriculas columns and fields
  const matriculasColumns = [
    { id: 'nombre', label: 'Nombre Matrícula' },
    { id: 'valor', label: 'Valor', render: (value) => `$${value.toLocaleString()}` },
    { 
      id: 'estado', 
      label: 'Estado',
      render: (value, row) => (
        <StatusButton 
          active={value} 
          onClick={() => handleToggleMatriculaStatus(row.id)}
        />
      )
    }
  ];

  const matriculasDetailFields = [
    { id: 'id', label: 'Código' },
    { id: 'estudiante', label: 'Estudiante' },
    { id: 'curso', label: 'Curso' },
    { id: 'fecha_inicio', label: 'Fecha Inicio' },
    { id: 'fecha_fin', label: 'Fecha Fin' },
    { id: 'valor', label: 'Valor', render: (value) => `$${value.toLocaleString()}` },
    { id: 'pagado', label: 'Pagado', render: (value) => value ? 'Sí' : 'No' },
    { id: 'estado', label: 'Estado', render: (value) => <StatusButton active={value} /> }
  ];

  const matriculasFormFields = [
    { 
      id: 'nombre', 
      label: 'Nombre Matrícula', 
      type: 'text',
      required: true
    },
    { 
      id: 'valor', 
      label: 'Valor', 
      type: 'number',
      required: true,
      min: 0
    },
    { 
      id: 'estado', 
      label: 'Estado', 
      type: 'switch',
      defaultValue: true
    }
  ];

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column' }}>
      <Paper sx={{ borderBottom: 0, borderColor: 'transparent', mb: 2, boxShadow: 'none', backgroundColor: 'transparent' }}>
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            variant="standard"
            sx={{ 
              '& .MuiTab-root': { 
                fontWeight: 'bold',
                fontSize: '0.9rem',
                color: '#555',
                textTransform: 'uppercase',
                minWidth: '120px',
                minHeight: '36px',
                padding: '6px 12px',
                marginRight: '8px',
                marginTop: '8px',
                marginBottom: '8px',
                borderRadius: '4px',
                transition: 'all 0.3s ease',
                border: '1px solid #ddd',
                backgroundColor: 'transparent'
              },
              '& .Mui-selected': {
                color: '#fff !important',
                backgroundColor: '#0455a2',
                boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            <Tab 
              label="Cursos" 
              id="tab-0" 
              aria-controls="tabpanel-0" 
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(4, 85, 162, 0.05)'
                }
              }}
            />
            <Tab 
              label="Matrículas" 
              id="tab-1" 
              aria-controls="tabpanel-1" 
              sx={{ 
                '&:hover': {
                  backgroundColor: 'rgba(4, 85, 162, 0.05)'
                }
              }}
            />
          </Tabs>
        </Paper>

      <TabPanel value={tabValue} index={0}>
        <GenericList
          data={cursos}
          columns={cursosColumns}
          onEdit={handleEditCurso}
          onDelete={handleDeleteCurso}
          onCreate={handleCreateCurso}
          onView={handleViewCurso}
          title="Gestión de Cursos"
        />
        
        <DetailModal
          title={`Detalle del Curso: ${selectedCurso?.nombre}`}
          data={selectedCurso}
          fields={cursosDetailFields}
          open={cursoDetailOpen}
          onClose={handleCloseCursoDetail}
        />

        <FormModal
          title={isEditingCurso ? 'Editar Curso' : 'Crear Nuevo Curso'}
          fields={cursosFormFields}
          initialData={selectedCurso}
          open={cursoFormOpen}
          onClose={handleCloseCursoForm}
          onSubmit={handleSubmitCurso}
        />
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <GenericList
          data={matriculas}
          columns={matriculasColumns}
          onEdit={handleEditMatricula}
          onDelete={handleDeleteMatricula}
          onCreate={handleCreateMatricula}
          onView={handleViewMatricula}
          title="Gestión de Matrículas"
        />
        
        <DetailModal
          title={`Detalle de Matrícula: ${selectedMatricula?.id}`}
          data={selectedMatricula}
          fields={matriculasDetailFields}
          open={matriculaDetailOpen}
          onClose={handleCloseMatriculaDetail}
        />

        <FormModal
          title={isEditingMatricula ? 'Editar Matrícula' : 'Crear Nueva Matrícula'}
          fields={matriculasFormFields}
          initialData={selectedMatricula}
          open={matriculaFormOpen}
          onClose={handleCloseMatriculaForm}
          onSubmit={handleSubmitMatricula}
        />
      </TabPanel>
    </Box>
  );
};

export default CursosMatriculas;