import React from "react";
import axios from "axios";
import {
  Avatar,
  Paper,
  Stack,
  Typography,
  FormLabel,
  FormControlLabel,
  Switch,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import * as postReducer from "../../store/reducer/post";
import { darken } from "polished";
import theme from "../../theme";

import TextFieldTemplate from "../atoms/Textfield-template";
import ButtonTemplate from "../atoms/Button-template";
import ModalProfileAppearance from "../molecules/Modal-profile-appearance";
import ModalErrorTemplate from "./Modal-error-template";

const ProfileAppearance = () => {
  const dispatch = useDispatch();

  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);
  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );

  // theme
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  //modal
  const [isModalProfileOpen, setIsModalProfileOpen] = React.useState(false);
  const [isModalErrOpen, setIsModalErrOpen] = React.useState({
    isErr: false,
    errMsg: "",
  });

  //edit profile
  const [editTitle, setEditTitle] = React.useState("");
  const [editUsername, setEditUsername] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
  });
  const [isLoadingEdit, setIsLoadingEdit] = React.useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = React.useState("");
  const [isDisabled, setIsDisabled] = React.useState(true);

  //edit title availability
  const [isShowTitle, setIsShowTitle] = React.useState(
    getPostDataRedux?.use_title
  );

  //for default value content
  const color = theme(mode).palette.text.secondary;
  const darkenedColor = darken(0.3, color);

  const handleChangeName = (event) => {
    const newValue = event.target.value;
    const strRegex = /^(?!.*[_.]{2})[A-Za-z0-9][A-Za-z0-9_.]{3,18}[A-Za-z0-9]$/;

    if (!strRegex.test(newValue)) {
      if (!newValue.length) {
        setEditUsername((prevValue) => ({
          ...prevValue,
          isErr: false,
          errMsg: "",
          value: "",
        }));
      } else {
        setEditUsername((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg:
            "Name must start with a letter or number, and can only contain letters, numbers, underscores, and periods. It should be between 5-20 characters long.",
          value: "",
        }));
      }
    } else {
      setEditUsername((prevValue) => ({
        ...prevValue,
        isErr: false,
        errMsg: "",
        value: newValue,
      }));
    }
  };

  const handleEditProfile = async (newAccessToken) => {
    try {
      setIsLoadingEdit(true);
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      if (editTitle) {
        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/post/edit`,
          {
            post_id: getPostDataRedux?.id,
            title: editTitle,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        dispatch(
          postReducer.setPost({
            data: {
              item: {
                ...getPostDataRedux,
                title: editTitle,
              },
            },
          })
        );
        setIsLoadingEdit(false);
      }
      if (editUsername?.value.length) {
        const response = await axios.patch(
          `${import.meta.env.VITE_BASE_URL}/edit`,
          {
            username: editUsername?.value,
          },
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        dispatch(
          authReducer.setAuth({
            data: {
              ...getAuthDataRedux,
              username: editUsername?.value,
            },
          })
        );

        setIsLoadingEdit(false);
      }
    } catch (error) {
      console.log("error-handleEditProfile", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("edit");
      } else {
        setIsLoadingEdit(false);
        setIsModalErrOpen((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

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

  const handleShowTitle = async (newAccessToken, params) => {
    try {
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/post/edit`,
        {
          post_id: getPostDataRedux?.id,
          use_title: params,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      dispatch(
        postReducer.setPost({
          data: {
            item: {
              ...getPostDataRedux,
              use_title: !getPostDataRedux?.use_title,
            },
          },
        })
      );
    } catch (error) {
      console.log("error-handleShowTitle", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("other");
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
      } else if (fetchType === "other") {
        handleShowTitle(newAccessToken);
      } else {
        handleEditProfile(newAccessToken);
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

  React.useEffect(() => {
    if (editTitle || editUsername?.value) {
      setIsDisabled(false);
    }
  }, [editTitle, editUsername?.value]);

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
          p: { md: "3%", sm: "3%", xs: "5%" },
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
          <TextFieldTemplate
            label="Username"
            size="small"
            defaultValue={getAuthDataRedux?.username}
            onChange={handleChangeName}
            error={editUsername?.isErr}
            helperText={editUsername?.errMsg}
            InputProps={{
              inputProps: {
                maxLength: 20,
              },
            }}
          />

          <TextFieldTemplate
            label="Post Title"
            size="small"
            defaultValue={getPostDataRedux?.title}
            onChange={(e) => {
              setEditTitle(e.target.value);
            }}
            InputProps={{
              inputProps: {
                maxLength: 20,
              },
            }}
          />

          <FormLabel component="legend">Show Title</FormLabel>
          <FormControlLabel
            control={
              <Switch
                checked={isShowTitle}
                onChange={() => {
                  setIsShowTitle(!isShowTitle);
                  handleShowTitle(undefined, !isShowTitle);
                }}
              />
            }
          />

          <ButtonTemplate
            title="Save"
            color="success"
            disabled={isDisabled}
            isLoading={isLoadingEdit}
            onClick={handleEditProfile}
          />
        </Stack>
      </Paper>

      <ModalProfileAppearance
        open={isModalProfileOpen}
        onClose={() => setIsModalProfileOpen(false)}
        success={(e) => {
          if (e) {
            setIsModalProfileOpen(false);
          }
        }}
      />

      <ModalErrorTemplate
        open={isModalErrOpen?.isErr}
        onClose={() => {
          setIsModalErrOpen((prevValue) => ({
            ...prevValue,
            isErr: false,
          }));
        }}
        text={isModalErrOpen?.errMsg}
      />
    </>
  );
};

export default ProfileAppearance;
