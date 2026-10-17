const API_URL = "http://127.0.0.1:5000/api";

// Lee la respuesta y, si el backend devolvió un error, lanza un Error con su mensaje
async function manejarRespuesta(res, mensajeDefecto) {
  const datos = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(datos.error || mensajeDefecto);
  return datos;
}

const JSON_HEADERS = { "Content-Type": "application/json" };

// Medicamentos
export const getMedicamentos = async () => {
  const res = await fetch(`${API_URL}/medicamentos`);
  return manejarRespuesta(res, "Error al cargar los medicamentos");
};

export const getMedicamento = async (id) => {
  const res = await fetch(`${API_URL}/medicamentos/${id}`);
  return manejarRespuesta(res, "Error al obtener el medicamento");
};

export const createMedicamento = async (data) => {
  const res = await fetch(`${API_URL}/medicamentos`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  return manejarRespuesta(res, "Error al crear el medicamento");
};

export const updateMedicamento = async (id, data) => {
  const res = await fetch(`${API_URL}/medicamentos/${id}`, {
    method: "PUT",
    headers: JSON_HEADERS,
    body: JSON.stringify(data),
  });
  return manejarRespuesta(res, "Error al actualizar el medicamento");
};

export const deleteMedicamento = async (id) => {
  const res = await fetch(`${API_URL}/medicamentos/${id}`, {
    method: "DELETE",
  });
  return manejarRespuesta(res, "Error al eliminar el medicamento");
};

// Categorías (necesario para el selector de categoría en el formulario)
export const getCategorias = async () => {
  const res = await fetch(`${API_URL}/categorias`);
  return manejarRespuesta(res, "Error al cargar las categorías");
};

// Dashboard
export const getDashboardResumen = async () => {
  const res = await fetch(`${API_URL}/dashboard`);
  return manejarRespuesta(res, "Error al cargar los datos del dashboard");
};

export { API_URL };
