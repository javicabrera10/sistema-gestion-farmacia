import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip
} from '@mui/material';
import {
  Medication,
  Warning,
  AttachMoney,
  Inventory
} from '@mui/icons-material';
import { getDashboardResumen } from '../services/api';

export default function Dashboard() {
  const [resumen, setResumen] = useState({
    total_productos: 0,
    stock_total: 0,
    valor_inventario: 0,
    alertas_stock: [],
    total_alertas: 0
  });

  useEffect(() => {
    getDashboardResumen()
      .then((data) => setResumen(data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={3}>
        Panel de Control
      </Typography>

      {/* Tarjetas de Métricas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: '5px solid #1976d2' }}>
            <CardContent display="flex" alignItems="center">
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Total Medicamentos
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {resumen.total_productos}
                  </Typography>
                </Box>
                <Medication color="primary" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: '5px solid #0288d1' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Stock Total (Unidades)
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    {resumen.stock_total}
                  </Typography>
                </Box>
                <Inventory color="info" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: '5px solid #2e7d32' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Valor del Inventario
                  </Typography>
                  <Typography variant="h4" fontWeight="bold">
                    ${resumen.valor_inventario}
                  </Typography>
                </Box>
                <AttachMoney color="success" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card elevation={3} sx={{ borderLeft: '5px solid #d32f2f' }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography color="textSecondary" variant="subtitle2">
                    Stock Crítico
                  </Typography>
                  <Typography variant="h4" fontWeight="bold" color="error">
                    {resumen.total_alertas}
                  </Typography>
                </Box>
                <Warning color="error" sx={{ fontSize: 40 }} />
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Tabla de Medicamentos con Bajo Stock */}
      <Typography variant="h6" fontWeight="bold" mb={2}>
        Alertas de Reabastecimiento
      </Typography>
      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: '#fff3e0' }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Stock Actual</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Estado</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {resumen.alertas_stock.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  No hay productos con stock crítico en este momento.
                </TableCell>
              </TableRow>
            ) : (
              resumen.alertas_stock.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.id}</TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell><strong>{item.stock}</strong></TableCell>
                  <TableCell>${item.precio}</TableCell>
                  <TableCell>
                    <Chip label="Reponer Stock" color="error" size="small" />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
}