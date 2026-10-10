
import { AppBar, Toolbar, Typography } from "@mui/material";
import LocalPharmacyIcon from "@mui/icons-material/LocalPharmacy";

function Navbar() {
  return (
    <AppBar position="static">
      <Toolbar>
        <LocalPharmacyIcon sx={{ mr: 1 }} />

        <Typography variant="h6" component="div">
          Sistema de Gestión para Farmacia
        </Typography>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;