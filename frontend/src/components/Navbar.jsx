import { AppBar, Toolbar, Typography } from "@mui/material";
import { NavLink } from "react-router-dom";

import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";

const opciones = [
  { texto: "Dashboard", ruta: "/", icono: <DashboardIcon fontSize="small" /> },
  { texto: "Medicamentos", ruta: "/medicamentos", icono: <MedicationIcon fontSize="small" /> },
  { texto: "Categorías", ruta: "/categorias", icono: <CategoryIcon fontSize="small" /> },
  { texto: "Empleados", ruta: "/empleados", icono: <PeopleIcon fontSize="small" /> },
];

function Navbar() {
  return (
    <AppBar position="sticky" className="navbar-farmacia">
      <Toolbar className="navbar-contenido">
        <div className="navbar-marca">
          <LocalPharmacyIcon />
          <Typography variant="h6" component="span">
            Sistema de Gestión para Farmacia
          </Typography>
        </div>

        <nav className="navbar-links">
          {opciones.map((opcion) => (
            <NavLink
              key={opcion.ruta}
              to={opcion.ruta}
              end={opcion.ruta === "/"}
              className="navbar-link"
            >
              {opcion.icono}
              {opcion.texto}
            </NavLink>
          ))}
        </nav>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
