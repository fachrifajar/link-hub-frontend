import React from "react";
import NavbarTemplate from "./components/organisms/Navbar-template";
import {
  ThemeProvider,
  CssBaseline,
  Box,
  Typography,
  useMediaQuery,
} from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import theme from "./theme";

import ContainerTemplate from "./components/atoms/Container-template";
import ButtonTemplate from "./components/atoms/Button-template";

const App = () => {
  const [themeMode, setThemeMode] = React.useState("light");
  const isXs = useMediaQuery("(max-width: 600px)");
  const isSm = useMediaQuery("(min-width: 601px) and (max-width: 930px)");

  return (
    <>
      <ThemeProvider theme={theme(themeMode)}>
        <CssBaseline />
        <NavbarTemplate
          initialMode={themeMode}
          onThemeChange={(e) => setThemeMode(e)}
        />

        <ContainerTemplate
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
              sx={{ bgcolor: "primary.main" }}
            />
          </Box>
          {themeMode === "light" ? (
            <img src="/landing6.png" alt="landing-page-img" />
          ) : (
            <img src="/landing8.png" alt="landing-page-img" />
          )}
        </ContainerTemplate>
      </ThemeProvider>
    </>
  );
};

export default App;
