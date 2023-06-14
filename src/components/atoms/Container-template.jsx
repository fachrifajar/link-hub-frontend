import { Box, useMediaQuery } from "@mui/material";
import theme from "../../theme";
// import CssBaseline from "@mui/material/CssBaseline";
// import { ThemeProvider } from "@mui/material/styles";

const ContainerTemplate = ({ children, _setTheme, sx,theme }) => {
  const isXs = useMediaQuery("(max-width: 600px)");
  // const setTheme = theme(_setTheme);
  return (
    <>
      <Box
        flex={1}
        p={!isXs ? "0 10vw" : "0 5vw"}
        sx={{
          ...sx,
        }}>
        {/* <ThemeProvider theme={setTheme}>
          <CssBaseline /> */}
        {children}
        {/* </ThemeProvider> */}
      </Box>
    </>
  );
};

export default ContainerTemplate;
