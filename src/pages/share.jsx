import React from "react";
import axios from "axios";

import { Box, Avatar, Typography, Skeleton, Link } from "@mui/material";
import { lighten, darken } from "polished";
import ButtonTemplate from "../components/atoms/Button-template";

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";

import NavbarTemplate from "../components/organisms/Navbar-template";
import ModalErrorTemplate from "../components/molecules/Modal-error-template";
import CircularProgressTemplate from "../components/atoms/CircularProgress-template";

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

const Share = () => {
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [isModalErrOpen, setIsModalErrOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const [getData, setGetData] = React.useState([]);
  const [getDataUser, setGetDataUser] = React.useState([]);
  document.title = `LinkHub | @${getDataUser?.username}`;

  const [fontColor, setFontColor] = React.useState({
    original: "",
    darken: "",
  });

  const [bgStyle, setBgStyle] = React.useState("");
  const [buttonOption, setButtonOption] = React.useState("");
  const [borderRadiusOption, setBorderRadiusOption] = React.useState("");

  const handleGetPost = async (id) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post/${id}`
      );

      const _getData = response?.data?.data?.post?.[0];

      setGetDataUser(response?.data?.data?.user);
      setGetData(_getData);

      const bgDirection = _getData?.bg_direction;
      const bg_dir = bgDirection === "gradientUp" ? "to top" : "to bottom";

      const fontColor = _getData?.font_color;
      const darkenFontColor = darken(0.1, fontColor);
      setFontColor({
        original: fontColor,
        darken: darkenFontColor,
      });

      const hexColor = _getData?.bg_color;
      const lightenedColor = lighten(0.4, hexColor);
      const gradientStyle = {
        backgroundImage: `linear-gradient(${bg_dir}, ${hexColor}, ${lightenedColor})`,
      };

      const bgStyle =
        _getData?.bg === "flat" ? { bgcolor: hexColor } : gradientStyle;
      setBgStyle(bgStyle);

      const buttonOption = _getData?.button_option?.split("-")[0];
      const borderRadiusOption = _getData?.button_option?.split("-")[1];

      setButtonOption(buttonOption);
      setBorderRadiusOption(borderRadiusOption);

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("error-handleGetPost", error);

      if (error?.message === "Network Error") {
        setIsModalErrOpen(true);
      }
    }
  };

  React.useEffect(() => {
    const getUrl = window.location.href.split("/");
    const splitUrl = getUrl[getUrl.length - 1];
    const id = splitUrl.split("-")[1];

    console.log(getUrl[getUrl.length - 1]);

    handleGetPost(id);
  }, []);

  return (
    <>
      <NavbarTemplate _setTheme={mode} getTheme={(e) => setMode(e)} />
      <Box
        sx={{
          ...bgStyle,
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "space-between",
          minHeight: "100vh",
          padding: 3,
        }}>
        {!isLoading ? (
          <>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
                width: "100%",
              }}>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  mb: { md: "1%", sm: "1%", xs: "5%" },
                  "& img": {
                    height: "90px",
                    width: "90px",
                    borderRadius: "100%",
                    objectFit: "cover",
                  },
                }}>
                {getDataUser?.profile_picture ? (
                  <img
                    src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                      getDataUser?.profile_picture
                    }`}
                    alt="user-profile_picture"
                  />
                ) : (
                  <Avatar
                    sx={{
                      bgcolor: "#000000",
                      color: "#FFFFFF",
                      height: "90px",
                      width: "90px",
                      fontSize: "40px",
                      fontWeight: "bold",
                    }}>
                    {getDataUser?.username?.[0].toUpperCase()}
                  </Avatar>
                )}
              </Box>

              <Typography
                variant="body1"
                component="div"
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  fontSize: "18px",
                  fontWeight: 600,
                  color: fontColor?.original,
                  mb: getData?.use_title == false && "10%",
                  "& span": {
                    letterSpacing: 1,
                  },
                }}>
                <span>@{getDataUser?.username}</span>
              </Typography>
              {getData?.use_title == true && (
                <Typography
                  variant="body1"
                  sx={{
                    fontSize: "16px",
                    color: fontColor?.original,
                    display: "flex",
                    justifyContent: "center",
                    mb: { md: "3%", sm: "3%", xs: "10%" },
                  }}>
                  {getData?.title}
                </Typography>
              )}

              {getData?.Item?.map((item, key) => (
                <a
                  target="_none"
                  href={item?.url}
                  key={key}
                  style={{ textDecoration: "none" }}>
                  <ButtonTemplate
                    variant={buttonOption === "fill" ? "contained" : "outlined"}
                    fullWidth={true}
                    title={item?.title}
                    sx={{
                      bgcolor:
                        buttonOption === "fill"
                          ? getData?.button_color
                          : "none",
                      color: getData?.button_font_color,
                      borderRadius: borderRadiusOption,
                      "&:hover": {
                        bgcolor: darken(0.1, getData?.button_color),
                      },
                      marginTop: "0px",
                      mb: { md: "1%", sm: "1%", xs: "3%" },
                      fontSize: "12px",
                      width: { md: "500px", sm: "500px", xs: "80%" },
                      height: "7vh",
                      fontSize: "16px",
                    }}
                  />
                </a>
              ))}
            </Box>

            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "flex-end",
                width: "100%",
                marginTop: { md: "5%", sm: "5%", xs: "10%" },
              }}>
              {getData?.SocialMedia?.map((item, index) => {
                const matchingIcon = iconsData.find(
                  (icon) => icon.name === item.platform
                );
                const IconComponent = matchingIcon?.Icon;

                if (!matchingIcon) {
                  return null;
                }

                return (
                  <>
                    <Link
                      href={item?.url}
                      target="_blank"
                      rel="noopener noreferrer">
                      <IconComponent
                        key={index}
                        sx={{
                          color: fontColor?.original,
                          marginX: 1,
                          cursor: "pointer",
                          "&:hover": {
                            color: fontColor?.darken,
                          },
                          fontSize: "30px",
                        }}
                      />
                    </Link>
                  </>
                );
              })}
            </Box>
          </>
        ) : (
          <>
            <CircularProgressTemplate />
          </>
        )}
      </Box>
      <ModalErrorTemplate
        open={isModalErrOpen}
        onClose={() => setIsModalErrOpen(false)}
        text="URL NOT FOUND"
        sx={{
          width: "100vw",
          height: "100vh",
          marginTop: "30vh",
          borderRadius: 0,
        }}
      />
    </>
  );
};

export default Share;
