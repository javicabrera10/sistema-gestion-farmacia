
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import "./App.css";

import MainLayout from "./layouts/MainLayout";

import Dashboard from "./pages/Dashboard";
import Medicamentos from "./pages/Medicamentos";
import Categorias from "./pages/Categorias";
import Empleados from "./pages/Empleados";

const theme = createTheme({
  palette: {
    primary: { main: "#00897b", dark: "#00695c", light: "#4db6ac" },
    secondary: { main: "#26a69a" },
    background: { default: "#f1f8f6" },
  },
  shape: { borderRadius: 10 },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
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
    </ThemeProvider>
  );
}

export default App;
