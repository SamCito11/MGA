import { useState, useContext } from 'react';
import { ThemeContext } from "../contexts/ThemeContext";
import { 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  IconButton, 
  Button,
  Box, 
  Typography,
  InputBase,
  Stack,
  Select,
  MenuItem,
  FormControl,
  Avatar
} from '@mui/material';
import { 
  Edit as EditIcon, 
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Search as SearchIcon,
  NavigateBefore as PreviousIcon,
  NavigateNext as NextIcon,
  KeyboardArrowDown as ArrowDownIcon
} from '@mui/icons-material';

export const GenericList = ({
  data,
  columns,
  onEdit,
  onDelete,
  onCreate,
  onView,
  title,
  pagination
}) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState('');
  const { darkMode } = useContext(ThemeContext);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter data based on search term
  const filteredData = searchTerm 
    ? data.filter(row => 
        columns.some(column => 
          String(row[column.id]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    : data;

  const paginatedData = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  // Calculate total pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);
  const pageNumbers = [];
  for (let i = 0; i < totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <Box sx={{ 
      p: 2, 
      height: 'auto', 
      width: '100%', 
      backgroundColor: darkMode ? '#1e1e1e' : '#ffffff',
      color: darkMode ? '#ffffff' : '#333333',
      borderRadius: 2,
      boxShadow: 'none',
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif'
    }}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mb: 2
      }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontSize: '1rem',
            fontWeight: '600',
            color: darkMode ? '#ffffff' : '#333',
            fontFamily: '"Inter", sans-serif'
          }}
        >
          {title}
        </Typography>
        <Box sx={{ 
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Paper
            component="form"
            sx={{ 
              p: '2px 8px', 
              display: 'flex', 
              alignItems: 'center', 
              width: 240,
              border: darkMode ? '1px solid rgba(255, 255, 255, 0.12)' : '1px solid #e0e0e0',
              borderRadius: 2,
              boxShadow: 'none',
              backgroundColor: darkMode ? '#2d2d2d' : '#ffffff',
            }}
          >
            <SearchIcon sx={{ color: darkMode ? '#aaaaaa' : '#9e9e9e', fontSize: '1.2rem' }} />
            <InputBase
              sx={{ 
                ml: 1, 
                flex: 1, 
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                color: darkMode ? '#ffffff' : 'inherit'
              }}
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>
          {onCreate && (
            <Button
              variant="contained"
              onClick={onCreate}
              sx={{
                backgroundColor: '#0455a2',
                color: 'white',
                textTransform: 'none',
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.875rem',
                fontWeight: 500,
                px: 2,
                py: 0.75,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: '#034089'
                }
              }}
            >
              Crear nuevo
            </Button>
          )}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Typography 
          variant="body2" 
          sx={{ 
            mr: 1, 
            color: '#666',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.875rem'
          }}
        >
          Show
        </Typography>
        <FormControl size="small">
          <Select
            value={rowsPerPage}
            onChange={handleChangeRowsPerPage}
            IconComponent={ArrowDownIcon}
            sx={{ 
              minWidth: 60,
              height: 32,
              fontFamily: '"Inter", sans-serif',
              fontSize: '0.875rem',
              '& .MuiSelect-select': {
                py: 0.5,
                pl: 1.5
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: '#e0e0e0'
              }
            }}
          >
            <MenuItem value={5}>5</MenuItem>
            <MenuItem value={10}>10</MenuItem>
            <MenuItem value={25}>25</MenuItem>
            <MenuItem value={50}>50</MenuItem>
          </Select>
        </FormControl>
        <Typography 
          variant="body2" 
          sx={{ 
            ml: 1, 
            color: '#666',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.875rem'
          }}
        >
          entries
        </Typography>
      </Box>

      <TableContainer 
        sx={{ 
          boxShadow: 'none',
          border: 'none',
          maxHeight: 'none',
          overflow: 'visible',
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell 
                  key={column.id}
                  align="left"
                  sx={{ 
                    fontWeight: '600',
                    backgroundColor: darkMode ? '#2d2d2d' : 'white',
                    color: darkMode ? '#ffffff' : '#333',
                    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0',
                    py: 1.5,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.875rem'
                  }}
                >
                  {column.label}
                </TableCell>
              ))}
              {(onEdit || onDelete || onView) && (
                <TableCell 
                  align="right"
                  sx={{ 
                    fontWeight: '600',
                    backgroundColor: darkMode ? '#2d2d2d' : 'white',
                    color: darkMode ? '#ffffff' : '#333',
                    borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0',
                    py: 1.5,
                    fontFamily: '"Inter", sans-serif',
                    fontSize: '0.875rem'
                  }}
                >
                  Acciones
                </TableCell>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow 
                key={row.id}
                hover
                sx={{
                  borderBottom: darkMode ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid #e0e0e0',
                  '&:hover': {
                    backgroundColor: darkMode ? 'rgba(255, 255, 255, 0.05) !important' : 'rgba(0, 0, 0, 0.02) !important',
                  }
                }}
              >
                {columns.map((column, index) => (
                  <TableCell 
                    key={`${row.id}-${column.id}`}
                    align="left"
                    sx={{ 
                      color: column.id === 'office' || column.id === 'location' 
                        ? (darkMode ? '#90caf9' : '#3366ff') 
                        : (darkMode ? '#ffffff' : '#333'),
                      borderBottom: 'none',
                      py: 1.5,
                      fontFamily: '"Inter", sans-serif',
                      fontSize: '0.875rem',
                      fontWeight: column.id === 'office' || column.id === 'location' ? '500' : '400'
                    }}
                  >
                    {index === 0 && row.avatar ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                        <Avatar 
                          src={row.avatar} 
                          alt={row[column.id]} 
                          sx={{ width: 36, height: 36 }}
                        />
                        {column.render ? column.render(row[column.id], row) : row[column.id]}
                      </Box>
                    ) : (
                      column.render ? column.render(row[column.id], row) : row[column.id]
                    )}
                  </TableCell>
                ))}
                {(onEdit || onDelete || onView) && (
                  <TableCell 
                    align="right"
                    sx={{ 
                      color: '#333',
                      borderBottom: 'none',
                      py: 1.5
                    }}
                  >
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                      {onView && (
                        <IconButton 
                          onClick={() => onView(row)} 
                          size="small"
                          sx={{ 
                            color: '#2196f3',
                            padding: '4px'
                          }}
                        >
                          <ViewIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onEdit && (
                        <IconButton 
                          onClick={() => onEdit(row)} 
                          size="small"
                          sx={{ 
                            color: '#0455a2',
                            padding: '4px'
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      )}
                      {onDelete && (
                        <IconButton 
                          onClick={() => onDelete(row)} 
                          size="small"
                          sx={{ 
                            color: '#f44336',
                            padding: '4px'
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      )}
                    </Box>
                  </TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        mt: 2,
        px: 1
      }}>
        <Typography 
          variant="body2" 
          sx={{ 
            color: darkMode ? '#aaaaaa' : '#666',
            fontFamily: '"Inter", sans-serif',
            fontSize: '0.875rem'
          }}
        >
          {`Showing ${page * rowsPerPage + 1} to ${Math.min((page + 1) * rowsPerPage, filteredData.length)} of ${filteredData.length} entries`}
        </Typography>
        
        <Stack direction="row" spacing={0.5}>
          <Button
            disabled={page === 0}
            onClick={() => handleChangePage(null, page - 1)}
            sx={{ 
              minWidth: '36px',
              height: '36px',
              color: page === 0 ? '#bdbdbd' : '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              textTransform: 'none',
              fontFamily: '"Inter", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <PreviousIcon fontSize="small" />
          </Button>
          
          {pageNumbers.length <= 5 ? (
            pageNumbers.map(pageNum => (
              <Button
                key={pageNum}
                variant={page === pageNum ? "contained" : "outlined"}
                onClick={() => handleChangePage(null, pageNum)}
                sx={{
                  minWidth: '36px',
                  height: '36px',
                  backgroundColor: page === pageNum ? '#3366ff' : 'transparent',
                  color: page === pageNum ? 'white' : '#666',
                  border: page === pageNum ? 'none' : '1px solid #e0e0e0',
                  fontFamily: '"Inter", sans-serif',
                  '&:hover': {
                    backgroundColor: page === pageNum ? '#3366ff' : 'rgba(0, 0, 0, 0.04)'
                  }
                }}
              >
                {pageNum + 1}
              </Button>
            ))
          ) : (
            <>
              {page > 1 && (
                <Button
                  variant="outlined"
                  onClick={() => handleChangePage(null, 0)}
                  sx={{
                    minWidth: '40px',
                    height: '36px',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  1
                </Button>
              )}
              
              {page > 2 && (
                <Typography sx={{ alignSelf: 'center', color: '#666' }}>...</Typography>
              )}
              
              {page > 0 && (
                <Button
                  variant="outlined"
                  onClick={() => handleChangePage(null, page - 1)}
                  sx={{
                    minWidth: '40px',
                    height: '36px',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  {page}
                </Button>
              )}
              
              <Button
                variant="contained"
                sx={{
                  minWidth: '40px',
                  height: '36px',
                  backgroundColor: '#4285f4',
                  color: 'white',
                  fontFamily: '"Inter", sans-serif'
                }}
              >
                {page + 1}
              </Button>
              
              {page < totalPages - 1 && (
                <Button
                  variant="outlined"
                  onClick={() => handleChangePage(null, page + 1)}
                  sx={{
                    minWidth: '40px',
                    height: '36px',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  {page + 2}
                </Button>
              )}
              
              {page < totalPages - 3 && (
                <Typography sx={{ alignSelf: 'center', color: '#666' }}>...</Typography>
              )}
              
              {page < totalPages - 2 && (
                <Button
                  variant="outlined"
                  onClick={() => handleChangePage(null, totalPages - 1)}
                  sx={{
                    minWidth: '40px',
                    height: '36px',
                    color: '#666',
                    border: '1px solid #e0e0e0',
                    fontFamily: '"Inter", sans-serif'
                  }}
                >
                  {totalPages}
                </Button>
              )}
            </>
          )}
          
          <Button
            endIcon={<NextIcon />}
            disabled={page >= totalPages - 1}
            onClick={() => handleChangePage(null, page + 1)}
            sx={{ 
              minWidth: '36px',
              height: '36px',
              color: page >= totalPages - 1 ? '#bdbdbd' : '#666',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
              textTransform: 'none',
              fontFamily: '"Inter", sans-serif',
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)'
              }
            }}
          >
            <NextIcon fontSize="small" />
          </Button>
        </Stack>
      </Box>
    </Box>
  );
};