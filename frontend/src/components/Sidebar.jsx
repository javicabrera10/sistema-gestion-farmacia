
import {
  Box,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import DashboardIcon from "@mui/icons-material/Dashboard";
import MedicationIcon from "@mui/icons-material/Medication";
import CategoryIcon from "@mui/icons-material/Category";
import PeopleIcon from "@mui/icons-material/People";

import { NavLink } from "react-router-dom";

const opciones = [
  {
    texto: "Dashboard",
    ruta: "/",
    icono: <DashboardIcon />,
  },
  {
    texto: "Medicamentos",
    ruta: "/medicamentos",
    icono: <MedicationIcon />,
  },
  {
    texto: "Categorías",
    ruta: "/categorias",
    icono: <CategoryIcon />,
  },
  {
    texto: "Empleados",
    ruta: "/empleados",
    icono: <PeopleIcon />,
  },
];

function Sidebar() {
  return (
    <Box
      sx={{
        width: 230,
        minHeight: "calc(100vh - 64px)",
        bgcolor: "grey.100",
      }}
    >
      <List>
        {opciones.map((opcion) => (
          <ListItemButton
            key={opcion.ruta}
            component={NavLink}
            to={opcion.ruta}
            sx={{
              "&.active": {
                bgcolor: "action.selected",
                fontWeight: "bold",
              },
            }}
          >
            <ListItemIcon>{opcion.icono}</ListItemIcon>
            <ListItemText primary={opcion.texto} />
          </ListItemButton>
        ))}
      </List>
    </Box>
  );
}

export default Sidebar;