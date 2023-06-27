import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import ContentAdmin from "../components/organisms/Content-admin";

const Admin = () => {
  document.title = "LinkHub | Admin";
  const navigate = useNavigate();
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [getAuthDataRedux, setGetAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );

  React.useEffect(() => {
    if (!getAuthDataRedux) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <NavbarTemplate _setTheme={mode} getTheme={(e) => setMode(e)} />

      <ContainerTemplate _setTheme={mode}>
        <ContentAdmin />
      </ContainerTemplate>
    </>
  );
};

export default Admin;
