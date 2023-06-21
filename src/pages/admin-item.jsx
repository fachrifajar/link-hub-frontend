import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, Box, Tab, Tabs } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import PhoneAppearance from "../components/organisms/Phone-appearance";
import LayersIcon from "@mui/icons-material/Layers";
import AccountBoxIcon from "@mui/icons-material/AccountBox";
import LaunchIcon from "@mui/icons-material/Launch";
import AddIcon from "@mui/icons-material/Add";

import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import DragAndDrop from "../components/organisms/DragAndADrop-template";
import ButtonTemplate from "../components/atoms/Button-template";

const AdminItem = () => {
  document.title = "LinkHub | Admin Post";
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
          padding: "0 5vw",
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
          <Grid item md={8} sm={12} xs={12}>
            {value === "item" && (
              <>
                {/* <Box
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  flexDirection="column">
                  <ButtonTemplate
                    title="Add Item"
                    // disabled={postData?.length === 3 ? true : false}
                    // isLoading={isLoading}
                    // onClick={handleAddPost}
                    startIcon={<AddIcon />}
                    sx={{
                      width: "100%",
                      fontSize: { md: "18px", sm: "18px", xs: "16px" },
                      marginBottom: "5%",
                    }}
                  />
                </Box> */}

                <DragAndDrop />
              </>
            )}
          </Grid>
          <Grid
            item
            md={4}
            sm={0}
            xs={0}
            sx={
              {
                // borderLeftColor: "text.secondary",
                // borderLeftStyle: "solid",
                // borderLeftWidth: 1,
                // width: "100%"
              }
            }>
            <PhoneAppearance />
          </Grid>
        </Grid>
      </ContainerTemplate>
    </>
  );
};

export default AdminItem;
