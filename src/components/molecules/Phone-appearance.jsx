import React from "react";
import { Box, Avatar, Typography, Stack, Link } from "@mui/material";
import { useSelector } from "react-redux";
import { lighten, darken } from "polished";
import ButtonTemplate from "../atoms/Button-template";

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";

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

const PhoneAppearance = () => {
  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);

  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );

  const getItemDataRedux = useSelector(
    (state) => state?.item?.data?.data?.itemData
  );

  const bgDirection = getPostDataRedux?.bg_direction;
  const bg_dir = bgDirection === "gradientUp" ? "to top" : "to bottom";

  const fontColor = getPostDataRedux?.font_color;
  const darkenFontColor = darken(0.1, fontColor);

  const hexColor = getPostDataRedux?.bg_color;
  const lightenedColor = lighten(0.3, hexColor);
  const gradientStyle = {
    backgroundImage: `linear-gradient(${bg_dir}, ${hexColor}, ${lightenedColor})`,
  };
  const bgStyle =
    getPostDataRedux?.bg === "flat" ? { bgcolor: hexColor } : gradientStyle;

  const buttonOption = getPostDataRedux?.button_option?.split("-")[0];
  const borderRadiusOption = getPostDataRedux?.button_option?.split("-")[1];

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}>
      <Box
        display="flex"
        sx={{
          width: "230px",
          height: "60vh",
          ...bgStyle,
          borderColor: "background.default3",
          borderStyle: "solid",
          borderWidth: 10,
          borderRadius: "25px",
          mt: "40%",
          position: "fixed",
          overflow: "auto",

          "&::-webkit-scrollbar": {
            width: "0.1em",
            height: "0.5em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}>
        <Stack
          display="flex"
          direction="column"
          alignItems="center"
          justifyContent="space-between"
          sx={{
            p: 2,
            flex: 1,
            width: "100%",
            "& img": {
              height: "40px",
              width: "40px",
              borderRadius: "100%",
              objectFit: "cover",
            },
          }}>
          <Box>
            {getAuthDataRedux?.profile_picture ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <img
                  src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                    getAuthDataRedux?.profile_picture
                  }`}
                  alt="user-profile_picture"
                />
              </Box>
            ) : (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <Avatar
                  sx={{
                    bgcolor: "#000000",
                    color: "#FFFFFF",
                    height: "40px",
                    width: "40px",
                  }}>
                  {getAuthDataRedux?.username?.[0].toUpperCase()}
                </Avatar>
              </Box>
            )}

            <Typography
              variant="body1"
              component="div"
              sx={{
                display: "flex",
                justifyContent: "center",
                fontSize: "14px",
                fontWeight: 600,
                color: fontColor,
                mb: getPostDataRedux?.use_title == false && "10%",
                "& span": {
                  letterSpacing: 1,
                },
              }}>
              <span>@{getAuthDataRedux?.username}</span>
            </Typography>
            {getPostDataRedux?.use_title == true && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: "12px",
                  color: fontColor,
                  display: "flex",
                  justifyContent: "center",
                  mb: "10%",
                }}>
                {getPostDataRedux?.title}
              </Typography>
            )}

            {getItemDataRedux?.map((item, key) => (
              <>
                <ButtonTemplate
                  key={key}
                  variant={buttonOption === "fill" ? "contained" : "outlined"}
                  fullWidth={true}
                  title={item?.title}
                  sx={{
                    bgcolor:
                      buttonOption === "fill"
                        ? getPostDataRedux?.button_color
                        : "none",
                    color: getPostDataRedux?.button_font_color,
                    borderRadius: borderRadiusOption,
                    "&:hover": {
                      bgcolor: darken(0.1, getPostDataRedux?.button_color),
                    },
                    marginTop: "0px",
                    marginBottom: "5%",
                    fontSize: "12px",
                    width: "180px",
                  }}
                />
              </>
            ))}
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
              marginTop: "10%",
            }}>
            {getPostDataRedux?.SocialMedia?.map((item, index) => {
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
                      // color="action"
                      sx={{
                        color: fontColor,
                        marginX: 1,
                        cursor: "pointer",
                        "&:hover": {
                          color: darkenFontColor,
                        },
                      }}
                    />
                  </Link>
                </>
              );
            })}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default PhoneAppearance;
