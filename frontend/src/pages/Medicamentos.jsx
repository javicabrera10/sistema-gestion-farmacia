import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  MenuItem,
  Paper,
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

const initialFormState = {
  nombre: "",
  precio: "",
  stock: "",
  fecha_vencimiento: "",
  categoria_id: "",
};

export default function Medicamentos() {
  const [medicamentos, setMedicamentos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialFormState);

  const cargarDatos = async () => {
    try {
      const [medsData, catsData] = await Promise.all([
        getMedicamentos(),
        getCategorias().catch(() => []), // Si categorías no responde aún, no frena medicamentos
      ]);
      setMedicamentos(medsData);
      setCategorias(catsData);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const handleOpen = (medicamento = null) => {
    if (medicamento) {
      setEditingId(medicamento.id);
      setFormData({
        nombre: medicamento.nombre,
        precio: medicamento.precio,
        stock: medicamento.stock,
        fecha_vencimiento: medicamento.fecha_vencimiento,
        categoria_id: medicamento.categoria_id || "",
      });
    } else {
      setEditingId(null);
      setFormData(initialFormState);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock, 10),
        categoria_id: parseInt(formData.categoria_id, 10),
      };

      if (editingId) {
        await updateMedicamento(editingId, payload);
      } else {
        await createMedicamento(payload);
      }
      handleClose();
      cargarDatos();
    } catch (err) {
      alert("Error al guardar el medicamento");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que querés eliminar este medicamento?")) {
      try {
        await deleteMedicamento(id);
        cargarDatos();
      } catch (err) {
        alert("Error al eliminar el medicamento");
      }
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" fontWeight="bold">
          Gestión de Medicamentos
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => handleOpen()}
        >
          Nuevo Medicamento
        </Button>
      </Box>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
            <TableRow>
              <TableCell><strong>ID</strong></TableCell>
              <TableCell><strong>Nombre</strong></TableCell>
              <TableCell><strong>Precio</strong></TableCell>
              <TableCell><strong>Stock</strong></TableCell>
              <TableCell><strong>Vencimiento</strong></TableCell>
              <TableCell><strong>Categoría</strong></TableCell>
              <TableCell align="center"><strong>Acciones</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {medicamentos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No hay medicamentos registrados.
                </TableCell>
              </TableRow>
            ) : (
              medicamentos.map((med) => (
                <TableRow key={med.id}>
                  <TableCell>{med.id}</TableCell>
                  <TableCell>{med.nombre}</TableCell>
                  <TableCell>${med.precio}</TableCell>
                  <TableCell>{med.stock}</TableCell>
                  <TableCell>{med.fecha_vencimiento}</TableCell>
                  <TableCell>{med.categoria_id}</TableCell>
                  <TableCell align="center">
                    <IconButton color="primary" onClick={() => handleOpen(med)}>
                      <Edit />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(med.id)}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal Formulario */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <form onSubmit={handleSubmit}>
          <DialogTitle>
            {editingId ? "Editar Medicamento" : "Agregar Medicamento"}
          </DialogTitle>
          <DialogContent>
            <Box display="flex" flexDirection="column" gap={2} mt={1}>
              <TextField
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Precio"
                name="precio"
                type="number"
                step="0.01"
                value={formData.precio}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                required
                fullWidth
              />
              <TextField
                label="Fecha de Vencimiento"
                name="fecha_vencimiento"
                type="date"
                value={formData.fecha_vencimiento}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                required
                fullWidth
              />
              <TextField
                select
                label="Categoría"
                name="categoria_id"
                value={formData.categoria_id}
                onChange={handleChange}
                required
                fullWidth
              >
                {categorias.length > 0 ? (
                  categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem value={1}>Categoría General (ID: 1)</MenuItem>
                )}
              </TextField>
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Guardar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
}