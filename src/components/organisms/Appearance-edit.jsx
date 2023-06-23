import React from "react";
import axios from "axios";
import {
  Avatar,
  Paper,
  Stack,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";

import theme from "../../theme";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import { darken } from "polished";

import TextFieldTemplate from "../atoms/Textfield-template";
import ButtonTemplate from "../atoms/Button-template";
import ModalAddTemplate from "./Modal-icon-template";
import ModalIconInteractTemplate from "./Modal-icon-interact-template";
import ModalProfileTemplate from "./Modal-profile-template";

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

const AppearanceEdit = () => {
  const dispatch = useDispatch();

  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);
  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );

  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const [isModalProfileOpen, setIsModalProfileOpen] = React.useState(false);
  const [isModalIconOpen, setIsModalIconOpen] = React.useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [title, setTitle] = React.useState("");
  const [getId, setGetId] = React.useState("");
  const [getUrl, setGetUrl] = React.useState("");
  const [isLoadingDelete, setIsLoadingDelete] = React.useState("");

  const color = theme(mode).palette.text.secondary;
  const darkenedColor = darken(0.3, color);

  const handleGetData = async (newAccessToken) => {
    try {
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      dispatch(
        authReducer.setAuth({
          data: {
            ...getAuthDataRedux,
            profile_picture: null,
          },
        })
      );
      setIsLoadingDelete(false);
    } catch (error) {
      setIsLoadingDelete(false);
      console.log("error-handleGetData", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("get");
      }
    }
  };

  const handleDeleteData = async (newAccessToken) => {
    try {
      setIsLoadingDelete(true);
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/images/delete`,
        {
          profile_picture: true,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      handleGetData();
    } catch (error) {
      console.log("error-handleDeleteData", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("delete");
      } else {
        setIsLoadingDelete(false);
      }
    }
  };

  const handleRefToken = async (fetchType) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh/${getAuthDataRedux?.id}`
      );
      const newAccessToken = response?.data?.data?.getRefreshToken;

      dispatch(
        authReducer.setAuth({
          data: {
            ...getAuthDataRedux,
            accessToken: newAccessToken,
          },
        })
      );

      if (fetchType === "get") {
        handleGetData(newAccessToken);
      } else if (fetchType === "delete") {
        handleDeleteData(newAccessToken);
      }
    } catch (error) {
      setIsLoadingDelete(false);
      console.log("error-HandleRefToken", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        console.log("HARUS LOGOUT");
      }
    }
  };

  return (
    <>
      <Typography variant="h5" mt={5} fontWeight="bold">
        Profile
      </Typography>
      <Paper
        elevation={0}
        sx={{
          width: { md: "80%", sm: "80%", xs: "100%" },
          height: "auto",
          bgcolor: "background.default2",
          borderRadius: "20px",
          mt: "1%",
          p: "3%",
        }}>
        <Stack
          direction="row"
          display="flex"
          alignItems="center"
          sx={{
            "& img": {
              height: { md: "100px", sm: "90px", xs: "80px" },
              width: { md: "120px", sm: "90px", xs: "80px" },
              mr: 3,
              borderRadius: "100%",
              objectFit: "cover",
            },
          }}>
          {getAuthDataRedux?.profile_picture ? (
            <img
              src={`${import.meta.env.VITE_CLOUDINARY_URL}${
                getAuthDataRedux?.profile_picture
              }`}
              alt="user-profile_picture"
            />
          ) : (
            <Avatar
              sx={{
                bgcolor: "#000000",
                color: "#FFFFFF",
                height: { md: "100px", sm: "90px", xs: "80px" },
                width: { md: "100px", sm: "90px", xs: "80px" },
                fontSize: "40px",
                mr: 3,
              }}>
              {getAuthDataRedux?.username?.[0].toUpperCase()}
            </Avatar>
          )}

          <Stack width="100%" spacing={{ md: 2, sm: 2, xs: 1 }}>
            <ButtonTemplate
              title="Pick an image"
              sx={{ mt: 0 }}
              onClick={() => setIsModalProfileOpen(true)}
            />
            <ButtonTemplate
              title="Remove"
              onClick={handleDeleteData}
              variant="outlined"
              isLoading={isLoadingDelete}
              disabled={!getAuthDataRedux?.profile_picture}
              sx={{
                mt: 0,
                color: "text.secondary",
                borderColor: "text.secondary",
                "&:hover": {
                  borderColor: darkenedColor,
                },
              }}
            />
          </Stack>
        </Stack>
        <Stack mt={{ md: 5, sm: 4, xs: 2 }}>
          <TextFieldTemplate label="Username" variant="filled" />
          <TextFieldTemplate label="Post Title" variant="filled" />
        </Stack>
      </Paper>

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
          p: "3%",
          marginBottom: "5%",
          //   height: "100vh",
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
          sx={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
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

      <ModalAddTemplate
        open={isModalIconOpen}
        onClose={() => setIsModalIconOpen(false)}
        forceClose={() => setIsModalIconOpen(false)}
        forceOpen={() => setIsModalIconOpen(true)}
      />

      <ModalIconInteractTemplate
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

      <ModalProfileTemplate
        open={isModalProfileOpen}
        onClose={() => setIsModalProfileOpen(false)}
        success={(e) => {
          if (e) {
            setIsModalProfileOpen(false);
          }
        }}
      />
    </>
  );
};

export default AppearanceEdit;
