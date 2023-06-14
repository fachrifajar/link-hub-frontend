import React from "react";
import {
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import theme from "./theme";
import { useNavigate } from "react-router-dom";

import NavbarTemplate from "./components/organisms/Navbar-template";
import ContainerTemplate from "./components/atoms/Container-template";
import ButtonTemplate from "./components/atoms/Button-template";

const App = () => {
  document.title = "Home";
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const isXs = useMediaQuery("(max-width: 600px)");
  const navigate = useNavigate();

  return (
    <>

        <NavbarTemplate _setTheme={mode} getTheme={(e) => setMode(e)} />

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
              title="Get Started"
              size="large"
              endIcon={<ArrowForwardIcon />}
              onClick={() => navigate("/register")}
              sx={{
                bgcolor: "primary.main",
                borderRadius: "10px",
                // "&:hover": {
                //   "& .MuiSvgIcon-root": {
                //     marginLeft: 2,
                //   },
                // },
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
