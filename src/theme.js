import { createTheme } from "@mui/material";

const theme = (mode) =>
  createTheme({
    palette: {
      mode: mode,
      primary: {
        main: mode === "light" ? "#125ab8" : "#1a73e8",
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
        default: mode === "light" ? "#f3f3f1" : "#0a1929",
        default2: mode === "light" ? "#fff" : "#1a2027",
        default3: mode === "light" ? "#1a2027" : "#1a2027",
      },
      custom: {
        default: mode === "light" ? "#eff0ec" : "#a7a8a5",
        default2: mode === "light" ? "#212121" : "#90caf9",
      },
    },
  });

export default theme;

// #7e98df
