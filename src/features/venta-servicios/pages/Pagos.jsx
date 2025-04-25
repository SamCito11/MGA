import { useState, useEffect } from 'react';
import { GenericList } from '../../../shared/components/GenericList';
import { DetailModal } from '../../../shared/components/DetailModal';
import { FormModal } from '../../../shared/components/FormModal';
import { StatusButton } from '../../../shared/components/StatusButton';
import { PictureAsPdf as PdfIcon } from '@mui/icons-material';
import { Box, Typography, Grid } from '@mui/material';
import * as XLSX from 'xlsx';

const Pagos = () => {
  const [payments, setPayments] = useState([
    { 
      id: 1, 
      cliente: 'Giacomo Guilizzoni', 
      estudiante: 'Camilo Guilizzoni',
      matriculas: [
        {
          valor: 50000,
          fecha: '2024-01-15'
        },
        {
          valor: 48000,
          fecha: '2023-09-10'
        }
      ],
      estado: true,
      historial: [
        {
          curso: 'Guitarra',
          precio_curso: 250000,
          clases_totales: 16,
          clases_tomadas: 16,
          fecha_inicio: '2024-01-15'
        },
        {
          curso: 'Piano',
          precio_curso: 300000,
          clases_totales: 12,
          clases_tomadas: 8,
          fecha_inicio: '2023-09-10'
        },
        {
          curso: 'Batería',
          precio_curso: 280000,
          clases_totales: 16,
          clases_tomadas: 2,
          fecha_inicio: '2024-03-01'
        }
      ]
    },
    { 
      id: 2, 
      cliente: 'María Rodríguez', 
      estudiante: 'Carlos Rodríguez',
      matriculas: [
        {
          valor: 60000,
          fecha: '2024-02-01'
        },
        {
          valor: 55000,
          fecha: '2024-01-15'
        }
      ],
      estado: true,
      historial: [
        {
          curso: 'Piano',
          precio_curso: 300000,
          clases_totales: 16,
          clases_tomadas: 6,
          fecha_inicio: '2024-02-01'
        },
        {
          curso: 'Violín',
          precio_curso: 280000,
          clases_totales: 12,
          clases_tomadas: 4,
          fecha_inicio: '2024-01-15'
        },
        {
          curso: 'Flauta Traversa',
          precio_curso: 260000,
          clases_totales: 16,
          clases_tomadas: 3,
          fecha_inicio: '2024-03-01'
        }
      ]
    },
    { 
      id: 3, 
      cliente: 'Juan Pérez', 
      estudiante: 'Ana Pérez',
      matricula: 55000,
      estado: true,
      historial: [
        {
          curso: 'Violín',
          precio_curso: 280000,
          clases_totales: 16,
          clases_tomadas: 5,
          fecha_inicio: '2024-01-20'
        },
        {
          curso: 'Canto',
          precio_curso: 320000,
          clases_totales: 12,
          clases_tomadas: 6,
          fecha_inicio: '2024-02-15'
        },
        {
          curso: 'Piano',
          precio_curso: 300000,
          clases_totales: 16,
          clases_tomadas: 2,
          fecha_inicio: '2024-03-10'
        }
      ]
    },
    { 
      id: 4, 
      cliente: 'Laura Martínez', 
      estudiante: 'Diego Martínez',
      matricula: 45000,
      debes: 150000,
      estado: true,
      historial: [
        {
          curso: 'Batería',
          precio_curso: 220000,
          clases_totales: 12,
          clases_tomadas: 3,
          fecha_inicio: '2024-02-15'
        },
        {
          curso: 'Percusión',
          precio_curso: 180000,
          clases_totales: 8,
          clases_tomadas: 2,
          fecha_inicio: '2024-03-01'
        },
        {
          curso: 'Guitarra Eléctrica',
          precio_curso: 250000,
          clases_totales: 16,
          clases_tomadas: 4,
          fecha_inicio: '2024-01-20'
        }
      ]
    },
    { 
      id: 5, 
      cliente: 'Roberto Sánchez', 
      estudiante: 'Elena Sánchez',
      matricula: 55000,
      debes: 200000,
      estado: true,
      historial: [
        {
          curso: 'Saxofón',
          precio_curso: 350000,
          clases_totales: 16,
          clases_tomadas: 7,
          fecha_inicio: '2024-01-10'
        },
        {
          curso: 'Clarinete',
          precio_curso: 280000,
          clases_totales: 12,
          clases_tomadas: 5,
          fecha_inicio: '2024-02-01'
        },
        {
          curso: 'Flauta Traversa',
          precio_curso: 260000,
          clases_totales: 12,
          clases_tomadas: 3,
          fecha_inicio: '2024-03-15'
        }
      ]
    },
   
  ]);

  const [selectedPayment, setSelectedPayment] = useState(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const handleView = (payment) => {
    setSelectedPayment(payment);
    setDetailModalOpen(true);
  };

  const handleCloseDetail = () => {
    setDetailModalOpen(false);
    setSelectedPayment(null);
  };

  // Update columns to remove estado
  const columns = [
    { id: 'cliente', label: 'Cliente' },
    { id: 'estudiante', label: 'Estudiante' },
    { id: 'valor_total', label: 'Valor Total', render: (value) => `$${value.toLocaleString()}` }
  ];

  // Update detailFields to match the new layout
  const detailFields = [
    { id: 'cliente', label: 'Cliente' },
    { id: 'estudiante', label: 'Estudiante' },
    { 
      id: 'historial', 
      render: (value, data) => {
        // Handle both matricula formats
        const matriculasArray = data.matriculas 
          ? data.matriculas 
          : data.matricula 
            ? [{ valor: data.matricula, fecha: value?.[0]?.fecha_inicio || new Date().toISOString().split('T')[0] }]
            : [];

        // Combine matriculas and courses into a single array
        const allEntries = [
          ...matriculasArray.map(m => ({
            fecha: m.fecha,
            tipo: 'Matric',
            concepto: 'Matrícula',
            valor: m.valor
          })),
          ...(value?.map(item => ({
            fecha: item.fecha_inicio,
            tipo: 'Curso',
            concepto: item.curso,
            valor: item.precio_curso
          })) || [])
        ];

        // Calculate total value
        const totalValue = allEntries.reduce((sum, entry) => sum + entry.valor, 0);

        // Sort and group by year
        allEntries.sort((a, b) => {
          const dateA = new Date(a.fecha);
          const dateB = new Date(b.fecha);
          return dateB - dateA;
        });

        const entriesByYear = allEntries.reduce((acc, entry) => {
          const year = new Date(entry.fecha).getFullYear();
          if (!acc[year]) acc[year] = [];
          
          // Validate only one matricula per year
          if (entry.tipo === 'Matric') {
            const hasMatricula = acc[year].some(e => e.tipo === 'Matric');
            if (hasMatricula) return acc;
          }
          
          acc[year].push(entry);
          return acc;
        }, {});

        return (
          <Box sx={{ 
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
            margin: 0 // Eliminar cualquier margen
          }}>
            <Typography 
              variant="h5" 
              sx={{ 
                textAlign: 'left', // Cambiar a alineación izquierda
                mb: 3,
                color: '#0455a2',
                fontWeight: 500,
                pl: 0 // Sin padding a la izquierda
              }}
            >
              Detalle del Pago
            </Typography>

            <table style={{ 
              width: '100%', 
              borderCollapse: 'collapse',
              backgroundColor: 'white',
              marginLeft: 0,
              marginRight: 0
            }}>
              <thead>
                <tr>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', // Cambiar a alineación izquierda
                    borderBottom: '2px solid #eee',
                    color: '#666'
                  }}>Fecha</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', // Cambiar a alineación izquierda
                    borderBottom: '2px solid #eee',
                    color: '#666'
                  }}>Tipo</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', // Cambiar a alineación izquierda
                    borderBottom: '2px solid #eee',
                    color: '#666'
                  }}>Concepto</th>
                  <th style={{ 
                    padding: '16px', 
                    textAlign: 'left', // Cambiar a alineación izquierda
                    borderBottom: '2px solid #eee',
                    color: '#666',
                    width: '20%'
                  }}>Valor</th>
                </tr>
              </thead>
              <tbody>
                {allEntries.map((entry, idx) => (
                  <tr key={idx} style={{
                    backgroundColor: idx % 2 === 0 ? '#f9f9f9' : 'white'
                  }}>
                    <td style={{ padding: '16px', textAlign: 'left' }}>{entry.fecha}</td>
                    <td style={{ padding: '16px', textAlign: 'left' }}>{entry.tipo}</td>
                    <td style={{ padding: '16px', textAlign: 'left' }}>{entry.concepto}</td>
                    <td style={{ padding: '16px', textAlign: 'left' }}>${entry.valor.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Box sx={{ 
              mt: 3,
              p: 2,
              borderTop: '1px solid #eee',
              display: 'flex',
              justifyContent: 'flex-start' // Cambiar a alineación izquierda
            }}>
              <Typography variant="h6" sx={{ color: '#0455a2' }}>
                Valor Total: ${totalValue.toLocaleString()}
              </Typography>
            </Box>
          </Box>
        );
      }
    }
  ];

  const handleExportExcel = () => {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();

    // Prepare the data
    const worksheetData = [
      ['Cliente', 'Estudiante', 'Debe'], // Header row
      ...payments.map(payment => [
        payment.cliente,
        payment.estudiante,
        payment.debes
      ])
    ];

    // Create a worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);

    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Pagos');

    // Write the file
    XLSX.writeFile(workbook, 'pagos.xlsx');
  };

  return (
    <>
      <GenericList
        data={payments.map(p => ({
          ...p,
          valor_total: (p.historial?.reduce((sum, item) => sum + item.precio_curso, 0) || 0) + 
                      (p.matriculas 
                        ? p.matriculas.reduce((sum, m) => sum + m.valor, 0) 
                        : p.matricula || 0)
        }))}
        columns={columns}
        onView={handleView}
        onExportPdf={handleExportExcel}
        title="Gestión de Pagos"
      />
      
      <DetailModal
        title={`Detalle del Pago: ${selectedPayment?.id}`}
        data={selectedPayment}
        fields={detailFields}
        open={detailModalOpen}
        onClose={handleCloseDetail}
        maxWidth="md"
        fullWidth
      />
    </>
  );
};

export default Pagos;