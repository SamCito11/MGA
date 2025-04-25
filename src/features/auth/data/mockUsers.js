export const mockUsers = [
  {
    id: 1,
    name: 'Administrador',
    email: 'admin@teacuerdas.com',
    password: 'admin123',
    role: 'admin',
    permissions: [
      'dashboard',
      'configuracion-roles',
      'configuracion-usuarios',
      'servicios-musicales-profesores',
      'servicios-musicales-programacion-profesores',
      'servicios-musicales-programacion-clases',
      'servicios-musicales-cursos-matriculas',
      'servicios-musicales-aulas',
      'servicios-musicales-clases',
      'venta-servicios-clientes',
      'venta-servicios-estudiantes',
      'venta-servicios-venta-matriculas',
      'venta-servicios-venta-cursos',
      'venta-servicios-pagos',
      'venta-servicios-asistencia'
    ],
    avatar: null
  },
  {
    id: 2,
    name: 'Profesor Demo',
    email: 'profesor@teacuerdas.com',
    password: 'profesor123',
    role: 'teacher',
    permissions: [
      'servicios-musicales-programacion-profesores',
      'servicios-musicales-programacion-clases',
      'venta-servicios-asistencia'
    ],
    avatar: null
  },
  {
    id: 3,
    name: 'Estudiante Demo',
    email: 'estudiante@teacuerdas.com',
    password: 'estudiante123',
    role: 'student',
    permissions: [
      'servicios-musicales-programacion-clases',
      'venta-servicios-asistencia',
      'venta-servicios-pagos'
    ],
    avatar: null
  }
];