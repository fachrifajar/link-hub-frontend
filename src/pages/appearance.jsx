import React from "react";
import { Paper, Typography, Box, CardActionArea, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";

import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";

import { useSelector } from "react-redux";

import ButtonTemplate from "../components/atoms/Button-template";
import ModalChooseIcon from "../components/molecules/Modal-chooseIcon-appearance";
import ModalFormIconAppearance from "../components/molecules/Modal-formIcon-appearance";

import BackgroundAppearance from "../components/molecules/Background-appearance";
import ProfileAppearance from "../components/molecules/Profile-appearance";
import ButtonAppearance from "../components/molecules/Button-appearance";
import NavbarTemplate from "../components/organisms/Navbar-template";
import ContainerTemplate from "../components/atoms/Container-template";
import PhoneAppearance from "../components/molecules/Phone-appearance";

const iconsData = [
  { Icon: EmailIcon, name: "Email", type: "email" },
  { Icon: FacebookIcon, name: "Facebook", type: "text" },
  { Icon: GitHubIcon, name: "GitHub", type: "text" },
  { Icon: InstagramIcon, name: "Instagram", type: "text" },
  { Icon: LinkedInIcon, name: "LinkedIn", type: "text" },
  { Icon: TwitterIcon, name: "Twitter", type: "text" },
  { Icon: WhatsAppIcon, name: "WhatsApp", type: "number" },
  { Icon: YouTubeIcon, name: "YouTube", type: "text" },
];

const Appearance = () => {
  document.title = "LinkHub | Appearance";
  const navigate = useNavigate();

  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );
  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );

  //modal
  const [isModalIconOpen, setIsModalIconOpen] = React.useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);

  //props
  const [type, setType] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [getId, setGetId] = React.useState("");
  const [getUrl, setGetUrl] = React.useState("");

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
          padding: { md: "0 5vw", sm: "0 5vw", xs: 0 },
        }}>
        <Grid container spacing={2} sx={{ paddingX: "5vh" }}>
          <Grid item md={8} sm={12} xs={12}>
            <ProfileAppearance />
            <Typography variant="h5" mt={3} fontWeight="bold">
              Social Icons
            </Typography>
            <Paper
              elevation={0}
              sx={{
                width: { md: "80%", sm: "80%", xs: "100%" },
                height: "auto",
                bgcolor: "background.default2",
                borderRadius: "20px",
                mt: "1%",
                p: { md: "3%", sm: "3%", xs: "5%" },
                marginBottom: "5%",
              }}>
              <Typography variant="body1" fontWeight="bold">
                Be iconic
              </Typography>
              <Typography variant="subtitle1">
                Add icons linking to your social profiles, email, etc
              </Typography>

              <ButtonTemplate
                title="Add icon"
                onClick={() => setIsModalIconOpen(true)}
                sx={{ marginBottom: "3%" }}
              />

              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "auto",
                }}>
                {getPostDataRedux?.SocialMedia?.map((item, key) => {
                  const matchingIcon = iconsData.find(
                    (icon) => icon.name === item.platform
                  );
                  if (!matchingIcon) return null;

                  const IconComponent = matchingIcon.Icon;

                  return (
                    <CardActionArea
                      key={key}
                      onClick={() => {
                        setTitle(item?.platform);
                        setGetId(item?.id);
                        setGetUrl(item?.url);

                        if (item?.platform == "WhatsApp") {
                          setType("number");
                        } else if (item?.platform == "Email") {
                          setType("email");
                        } else {
                          setType("text");
                        }
                        setIsModalEditOpen(true);
                      }}
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}>
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <IconComponent sx={{ marginY: 2, marginX: 1 }} />
                        <Typography variant="body1" sx={{ marginLeft: 1 }}>
                          {item?.platform}
                        </Typography>
                      </Box>
                      <EditIcon />
                    </CardActionArea>
                  );
                })}
              </Box>
            </Paper>

            <BackgroundAppearance />

            <ButtonAppearance />

            <ModalChooseIcon
              open={isModalIconOpen}
              onClose={() => setIsModalIconOpen(false)}
              forceClose={() => setIsModalIconOpen(false)}
              forceOpen={() => setIsModalIconOpen(true)}
            />

            <ModalFormIconAppearance
              open={isModalEditOpen}
              onClose={() => setIsModalEditOpen(false)}
              interactType="Edit"
              _onClick={() => setIsModalEditOpen(false)}
              success={(e) => {
                if (e) {
                  setIsModalEditOpen(false);
                }
              }}
              type={type}
              title={title}
              id={getId}
              url={getUrl}
            />
          </Grid>
          <Grid
            item
            md={4}
            sm={0}
            xs={0}
            sx={{
              display: { md: "block", sm: "none", xs: "none" },
            }}>
            <PhoneAppearance />
          </Grid>
        </Grid>
      </ContainerTemplate>
    </>
  );
};

export default Appearance;
