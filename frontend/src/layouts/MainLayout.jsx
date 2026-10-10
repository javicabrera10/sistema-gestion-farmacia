
import { Box } from "@mui/material";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function MainLayout() {
  return (
    <Box>
      <Navbar />

      <Box sx={{ display: "flex" }}>
        <Sidebar />

        <Box
          component="main"
          sx={{ flex: 1, p: 3, minWidth: 0 }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default MainLayout;