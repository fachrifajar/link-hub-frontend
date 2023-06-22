import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, Box, Tab, Tabs, useMediaQuery } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PhoneAppearance from "../components/organisms/Phone-appearance";
import LayersIcon from "@mui/icons-material/Layers";
import LaunchIcon from "@mui/icons-material/Launch";


import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import DragAndDrop from "../components/organisms/DragAndADrop-template";
import AppearanceEdit from "../components/organisms/Appearance-edit";

const AdminItem = () => {
  document.title = "LinkHub | Admin Post";
  const isXs = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [getAuthDataRedux, setGetAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );

  const [value, setValue] = React.useState("item");

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

      <ContainerTemplate
        _setTheme={mode}
        sx={{
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // paddingX: "5vh",
          padding: isXs ? "0" : "0 5vw",
        }}>
        <Box
          // p={{ md: "0 10vw", sm: "0 10vw", xs: "0 5vw" }}
          sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            indicatorColor="secondary"
            textColor="inherit">
            <Tab
              value="back"
              label="Back"
              icon={<ArrowBackIosNewIcon />}
              iconPosition="start"
              onClick={() => navigate("/admin")}
            />
            <Tab
              value="item"
              label="Item"
              icon={<LayersIcon />}
              iconPosition="start"
            />
            {/* <Tab
              value="profile"
              label="Profile"
              icon={<AccountBoxIcon />}
              iconPosition="start"
            /> */}
            <Tab
              value="appearance"
              label="Appearance"
              icon={<LaunchIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        <Grid container spacing={2} sx={{ paddingX: "5vh" }}>
          <Grid item md={8} sm={12} xs={12}>
            {value === "item" && <DragAndDrop />}
            {value === "appearance" && <AppearanceEdit />}
          </Grid>
          <Grid
            item
            md={4}
            sm={0}
            xs={0}
            sx={{
              // borderLeftColor: "text.secondary",
              // borderLeftStyle: "solid",
              // borderLeftWidth: 1,
              // width: "100%",
              // height: "auto",
              display: { md: "block", sm: "none", xs: "none" },
            }}>
            {/* {!isXs && <PhoneAppearance />} */}
            <PhoneAppearance />
          </Grid>
        </Grid>
      </ContainerTemplate>
    </>
  );
};

export default AdminItem;
