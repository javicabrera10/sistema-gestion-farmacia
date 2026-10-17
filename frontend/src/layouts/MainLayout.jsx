import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";

function MainLayout() {
  return (
    <>
      <Navbar />

      <main className="contenido-principal">
        <Outlet />
      </main>
    </>
  );
}

export default MainLayout;
