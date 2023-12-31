import {
  Switch,
  styled,
  Stack,
  Typography,
  useMediaQuery,
  Box,
  CardActionArea,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import { useNavigate, useLocation } from "react-router-dom";

import React from "react";
import theme from "../../theme";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import ButtonTemplate from "../atoms/Button-template";
import DrawerTemplate from "../atoms/Drawer-template";

import TocIcon from "@mui/icons-material/Toc";
import LayersIcon from "@mui/icons-material/Layers";
import LaunchIcon from "@mui/icons-material/Launch";
import ShareIcon from "@mui/icons-material/Share";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
    borderRadius: 20 / 2,
  },
}));

const NavbarTemplate = ({ _setTheme, getTheme, getAuthDataRedux, sx }) => {
  const setTheme = theme(_setTheme);
  const isXs = useMediaQuery("(max-width: 600px)");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mode, setMode] = React.useState("light");
  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );
    
  const [authDataRedux, setAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );
  const [checkPath, setCheckPath] = React.useState(
    location.pathname.split("/")[2]
  );

  const handleSwitchChange = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
    getTheme(mode);
    localStorage.setItem("selectedTheme", mode);
  };

  const handleLogout = () => {
    dispatch(authReducer.deleteAuth());
    window.location.reload();
  };

  React.useEffect(() => {
    if (typeof getAuthDataRedux === "function") {
      getAuthDataRedux(authDataRedux);
    }
  }, [authDataRedux, getAuthDataRedux]);

  return (
    <>
      <ThemeProvider theme={setTheme}>
        <CssBaseline />
        {location.pathname.split("/")[1]?.length < 12 && (
          <>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              m={!isXs && 2}
              sx={{
                bgcolor: "background.default2",
                padding: 1.5,
                marginTop: !isXs && "10px",
                borderRadius: !isXs && "100px",
                ...sx,
              }}>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  flexDirection: "row",
                  "& img": {
                    width: "20px",
                    height: "20px",
                  },
                }}>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 700,
                    letterSpacing: ".3rem",
                    textDecoration: "none",
                    color: "text.primary",
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 1,
                    "& span": {
                      color: "white",
                      fontFamily: "monospace",
                      borderRadius: "5px",
                      paddingLeft: "5px",
                      bgcolor: "primary.main",
                    },
                  }}>
                  Link
                  <span>Hub</span>
                </Typography>

                {!isXs && checkPath !== undefined && (
                  <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    ml={2}
                    spacing={2}>
                    <CardActionArea
                      onClick={() => navigate("/admin")}
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        color: checkPath === "admin" ? "inherit" : "gray",
                      }}>
                      <TocIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Post</Typography>
                    </CardActionArea>

                    <CardActionArea
                      onClick={() =>
                        navigate(`/admin/post/${getPostDataRedux?.id}`)
                      }
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        color: checkPath === "post" ? "inherit" : "gray",
                      }}>
                      <LayersIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Item</Typography>
                    </CardActionArea>

                    <CardActionArea
                      onClick={() =>
                        navigate(`/admin/appearance/${getPostDataRedux?.id}`)
                      }
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        color: checkPath === "appearance" ? "inherit" : "gray",
                      }}>
                      <LaunchIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Appearance</Typography>
                    </CardActionArea>

                    <CardActionArea
                      onClick={() =>
                        navigate(
                          `/${authDataRedux?.username}-${getPostDataRedux?.id}`
                        )
                      }
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        flexDirection: "row",
                        color: checkPath === undefined ? "inherit" : "gray",
                      }}>
                      <ShareIcon sx={{ mr: 1 }} />
                      <Typography variant="body1">Share</Typography>
                    </CardActionArea>
                  </Stack>
                )}
              </Box>

              {!isXs && (
                <Stack
                  direction="row"
                  spacing={2}
                  alignItems="center"
                  sx={{ alignItems: "center" }}>
                  {authDataRedux && (
                    <ButtonTemplate
                      color="secondary"
                      variant="outlined"
                      title="Log Out"
                      onClick={handleLogout}
                      sx={{
                        marginTop: 0,
                        borderRadius: "50px",
                      }}
                    />
                  )}
                  <MaterialUISwitch onChange={handleSwitchChange} />
                </Stack>
              )}

              {isXs && (
                <DrawerTemplate
                  _getAuthDataRedux={authDataRedux}
                  // onClick_profile={() => navigate("/admin")}
                  onClick_logout={handleLogout}>
                  <MaterialUISwitch onChange={handleSwitchChange} />
                </DrawerTemplate>
              )}
            </Stack>

            {isXs && checkPath !== undefined && (
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-around"
                m={2}
                spacing={1}
                sx={{
                  bgcolor: "background.default2",
                  padding: 1.5,
                  marginTop: "10px",
                  borderRadius: "100px",
                }}>
                <CardActionArea
                  onClick={() => navigate("/admin")}
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    color: checkPath === "admin" ? "inherit" : "gray",
                  }}>
                  <TocIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">Post</Typography>
                </CardActionArea>

                <CardActionArea
                  onClick={() =>
                    navigate(`/admin/post/${getPostDataRedux?.id}`)
                  }
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    color: checkPath === "post" ? "inherit" : "gray",
                  }}>
                  <LayersIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">Item</Typography>
                </CardActionArea>

                <CardActionArea
                  onClick={() =>
                    navigate(`/admin/appearance/${getPostDataRedux?.id}`)
                  }
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    color: checkPath === "appearance" ? "inherit" : "gray",
                  }}>
                  <LaunchIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">Appearance</Typography>
                </CardActionArea>

                <CardActionArea
                  onClick={() =>
                    navigate(
                      `/${authDataRedux?.username}-${getPostDataRedux?.id}`
                    )
                  }
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "row",
                    color: checkPath === undefined ? "inherit" : "gray",
                  }}>
                  <ShareIcon sx={{ mr: 1 }} />
                  <Typography variant="body1">Share</Typography>
                </CardActionArea>
              </Stack>
            )}
          </>
        )}
      </ThemeProvider>
    </>
  );
};

export default NavbarTemplate;
