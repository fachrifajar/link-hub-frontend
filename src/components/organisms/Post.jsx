import React from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import * as authReducer from "../../store/reducer/auth";

import {
  Box,
  Card,
  Stack,
  Typography,
  InputAdornment,
  CardActionArea,
} from "@mui/material";
import ButtonTemplate from "../atoms/Button-template";
import ModalErrorTemplate from "./Modal-error-template";
import TextFieldTemplate from "../atoms/Textfield-template";

import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import HighlightAltIcon from "@mui/icons-material/HighlightAlt";
const Post = () => {
  document.title = "LinkHub | Post";
  const dispatch = useDispatch();

  const [getAuthDataRedux, setGetAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );
  const [postData, setPostData] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);

  const [title, setTitle] = React.useState({
    value: "",
    key: "",
  });

  const [color, setColor] = React.useState({
    value: "",
    key: "",
  });

  const [clickedId, setClickedId] = React.useState("");
  const [isLoadingEdit, setIsLoadingEdit] = React.useState({
    isLoadingEdit: false,
    isLoadingEditKey: "",
  });
  const [isLoadingDelete, setIsLoadingDelete] = React.useState({
    isLoadingDelete: false,
    isLoadingDeleteKey: "",
  });

  const [modalErr, setModalErr] = React.useState({
    errMsg: "",
    isErr: false,
  });

  const handleEditPost = async (id, newAccessToken) => {
    try {
      const accessToken = newAccessToken || getAuthDataRedux?.accessToken;
      setIsLoadingEdit({
        isLoadingEdit: true,
        isLoadingEditKey: id,
      });

      const colorValue = color?.value || "#FFFFFF";
      console.log(colorValue);
      console.log(title?.value);
      console.log(id);
      console.log(accessToken);
      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/post/edit`,
        {
          title: title?.value,
          post_id: id,
          bg_color: color?.value,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      handleGetPost();
      setIsLoadingEdit({
        isLoadingEdit: false,
        isLoadingEditKey: id,
      });
    } catch (error) {
      setIsLoadingEdit({
        isLoadingEdit: false,
        isLoadingEditKey: id,
      });
      console.log("error-handleEditPost", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("edit");
      } else {
        setIsLoading(false);
        setModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

  const handleDeletePost = async (id, newAccessToken) => {
    try {
      const accessToken = newAccessToken || getAuthDataRedux?.accessToken;
      setIsLoadingDelete({
        isLoadingDelete: true,
        isLoadingDeleteKey: id,
      });
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/post/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      handleGetPost();
      setIsLoadingDelete({
        isLoadingDelete: false,
        isLoadingDeleteKey: id,
      });
    } catch (error) {
      setIsLoadingDelete({
        isLoadingDelete: false,
        isLoadingDeleteKey: id,
      });
      console.log("error-handleDeletePost", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("delete");
      } else {
        setIsLoading(false);
        setModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

  const handleGetPost = async (newAccessToken) => {
    try {
      const accessToken = newAccessToken || getAuthDataRedux?.accessToken;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const postItems = response?.data?.data?.post;

      setPostData(postItems);

      const initialColors = postItems.map((item) => item?.bg_color);
      setColor(initialColors);
    } catch (error) {
      console.log("error-handleGetPost", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        handleRefToken("get");
      }
    }
  };

  const handleAddPost = async (newAccessToken) => {
    try {
      setIsLoading(true);
      const accessToken = newAccessToken || getAuthDataRedux?.accessToken;

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/post/add`,
        {
          title: "",
          bg_color: "#FFFFFF",
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      handleGetPost();
      setIsLoading(false);
    } catch (error) {
      console.log("error-handleAddPost", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        handleRefToken("post");
      } else {
        setIsLoading(false);
        setModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

  const handleRefToken = async (fetchType) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh/${getAuthDataRedux?.id}`
      );
      const newAccessToken = response?.data?.data?.getRefreshToken;

      setGetAuthDataRedux((prevAuthData) => ({
        ...prevAuthData,
        accessToken: newAccessToken,
      }));

      dispatch(
        authReducer.setAuth({
          data: {
            ...getAuthDataRedux,
            accessToken: newAccessToken,
          },
        })
      );

      if (fetchType === "get") {
        handleGetPost(newAccessToken);
      } else if (fetchType === "post") {
        handleAddPost(newAccessToken);
      } else if (fetchType === "delete") {
        handleDeletePost(clickedId, newAccessToken);
      } else {
        handleEditPost(clickedId, newAccessToken);
      }
    } catch (error) {
      setIsLoading(false);

      console.log("error-HandleRefToken", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        console.log("HARUS LOGOUT");
      }
    }
  };

  React.useEffect(() => {
    handleGetPost();
  }, []);

  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column">
        <ButtonTemplate
          title="Add Post"
          disabled={postData?.length === 3 ? true : false}
          isLoading={isLoading}
          onClick={handleAddPost}
          startIcon={<AddIcon />}
          sx={{
            width: "60%",
            fontSize: { md: "18px", sm: "18px", xs: "16px" },
            marginBottom: "5%",
          }}
        />
        {postData?.map((item, key) => {
          const createdTime = new Date(item?.created_at);
          const formattedDate = createdTime.toLocaleString("en-US", {
            day: "numeric",
            month: "long",
            year: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          });

          return (
            <>
              <Card
                key={item?.id}
                sx={{
                  width: "60%",
                  marginBottom: "1%",
                  borderRadius: "10px",
                  bgcolor: "background.default2",
                  display: "flex",
                  flexDirection: "row",
                  px: 3,
                  py: 1,
                }}>
                <CardActionArea
                  onClick={() => console.log(item?.title)}
                  sx={{
                    width: "5%",
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    mr: 5,
                  }}>
                  <HighlightAltIcon />
                </CardActionArea>

                <Stack
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    width: "50%",
                  }}>
                  <TextFieldTemplate
                    label="Title"
                    variant="standard"
                    margin="none"
                    defaultValue={item?.title}
                    onChange={(e) => {
                      setTitle({
                        value: e.target.value,
                        key: item?.id,
                      });
                    }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <EditIcon />
                        </InputAdornment>
                      ),
                      inputProps: {
                        maxLength: 20,
                      },
                    }}
                    sx={{
                      "& .MuiInput-underline": {
                        "&:before, &:after": {
                          borderBottom: "none",
                        },
                      },
                      "& .MuiInput-underline:hover:before, & .MuiInput-underline:hover:after":
                        {
                          border: "none",
                          borderBottom: "none",
                        },
                      width: "auto",
                      maxWidth: "70%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  />
                  <TextFieldTemplate
                    label="Theme Color"
                    variant="standard"
                    value={color[key]}
                    defaultValue={item?.bg_color}
                    onChange={(e) => {
                      setColor({
                        value: e.target.value,
                        key: item?.id,
                      });
                    }}
                    type="color"
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <span
                            style={{
                              backgroundColor: color[key],
                              width: "24px",
                              height: "24px",
                              display: "inline-block",
                              borderRadius: "50%",
                              marginRight: "8px",
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <EditIcon />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      "& .MuiInput-underline": {
                        "&:before, &:after": {
                          borderBottom: "none",
                        },
                      },
                      "& .MuiInput-underline:hover:before, & .MuiInput-underline:hover:after":
                        {
                          border: "none",
                          borderBottom: "none",
                        },
                      width: "auto",
                      maxWidth: "70%",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  />
                  <Typography
                    variant="body1"
                    color="text.secondary"
                    sx={{ marginY: "2%" }}>
                    Created: <i>{formattedDate}</i>
                  </Typography>
                </Stack>

                <Stack
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "space-around",
                  }}>
                  <ButtonTemplate
                    title="Change"
                    startIcon={<AddIcon />}
                    color="success"
                    isLoading={
                      isLoadingEdit?.isLoadingEdit &&
                      item?.id === isLoadingEdit?.isLoadingEditKey
                    }
                    onClick={() => {
                      handleEditPost(item?.id);
                      setClickedId(item?.id);
                    }}
                    sx={{
                      marginTop: 0,
                    }}
                  />
                  <ButtonTemplate
                    title="Delete"
                    color="error"
                    variant="outlined"
                    isLoading={
                      isLoadingDelete?.isLoadingDelete &&
                      item?.id === isLoadingDelete?.isLoadingDeleteKey
                    }
                    onClick={() => {
                      handleDeletePost(item?.id);
                      setClickedId(item?.id);
                    }}
                    startIcon={<DeleteIcon />}
                    sx={{
                      marginTop: 0,
                    }}
                  />
                </Stack>
              </Card>
            </>
          );
        })}
        <ModalErrorTemplate
          open={modalErr?.isErr}
          onClose={() => {
            setModalErr((prevValue) => ({
              ...prevValue,
              isErr: false,
            }));
          }}
          text={modalErr?.errMsg}
        />
      </Box>
    </>
  );
};

export default Post;
