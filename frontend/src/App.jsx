
import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Medicamentos from "./pages/Medicamentos";
import Categorias from "./pages/Categorias";
import Empleados from "./pages/Empleados";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/medicamentos" element={<Medicamentos />} />
          <Route path="/categorias" element={<Categorias />} />
          <Route path="/empleados" element={<Empleados />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
