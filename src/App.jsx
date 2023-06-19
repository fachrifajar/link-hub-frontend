import React from "react";
import { Box, Typography, useMediaQuery } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";

import NavbarTemplate from "./components/organisms/Navbar-template";
import ContainerTemplate from "./components/atoms/Container-template";
import ButtonTemplate from "./components/atoms/Button-template";

import theme from "./theme";

const App = () => {
  document.title = "LinkHub | Home";
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [authDataRedux, setAuthDataRedux] = React.useState([]);

  const isXs = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  return (
    <>
      <NavbarTemplate
        _setTheme={mode}
        getTheme={(e) => setMode(e)}
        getAuthDataRedux={(e) => {
          setAuthDataRedux(e);
        }}
      />

      <ContainerTemplate
        _setTheme={mode}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "90vh",
          flexDirection: { md: "row", xs: "column-reverse" },
          "& img": {
            width: isXs ? "90%" : "inherit",
          },
        }}>
        <Box mt={{ xs: 2 }} sx={{ maxWidth: { md: "50vw" } }}>
          <Typography variant="body1" color="text.secondary">
            BOOST YOUR ONLINE PRESENCE
          </Typography>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 600,
              "& span": {
                color: "text.contrastText",
              },
            }}>
            Gather <span>Links</span> in a Single Place and{" "}
            <span>Increase</span> your User Engagement.
          </Typography>
          <Typography
            variant={isXs ? "body1" : "h6"}
            mt={2}
            sx={{
              "& div": {
                bgcolor: "primary.main",
                width: "5px",
                height: { md: "30px", sm: "60px", xs: "0" },
                mr: 1,
                display: {
                  md: "inline-block",
                  sm: "inline-block",
                  xs: "none",
                },
              },
              display: "flex",
              alignItems: "center",
            }}>
            <div />
            Get your personalized URL and share across your favorite social
            media for free.
          </Typography>

          <ButtonTemplate
            title={!authDataRedux ? "Join Now" : "Get Started"}
            size="large"
            endIcon={<ArrowForwardIcon />}
            onClick={() => {
              if (!authDataRedux) {
                navigate("/register");
              } else {
                navigate("/admin");
              }
            }}
            sx={{
              bgcolor: "primary.main",
              borderRadius: "10px",
            }}
          />
        </Box>
        {mode === "light" ? (
          <img src="/landing6.png" alt="landing-page-img" />
        ) : (
          <img src="/landing8.png" alt="landing-page-img" />
        )}
      </ContainerTemplate>
    </>
  );
};

export default App;
