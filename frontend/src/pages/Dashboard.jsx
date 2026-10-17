import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  Medication,
  Category,
  People,
  Inventory,
  AttachMoney,
  Warning,
} from "@mui/icons-material";
import { getDashboardResumen } from "../services/api";

const resumenInicial = {
  total_productos: 0,
  total_categorias: 0,
  total_empleados: 0,
  stock_total: 0,
  valor_inventario: 0,
  alertas_stock: [],
  total_alertas: 0,
};

function TarjetaMetrica({ titulo, valor, icono, color }) {
  return (
    <Card elevation={3} sx={{ borderLeft: `5px solid ${color}`, height: "100%" }}>
      <CardContent>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            <Typography color="text.secondary" variant="subtitle2">
              {titulo}
            </Typography>
            <Typography variant="h4" fontWeight="bold">
              {valor}
            </Typography>
          </Box>
          <Box sx={{ color, display: "flex" }}>{icono}</Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function Dashboard() {
  const [resumen, setResumen] = useState(resumenInicial);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getDashboardResumen()
      .then((datos) => setResumen({ ...resumenInicial, ...datos }))
      .catch((err) => setError(err.message || "Error al cargar el dashboard"))
      .finally(() => setCargando(false));
  }, []);

  const iconoGrande = { fontSize: 40 };

  return (
    <Box>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        Dashboard
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          ❌ {error}
        </Alert>
      )}

      {cargando ? (
        <Box sx={{ textAlign: "center", py: 6 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Conteos principales (lo que pide el TP) */}
          <Grid container spacing={3} sx={{ mb: 3 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TarjetaMetrica
                titulo="Medicamentos"
                valor={resumen.total_productos}
                icono={<Medication sx={iconoGrande} />}
                color="#00897b"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TarjetaMetrica
                titulo="Categorías"
                valor={resumen.total_categorias}
                icono={<Category sx={iconoGrande} />}
                color="#0288d1"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TarjetaMetrica
                titulo="Empleados"
                valor={resumen.total_empleados}
                icono={<People sx={iconoGrande} />}
                color="#7b1fa2"
              />
            </Grid>
          </Grid>

          {/* Métricas de inventario */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TarjetaMetrica
                titulo="Stock total (unidades)"
                valor={resumen.stock_total}
                icono={<Inventory sx={iconoGrande} />}
                color="#26a69a"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TarjetaMetrica
                titulo="Valor del inventario"
                valor={`$${resumen.valor_inventario}`}
                icono={<AttachMoney sx={iconoGrande} />}
                color="#2e7d32"
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TarjetaMetrica
                titulo="Stock crítico"
                valor={resumen.total_alertas}
                icono={<Warning sx={iconoGrande} />}
                color="#d32f2f"
              />
            </Grid>
          </Grid>

          <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
            Alertas de reabastecimiento
          </Typography>

          <TableContainer component={Paper} elevation={3}>
            <Table>
              <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
                <TableRow>
                  <TableCell><strong>ID</strong></TableCell>
                  <TableCell><strong>Nombre</strong></TableCell>
                  <TableCell><strong>Stock actual</strong></TableCell>
                  <TableCell><strong>Precio</strong></TableCell>
                  <TableCell><strong>Estado</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resumen.alertas_stock.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      No hay medicamentos con stock crítico en este momento.
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
                        <Chip label="Reponer stock" color="error" size="small" />
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  );
}
