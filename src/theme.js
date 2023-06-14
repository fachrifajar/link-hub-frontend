import { createTheme } from "@mui/material";

const theme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? "#1a73e8" : "#125ab8",
      },
      secondary: {
        main: mode === "light" ? "#42a5f5" : "#90caf9",
      },
      text: {
        primary: mode === "light" ? "#07111c" : "#e8e6e3",
        secondary: mode === "light" ? "#5f6368" : "#a9a297",
        contrastText: mode === "light" ? "#125ab8" : "#90caf9",
      },
      background: {
        default: mode === "light" ? "#fff" : "#0a1929",
        default2: mode === "light" ? "#fff" : "#181a1b",
      },
      // custom: {
      //   default: mode === "light" ? "#ebebeb" : "#001e3c",
      //   default2: mode === "light" ? "#f8f5f3" : "#132f4c",
      // },
    },
  });

export default theme;

// #7e98df