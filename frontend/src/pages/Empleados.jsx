
import { useCallback, useEffect, useState } from "react";
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

const formularioInicial = {
  nombre: "",
  apellido: "",
  dni: "",
  email: "",
  cargo: "",
};

function Empleados() {
  const [empleados, setEmpleados] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [guardando, setGuardando] = useState(false);
  const [errorFormulario, setErrorFormulario] = useState("");

  const [notificacion, setNotificacion] = useState({
    abierto: false,
    mensaje: "",
    tipo: "success",
  });

  // 1️⃣ mostrarNotificacion PRIMERO
  const mostrarNotificacion = useCallback((mensaje, tipo = "success") => {
    setNotificacion({
      abierto: true,
      mensaje,
      tipo,
    });
  }, []);

  // 2️⃣ cargarEmpleados DESPUÉS (depende de mostrarNotificacion)
  const cargarEmpleados = useCallback(async () => {
    setCargando(true);

    try {
      const respuesta = await fetch(`${API_URL}/empleados`);
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudieron cargar los empleados",
        );
      }

      setEmpleados(datos);
    } catch (error) {
      mostrarNotificacion(error.message, "error");
    } finally {
      setCargando(false);
    }
  }, [mostrarNotificacion]);

  // 3️⃣ useEffect AL FINAL
  useEffect(() => {
    cargarEmpleados();
  }, [cargarEmpleados]);

  function abrirFormulario(empleado = null) {
    setEmpleadoEditando(empleado);

    setFormulario(
      empleado
        ? {
            nombre: empleado.nombre,
            apellido: empleado.apellido,
            dni: empleado.dni,
            email: empleado.email,
            cargo: empleado.cargo,
          }
        : { ...formularioInicial },
    );

    setErrorFormulario("");
    setModalAbierto(true);
  }

  function cerrarFormulario() {
    if (guardando) return;

    setModalAbierto(false);
    setEmpleadoEditando(null);
    setFormulario({ ...formularioInicial });
    setErrorFormulario("");
  }

  function manejarCambio(evento) {
    const { name, value } = evento.target;

    setFormulario((actual) => ({
      ...actual,
      [name]: value,
    }));
  }

  async function guardarEmpleado(evento) {
    evento.preventDefault();

    const datosEmpleado = {
      nombre: formulario.nombre.trim(),
      apellido: formulario.apellido.trim(),
      dni: formulario.dni.trim(),
      email: formulario.email.trim(),
      cargo: formulario.cargo.trim(),
    };

    if (
      !datosEmpleado.nombre ||
      !datosEmpleado.apellido ||
      !datosEmpleado.dni ||
      !datosEmpleado.email ||
      !datosEmpleado.cargo
    ) {
      setErrorFormulario("Todos los campos son obligatorios.");
      return;
    }

    setGuardando(true);
    setErrorFormulario("");

    const editando = Boolean(empleadoEditando);

    const url = editando
      ? `${API_URL}/empleados/${empleadoEditando.id}`
      : `${API_URL}/empleados`;

    try {
      const respuesta = await fetch(url, {
        method: editando ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosEmpleado),
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudo guardar el empleado",
        );
      }

      // Cerramos el modal y limpiamos el formulario manualmente
      // (no usamos cerrarFormulario porque "guardando" aún es true).
      setModalAbierto(false);
      setEmpleadoEditando(null);
      setFormulario({ ...formularioInicial });

      await cargarEmpleados();

      mostrarNotificacion(
        datos.mensaje ||
          (editando
            ? "Empleado actualizado correctamente"
            : "Empleado creado correctamente"),
      );
    } catch (error) {
      setErrorFormulario(error.message);
    } finally {
      setGuardando(false);
    }
  }

  async function eliminarEmpleado(empleado) {
    const confirmar = window.confirm(
      `¿Seguro que querés eliminar a ${empleado.nombre} ${empleado.apellido}?`,
    );

    if (!confirmar) return;

    try {
      const respuesta = await fetch(
        `${API_URL}/empleados/${empleado.id}`,
        {
          method: "DELETE",
        },
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudo eliminar el empleado",
        );
      }

      await cargarEmpleados();

      mostrarNotificacion(
        datos.mensaje || "Empleado eliminado correctamente",
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
            Empleados
          </Typography>

          <Typography color="text.secondary" sx={{ mt: 1 }}>
            Administrá los empleados de la farmacia.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => abrirFormulario()}
        >
          Nuevo empleado
        </Button>
      </Box>

      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <TableContainer sx={{ overflowX: "auto" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "grey.100" }}>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>
                <TableCell>
                  <strong>Nombre</strong>
                </TableCell>
                <TableCell>
                  <strong>Apellido</strong>
                </TableCell>
                <TableCell>
                  <strong>DNI</strong>
                </TableCell>
                <TableCell>
                  <strong>Email</strong>
                </TableCell>
                <TableCell>
                  <strong>Cargo</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Acciones</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {cargando ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    <CircularProgress size={30} />
                    <Typography sx={{ mt: 1 }}>
                      Cargando empleados...
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : empleados.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 5 }}>
                    No hay empleados registrados.
                  </TableCell>
                </TableRow>
              ) : (
                empleados.map((empleado) => (
                  <TableRow key={empleado.id} hover>
                    <TableCell>{empleado.id}</TableCell>
                    <TableCell>{empleado.nombre}</TableCell>
                    <TableCell>{empleado.apellido}</TableCell>
                    <TableCell>{empleado.dni}</TableCell>
                    <TableCell>{empleado.email}</TableCell>
                    <TableCell>{empleado.cargo}</TableCell>

                    <TableCell align="right" sx={{ whiteSpace: "nowrap" }}>
                      <IconButton
                        color="primary"
                        aria-label={`Editar ${empleado.nombre} ${empleado.apellido}`}
                        onClick={() => abrirFormulario(empleado)}
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        aria-label={`Eliminar ${empleado.nombre} ${empleado.apellido}`}
                        onClick={() => eliminarEmpleado(empleado)}
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
        <Box component="form" onSubmit={guardarEmpleado}>
          <DialogTitle>
            {empleadoEditando ? "Editar empleado" : "Nuevo empleado"}
          </DialogTitle>

          <DialogContent>
            <TextField
              autoFocus
              fullWidth
              required
              margin="normal"
              label="Nombre"
              name="nombre"
              value={formulario.nombre}
              onChange={manejarCambio}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              label="Apellido"
              name="apellido"
              value={formulario.apellido}
              onChange={manejarCambio}
              inputProps={{ maxLength: 100 }}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              label="DNI"
              name="dni"
              value={formulario.dni}
              onChange={manejarCambio}
              inputProps={{ maxLength: 20 }}
            />

            <TextField
              fullWidth
              required
              type="email"
              margin="normal"
              label="Email"
              name="email"
              value={formulario.email}
              onChange={manejarCambio}
              inputProps={{ maxLength: 120 }}
            />

            <TextField
              fullWidth
              required
              margin="normal"
              label="Cargo"
              name="cargo"
              placeholder="Ej.: Farmacéutico"
              value={formulario.cargo}
              onChange={manejarCambio}
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
          setNotificacion((actual) => ({
            ...actual,
            abierto: false,
          }))
        }
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={notificacion.tipo}
          variant="filled"
          onClose={() =>
            setNotificacion((actual) => ({
              ...actual,
              abierto: false,
            }))
          }
        >
          {notificacion.mensaje}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Empleados;
