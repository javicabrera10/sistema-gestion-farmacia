import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import {
  getMedicamentos,
  createMedicamento,
  updateMedicamento,
  deleteMedicamento,
  getCategorias,
} from "../services/api";

const formularioInicial = {
  nombre: "",
  precio: "",
  stock: "",
  fecha_vencimiento: "",
  categoria_id: "",
};

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);

  const [modalAbierto, setModalAbierto] = useState(false);
  const [editandoId, setEditandoId] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  const [medicamentoAEliminar, setMedicamentoAEliminar] = useState(null);
  const [eliminando, setEliminando] = useState(false);

  const [notificacion, setNotificacion] = useState({
    abierto: false,
    mensaje: "",
    tipo: "success",
  });

  const mostrarNotificacion = useCallback((mensaje, tipo = "success") => {
    setNotificacion({ abierto: true, mensaje, tipo });
  }, []);

  const cargarDatos = useCallback(async () => {
    setCargando(true);
    try {
      const [medsData, catsData] = await Promise.all([
        getMedicamentos(),
        getCategorias(),
      ]);
      setMedicamentos(medsData);
      setCategorias(catsData);
    } catch (err) {
      mostrarNotificacion(`❌ ${err.message}`, "error");
    } finally {
      setCargando(false);
    }
  }, [mostrarNotificacion]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  const nombreCategoria = (id) =>
    categorias.find((cat) => cat.id === id)?.nombre ?? `ID ${id}`;

  const abrirFormulario = (medicamento = null) => {
    if (medicamento) {
      setEditandoId(medicamento.id);
      setFormulario({
        nombre: medicamento.nombre,
        precio: medicamento.precio,
        stock: medicamento.stock,
        fecha_vencimiento: medicamento.fecha_vencimiento,
        categoria_id: medicamento.categoria_id || "",
      });
    } else {
      setEditandoId(null);
      setFormulario(formularioInicial);
    }
    setErrorFormulario("");
    setModalAbierto(true);
  };

  const cerrarFormulario = () => {
    if (guardando) return;
    setModalAbierto(false);
    setFormulario(formularioInicial);
    setEditandoId(null);
    setErrorFormulario("");
  };

  const manejarCambio = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarMedicamento = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setErrorFormulario("");

    const datos = {
      nombre: formulario.nombre.trim(),
      precio: formulario.precio === "" ? null : Number(formulario.precio),
      stock: formulario.stock === "" ? null : Number(formulario.stock),
      fecha_vencimiento: formulario.fecha_vencimiento,
      categoria_id: formulario.categoria_id === "" ? null : Number(formulario.categoria_id),
    };

    try {
      const respuesta = editandoId
        ? await updateMedicamento(editandoId, datos)
        : await createMedicamento(datos);

      setModalAbierto(false);
      setFormulario(formularioInicial);
      setEditandoId(null);

      await cargarDatos();
      mostrarNotificacion(
        `✅ ${respuesta.mensaje || "Medicamento guardado correctamente"}`,
      );
    } catch (err) {
      setErrorFormulario(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const confirmarEliminacion = async () => {
    setEliminando(true);
    try {
      const respuesta = await deleteMedicamento(medicamentoAEliminar.id);
      setMedicamentoAEliminar(null);
      await cargarDatos();
      mostrarNotificacion(
        `✅ ${respuesta.mensaje || "Medicamento eliminado correctamente"}`,
      );
    } catch (err) {
      setMedicamentoAEliminar(null);
      mostrarNotificacion(`❌ ${err.message}`, "error");
    } finally {
      setEliminando(false);
    }
  };

  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: { xs: "stretch", sm: "center" },
          gap: 2,
          mb: 3,
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight="bold">
            Medicamentos
          </Typography>
          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Administrá el stock y los precios de los medicamentos.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => abrirFormulario()}
        >
          Nuevo medicamento
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead sx={{ backgroundColor: "#e0f2f1" }}>
              <TableRow>
                <TableCell><strong>ID</strong></TableCell>
                <TableCell><strong>Nombre</strong></TableCell>
                <TableCell><strong>Precio</strong></TableCell>
                <TableCell><strong>Stock</strong></TableCell>
                <TableCell><strong>Vencimiento</strong></TableCell>
                <TableCell><strong>Categoría</strong></TableCell>
                <TableCell align="right"><strong>Acciones</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {cargando ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                    <Typography sx={{ mt: 1 }}>Cargando medicamentos...</Typography>
                  </TableCell>
                </TableRow>
              ) : medicamentos.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    No hay medicamentos registrados.
                  </TableCell>
                </TableRow>
              ) : (
                medicamentos.map((med) => (
                  <TableRow key={med.id} hover>
                    <TableCell>{med.id}</TableCell>
                    <TableCell>{med.nombre}</TableCell>
                    <TableCell>${med.precio}</TableCell>
                    <TableCell>{med.stock}</TableCell>
                    <TableCell>{med.fecha_vencimiento}</TableCell>
                    <TableCell>{nombreCategoria(med.categoria_id)}</TableCell>
                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <IconButton
                        color="primary"
                        aria-label={`Editar ${med.nombre}`}
                        onClick={() => abrirFormulario(med)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton
                        color="error"
                        aria-label={`Eliminar ${med.nombre}`}
                        onClick={() => setMedicamentoAEliminar(med)}
                      >
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* Formulario crear / editar */}
      <Dialog open={modalAbierto} onClose={cerrarFormulario} maxWidth="sm" fullWidth>
        <Box component="form" onSubmit={guardarMedicamento}>
          <DialogTitle>
            {editandoId ? "Editar medicamento" : "Nuevo medicamento"}
          </DialogTitle>

          <DialogContent>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={manejarCambio}
                required
                fullWidth
                slotProps={{ htmlInput: { maxLength: 100 } }}
              />
              <TextField
                label="Precio"
                name="precio"
                type="number"
                value={formulario.precio}
                onChange={manejarCambio}
                required
                fullWidth
                slotProps={{ htmlInput: { step: "0.01", min: 0.01 } }}
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formulario.stock}
                onChange={manejarCambio}
                required
                fullWidth
                slotProps={{ htmlInput: { step: 1, min: 0 } }}
              />
              <TextField
                label="Fecha de vencimiento"
                name="fecha_vencimiento"
                type="date"
                value={formulario.fecha_vencimiento}
                onChange={manejarCambio}
                required
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
              <TextField
                select
                label="Categoría"
                name="categoria_id"
                value={formulario.categoria_id}
                onChange={manejarCambio}
                required
                fullWidth
                helperText={
                  categorias.length === 0
                    ? "Primero creá una categoría en la sección Categorías."
                    : ""
                }
              >
                {categorias.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.nombre}
                  </MenuItem>
                ))}
              </TextField>

              {errorFormulario && (
                <Alert severity="error">{errorFormulario}</Alert>
              )}
            </Box>
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={cerrarFormulario} disabled={guardando}>
              Cancelar
            </Button>
            <Button type="submit" variant="contained" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Confirmación de borrado */}
      <Dialog
        open={Boolean(medicamentoAEliminar)}
        onClose={() => !eliminando && setMedicamentoAEliminar(null)}
      >
        <DialogTitle>Eliminar medicamento</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Seguro que querés eliminar{" "}
            <strong>{medicamentoAEliminar?.nombre}</strong>? Esta acción no se
            puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setMedicamentoAEliminar(null)} disabled={eliminando}>
            Cancelar
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={confirmarEliminacion}
            disabled={eliminando}
          >
            {eliminando ? "Eliminando..." : "Eliminar"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={notificacion.abierto}
        autoHideDuration={4000}
        onClose={() => setNotificacion((actual) => ({ ...actual, abierto: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notificacion.tipo}
          variant="filled"
          onClose={() => setNotificacion((actual) => ({ ...actual, abierto: false }))}
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}
