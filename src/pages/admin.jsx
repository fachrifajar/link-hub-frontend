import React from "react";
import axios from "axios";
import { Grid, Box, Typography, Tab, Tabs } from "@mui/material";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import AutoAwesomeMotionIcon from "@mui/icons-material/AutoAwesomeMotion";
import LaunchIcon from "@mui/icons-material/Launch";

import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import Post from "../components/organisms/Post";

const Admin = () => {
  document.title = "LinkHub | Admin";
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [authDataRedux, setAuthDataRedux] = React.useState([]);
  const [value, setValue] = React.useState("post");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <NavbarTemplate
        _setTheme={mode}
        getTheme={(e) => setMode(e)}
        getAuthDataRedux={(e) => {
          setAuthDataRedux(e);
        }}
        // sx={{ marginBottom: "10vh" }}
      />

      <ContainerTemplate
        _setTheme={mode}
        sx={{
          // display: "flex",
          // justifyContent: "center",
          // alignItems: "center",
          // paddingX: "5vh",
          padding: 0,
        }}>
        <Box
          p={{ md: "0 10vw", sm: "0 10vw", xs: "0 5vw" }}
          sx={{ width: "100%" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            centered
            indicatorColor="secondary"
            textColor="inherit"
            // variant="fullWidth"
          >
            <Tab
              value="post"
              label="Post"
              icon={<AutoAwesomeMotionIcon />}
              iconPosition="start"
            />
            <Tab
              value="profile"
              label="Profile"
              icon={<AccountBoxIcon />}
              iconPosition="start"
            />
            <Tab
              value="appearance"
              label="Appearance"
              icon={<LaunchIcon />}
              iconPosition="start"
            />
          </Tabs>
        </Box>
        <Grid
          container
          // display="flex"
          // justifyContent="center"
          // alignItems="center"
          spacing={2}
          sx={{ paddingX: "5vh" }}>
          <Grid item md={value === "post" ? 12 : 8} sm={12} xs={12}>
            {/* Content */}
            {value === "post" && <Post />}
          </Grid>
          <Grid
            item
            md={4}
            sm={0}
            xs={0}
            display={value === "post" ? "none" : "inherit"}>
            {/* Content */}
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Magnam quas
            accusamus, nisi exercitationem repudiandae neque corporis at
            officiis iste quasi. Aspernatur, expedita est quo ducimus facere vel
            nam mollitia atque.
          </Grid>
        </Grid>
      </ContainerTemplate>
    </>
  );
};

export default Admin;
