import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { Grid, useMediaQuery } from "@mui/material";
import PhoneAppearance from "../components/molecules/Phone-appearance";

import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import ContentAdminItem from "../components/organisms/Content-adminItem";

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
          padding: isXs ? "0" : "0 5vw",
        }}>
        <Grid container spacing={2} sx={{ paddingX: "5vh" }}>
          <Grid item md={8} sm={12} xs={12}>
            <ContentAdminItem />
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
            <PhoneAppearance />
          </Grid>
        </Grid>
      </ContainerTemplate>
    </>
  );
};

export default AdminItem;
