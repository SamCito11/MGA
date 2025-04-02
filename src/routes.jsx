import { createBrowserRouter } from 'react-router-dom';
import { lazy } from 'react';
import App from './App';

// Lazy loading for route components
const Dashboard = lazy(() => import('./features/dashboard/pages/Dashboard'));
const Auth = lazy(() => import('./features/auth/pages/Auth'));
const Home = lazy(() => import('./Home'));

// Configuration routes
const Roles = lazy(() => import('./features/configuracion/pages/Roles'));
const Usuarios = lazy(() => import('./features/configuracion/pages/Usuarios'));
const Privilegios = lazy(() => import('./features/configuracion/pages/Privilegios'));

// Musical Services routes
const Profesores = lazy(() => import('./features/servicios-musicales/pages/Profesores'));
const ProgramacionProfesores = lazy(() => import('./features/servicios-musicales/pages/ProgramacionProfesores'));
const CursosMatriculas = lazy(() => import('./features/servicios-musicales/pages/CursosMatriculas'));
const Aulas = lazy(() => import('./features/servicios-musicales/pages/Aulas'));
const Clases = lazy(() => import('./features/servicios-musicales/pages/Clases'));

// Sales Services routes
const Clientes = lazy(() => import('./features/venta-servicios/pages/Clientes'));
const Estudiantes = lazy(() => import('./features/venta-servicios/pages/Estudiantes'));
const VentaMatriculas = lazy(() => import('./features/venta-servicios/pages/VentaMatriculas'));
const VentaCursos = lazy(() => import('./features/venta-servicios/pages/VentaCursos'));
const Pagos = lazy(() => import('./features/venta-servicios/pages/Pagos'));
const ProgramacionClases = lazy(() => import('./features/venta-servicios/pages/ProgramacionClases'));
const Asistencia = lazy(() => import('./features/venta-servicios/pages/Asistencia'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />
      },
      {
        path: 'dashboard',
        element: <Dashboard />
      },
      {
        path: 'auth',
        element: <Auth />
      },
      // Configuration routes
      {
        path: 'configuracion',
        children: [
          {
            path: 'roles',
            element: <Roles />
          },
          {
            path: 'usuarios',
            element: <Usuarios />
          },
          {
            path: 'privilegios',
            element: <Privilegios />
          }
        ]
      },
      // Musical Services routes
      {
        path: 'servicios-musicales',
        children: [
          {
            path: 'profesores',
            element: <Profesores />
          },
          {
            path: 'programacion-profesores',
            element: <ProgramacionProfesores />
          },
          {
            path: 'cursos-matriculas',
            element: <CursosMatriculas />
          },
          {
            path: 'aulas',
            element: <Aulas />
          },
          {
            path: 'clases',
            element: <Clases />
          }
        ]
      },
      // Sales Services routes
      {
        path: 'venta-servicios',
        children: [
          {
            path: 'clientes',
            element: <Clientes />
          },
          {
            path: 'estudiantes',
            element: <Estudiantes />
          },
          {
            path: 'venta-matriculas',
            element: <VentaMatriculas />
          },
          {
            path: 'venta-cursos',
            element: <VentaCursos />
          },
          {
            path: 'pagos',
            element: <Pagos />
          },
          {
            path: 'programacion-clases',
            element: <ProgramacionClases />
          },
          {
            path: 'asistencia',
            element: <Asistencia />
          }
        ]
      }
    ]
  }
]);

export default router;