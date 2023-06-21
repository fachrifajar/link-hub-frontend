import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, Box, Typography, Tab, Tabs } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import LaunchIcon from "@mui/icons-material/Launch";
import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import Post from "../components/organisms/Post";
import PhoneAppearance from "../components/organisms/Phone-appearance";

const Admin = () => {
  document.title = "LinkHub | Admin";
  const navigate = useNavigate();
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [getAuthDataRedux, setGetAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );
  const [value, setValue] = React.useState("post");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    if (!getAuthDataRedux) {
      navigate("/login");
    }
  }, []);
  return (
    <>
      <NavbarTemplate _setTheme={mode} getTheme={(e) => setMode(e)} />

      <ContainerTemplate _setTheme={mode}>
        <Post />
      </ContainerTemplate>
    </>
  );
};

export default Admin;
