import * as React from "react";
import Box from "@mui/material/Box";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import SettingsIcon from "@mui/icons-material/Settings";
import MenuIcon from "@mui/icons-material/Menu";
import LogoutIcon from "@mui/icons-material/Logout";

const NavbarTemplate = ({
  children,
  onClick_profile,
  onClick_logout,
  _getAuthDataRedux,
}) => {
  const [state, setState] = React.useState({
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event &&
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  const list = (anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}>
      {_getAuthDataRedux && (
        <>
          <List onClick={onClick_profile}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <SettingsIcon />
                </ListItemIcon>
                <ListItemText>Profile</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>

          <List onClick={onClick_logout}>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText>Log Out</ListItemText>
              </ListItemButton>
            </ListItem>
          </List>
        </>
      )}

      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>{children}</ListItemIcon>
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <div>
      <Button onClick={toggleDrawer("right", true)}>
        <MenuIcon />
      </Button>
      <SwipeableDrawer
        anchor="right"
        open={state.right}
        onClose={toggleDrawer("right", false)}
        onOpen={toggleDrawer("right", true)}>
        {list("right")}
      </SwipeableDrawer>
    </div>
  );
};

export default NavbarTemplate;
