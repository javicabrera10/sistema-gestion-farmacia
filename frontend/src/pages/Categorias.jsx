
import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { API_URL } from "../services/api";

function Categorias() {
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [categoriaEditando, setCategoriaEditando] = useState(null);
  const [nombre, setNombre] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");
  const [notificacion, setNotificacion] = useState({
    abierto: false,
    mensaje: "",
    tipo: "success",
  });

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function cargarCategorias() {
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/categorias`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudieron cargar las categorías");
      }

      setCategorias(datos);
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    } finally {
      setCargando(false);
    }
  }

  function mostrarNotificacion(mensaje, tipo = "success") {
    setNotificacion({
      abierto: true,
      mensaje,
      tipo,
    });
  }

  function abrirFormulario(categoria = null) {
    setCategoriaEditando(categoria);
    setNombre(categoria ? categoria.nombre : "");
    setErrorFormulario("");
    setModalAbierto(true);
  }

  function cerrarFormulario() {
    if (guardando) return;

    setModalAbierto(false);
    setCategoriaEditando(null);
    setNombre("");
    setErrorFormulario("");
  }

  async function guardarCategoria(evento) {
    evento.preventDefault();

    const nombreLimpio = nombre.trim();

    if (!nombreLimpio) {
      setErrorFormulario("El nombre de la categoría es obligatorio");
      return;
    }

    setGuardando(true);
    setErrorFormulario("");

    const editando = Boolean(categoriaEditando);

    const url = editando
      ? `${API_URL}/categorias/${categoriaEditando.id}`
      : `${API_URL}/categorias`;

    try {
      const respuesta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nombre: nombreLimpio,
        }),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo guardar la categoría");
      }

      cerrarFormulario();
      await cargarCategorias();

      mostrarNotificacion(
        datos.mensaje ||
          (editando
            ? "Categoría actualizada correctamente"
            : "Categoría creada correctamente"),
      );
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarCategoria(categoria) {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar la categoría "${categoria.nombre}"?`,
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `${API_URL}/categorias/${categoria.id}`,
        {
          method: "DELETE",
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No se pudo eliminar la categoría");
      }

      await cargarCategorias();

      mostrarNotificacion(
        datos.mensaje || "Categoría eliminada correctamente",
      );
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    }
  }

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
            Categorías
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Administrá las categorías de los medicamentos.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirFormulario()}
        >
          Nueva categoría
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Nombre</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {cargando ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                    <Typography sx={{ mt: 1 }}>
                      Cargando categorías...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : categorias.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ py: 5 }}>
                    No hay categorías registradas.
                  </TableCell>
                </TableRow>
              ) : (
                categorias.map((categoria) => (
                  <TableRow key={categoria.id} hover>
                    <TableCell>{categoria.id}</TableCell>
                    <TableCell>{categoria.nombre}</TableCell>

                    <TableCell align="right">
                      <IconButton
                        color="primary"
                        aria-label={`Editar ${categoria.nombre}`}
                        onClick={() => abrirFormulario(categoria)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label={`Eliminar ${categoria.nombre}`}
                        onClick={() => eliminarCategoria(categoria)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Dialog
        open={modalAbierto}
        onClose={cerrarFormulario}
        fullWidth
        maxWidth="sm"
      >
        <Box component="form" onSubmit={guardarCategoria}>
          <DialogTitle>
            {categoriaEditando ? "Editar categoría" : "Nueva categoría"}
          </DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              required
              margin="normal"
              label="Nombre de la categoría"
              placeholder="Ej.: Analgésicos"
              value={nombre}
              onChange={(evento) => setNombre(evento.target.value)}
              inputProps={{ maxLength: 100 }}
            />

            {errorFormulario && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {errorFormulario}
              </Alert>
            )}
          </DialogContent>

          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button onClick={cerrarFormulario} disabled={guardando}>
              Cancelar
            </Button>

            <Button
              type="submit"
              variant="contained"
              disabled={guardando}
            >
              {guardando ? "Guardando..." : "Guardar"}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      <Snackbar
        open={notificacion.abierto}
        autoHideDuration={4000}
        onClose={() =>
          setNotificacion((actual) => ({ ...actual, abierto: false }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notificacion.tipo}
          variant="filled"
          onClose={() =>
            setNotificacion((actual) => ({ ...actual, abierto: false }))
          }
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Categorias;
