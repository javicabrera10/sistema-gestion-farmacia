const API_URL = "http://127.0.0.1:5000/api";

// Medicamentos
export const getMedicamentos = async () => {
  const res = await fetch(`${API_URL}/medicamentos`);
  if (!res.ok) throw new Error("Error al obtener medicamentos");
  return res.json();
};

export const createMedicamento = async (data) => {
  const res = await fetch(`${API_URL}/medicamentos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear medicamento");
  return res.json();
};

export const updateMedicamento = async (id, data) => {
  const res = await fetch(`${API_URL}/medicamentos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar medicamento");
  return res.json();
};

export const deleteMedicamento = async (id) => {
  const res = await fetch(`${API_URL}/medicamentos/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Error al eliminar medicamento");
  return res.json();
};

// Categorías (necesario para el selector de categoría en el formulario)
export const getCategorias = async () => {
  const res = await fetch(`${API_URL}/categorias`);
  if (!res.ok) throw new Error("Error al obtener categorías");
  return res.json();
};

export { API_URL };
export const getDashboardResumen = async () => {
  const res = await fetch(`${API_URL}/dashboard`);
  if (!res.ok) throw new Error("Error al obtener datos del dashboard");
  return res.json();
};