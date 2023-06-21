import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import * as postReducer from "../../store/reducer/post";
import { debounce } from "lodash";
import {
  Box,
  Stack,
  Typography,
  useMediaQuery,
  InputAdornment,
} from "@mui/material";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import CardTemplate from "../atoms/Card-template";
import ButtonTemplate from "../atoms/Button-template";
import CircularProgressTemplate from "../atoms/CircularProgress-template";
import TextFieldTemplate from "../atoms/Textfield-template";

import DeleteIcon from "@mui/icons-material/Delete";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";

const DragAndDrop = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isXs = useMediaQuery("(max-width: 600px)");

  const [getAuthDataRedux, setGetAuthDataRedux] = useState(
    useSelector((state) => state?.auth?.data?.data)
  );

  const [getId, setGetId] = useState("");
  const [title, setTitle] = useState({ value: "", key: "" });
  const [url, setUrl] = useState({ value: "", key: "" });
  const [isInitialRender, setIsInitialRender] = useState(false);
  const [itemData, setItemData] = useState([]);
  const [clickedId, setClickedId] = useState("");
  const [isLoadingEdit, setIsLoadingEdit] = useState({
    isLoadingEdit: false,
    isLoadingEditKey: "",
  });
  const [isLoadingDelete, setIsLoadingDelete] = useState({
    isLoadingDelete: false,
    isLoadingDeleteKey: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [modalErr, setModalErr] = useState({
    errMsg: "",
    isErr: false,
  });

  const handleDragEnd = useCallback(
    (result) => {
      if (!result.destination) return;

      const items = Array.from(itemData);
      const [reorderedItem] = items.splice(result.source.index, 1);
      items.splice(result.destination.index, 0, reorderedItem);

      setItemData(items);
    },
    [itemData]
  );

  const handleDeleteCard = useCallback(
    (id) => {
      const updatedItemData = itemData.filter((item) => item.id !== id);
      setItemData(updatedItemData);
      handleDeleteItem(id);
    },
    [itemData]
  );

  const handleTitleChange = useCallback(
    debounce((e, id) => {
      setTitle((prevTitle) => ({
        ...prevTitle,
        value: e.target.value,
        key: id,
      }));
    }, 300),
    []
  );

  const handleUrlChange = useCallback(
    debounce((e, id) => {
      setUrl((prevTitle) => ({
        ...prevTitle,
        value: e.target.value,
        key: id,
      }));
    }, 300),
    []
  );

  const handleEditItem = async (id, newAccessToken) => {
    try {
      let accessToken;
      if (newAccessToken) {
        accessToken = newAccessToken;
      }
      accessToken = getAuthDataRedux?.accessToken;
      setIsLoadingEdit({
        isLoadingEdit: true,
        isLoadingEditKey: id,
      });

      let titlePrevValue;
      let urlPrevValue;
      for (let i = 0; i < itemData?.length; i++) {
        if (itemData[i]?.id === title?.key) {
          titlePrevValue = itemData[i]?.title;
          urlPrevValue = itemData[i]?.url;
        }
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/item/edit`,
        {
          title: title?.value !== "" ? title?.value : titlePrevValue,
          item_id: id,
          url: url?.value !== "" ? url?.value : urlPrevValue,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      handleGetItem();
      setIsLoadingEdit({
        isLoadingEdit: false,
        isLoadingEditKey: id,
      });
    } catch (error) {
      setIsLoadingEdit({
        isLoadingEdit: false,
        isLoadingEditKey: id,
      });
      console.log("error-handleEditItem", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("edit");
      } else {
        setModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

  const handleDeleteItem = async (id, newAccessToken) => {
    try {
      let accessToken;
      if (newAccessToken) {
        accessToken = newAccessToken;
      }
      accessToken = getAuthDataRedux?.accessToken;
      setIsLoadingDelete({
        isLoadingDelete: true,
        isLoadingDeleteKey: id,
      });
      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/item/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      handleGetItem();
      setIsLoadingDelete({
        isLoadingDelete: false,
        isLoadingDeleteKey: id,
      });
    } catch (error) {
      setIsLoadingDelete({
        isLoadingDelete: false,
        isLoadingDeleteKey: id,
      });
      console.log("error-handleDeleteItem", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("delete");
      } else {
        setModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

  const handleGetItem = async (newAccessToken, init) => {
    try {
      if (init) setIsInitialRender(true);

      const getUrl = window.location.href.split("/");
      const id = getUrl[getUrl.length - 1];
      setGetId(id);

      let accessToken;
      if (newAccessToken) {
        accessToken = newAccessToken;
      }
      accessToken = getAuthDataRedux?.accessToken;

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/item/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setItemData(response?.data?.data?.item);

      if (init) setIsInitialRender(false);
    } catch (error) {
      if (init) setIsInitialRender(false);
      console.log("error-handleGetItem", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("get", true);
      }
    }
  };

  const handleAddItem = async (newAccessToken) => {
    try {
      setIsLoading(true);

      let accessToken;
      if (newAccessToken) {
        accessToken = newAccessToken;
      }
      accessToken = getAuthDataRedux?.accessToken;
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/item/add`,
        {
          title: "",
          url: "",
          post_id: getId,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      handleGetItem();
      setIsLoading(false);
    } catch (error) {
      console.log("error-handleAddItem", error);

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

  const handleRefToken = async (fetchType, init) => {
    try {
      if (init) setIsInitialRender(true);
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
        handleGetItem(newAccessToken);
      } else if (fetchType === "post") {
        handleAddItem(newAccessToken);
      } else if (fetchType === "edit") {
        handleEditItem(newAccessToken);
      } else if (fetchType === "delete") {
        handleDeleteItem(newAccessToken);
      }
    } catch (error) {
      if (init) setIsInitialRender(false);
      console.log("error-HandleRefToken", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        console.log("HARUS LOGOUT");
      }
    }
  };

  useEffect(() => {
    if (!getAuthDataRedux) {
      navigate("/login");
    }
    handleGetItem(undefined, true);
  }, []);

  return (
    <>
      <ButtonTemplate
        title="Add Item"
        startIcon={<AddIcon />}
        onClick={handleAddItem}
        isLoading={isLoading}
        sx={{
          width: "100%",
          fontSize: { md: "18px", sm: "18px", xs: "16px" },
          marginBottom: "5%",
        }}
      />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="cards">
          {(provided) => (
            <Box {...provided.droppableProps} ref={provided.innerRef}>
              {itemData?.length && !isInitialRender ? (
                itemData?.map((item, index) => {
                  const updatedTime = new Date(item?.updated_at);
                  const formattedDate = updatedTime.toLocaleString("en-US", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                  });
                  return (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}>
                      {(provided, snapshot) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}>
                          <CardTemplate
                            sx={{
                              width: "100%",
                              cursor: "default",
                            }}
                            icon={
                              <Box {...provided.dragHandleProps}>
                                <DragIndicatorIcon />
                              </Box>
                            }>
                            <Stack
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                width: !isXs ? "70%" : "100%",
                              }}>
                              <TextFieldTemplate
                                label="Title"
                                variant="standard"
                                margin="none"
                                defaultValue={item?.title}
                                onChange={(e) => handleTitleChange(e, item?.id)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <EditIcon />
                                    </InputAdornment>
                                  ),
                                  inputProps: {
                                    sx: {
                                      color: "text.primary",
                                    },
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
                                  maxWidth: !isXs ? "70%" : "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              />
                              <TextFieldTemplate
                                label="URL"
                                variant="standard"
                                margin="none"
                                defaultValue={item?.url}
                                onChange={(e) => handleUrlChange(e, item?.id)}
                                InputProps={{
                                  endAdornment: (
                                    <InputAdornment position="end">
                                      <EditIcon />
                                    </InputAdornment>
                                  ),
                                  inputProps: {
                                    sx: {
                                      color: "text.primary",
                                    },
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
                                  maxWidth: !isXs ? "70%" : "100%",
                                  display: "flex",
                                  justifyContent: "space-between",
                                }}
                              />

                              <Typography
                                variant="body1"
                                color="text.secondary"
                                sx={{ marginTop: "3%", fontSize: "14px" }}>
                                {item?.created_at !== item?.updated_at
                                  ? "last Update"
                                  : "Created"}
                                : <i>{formattedDate}</i>
                              </Typography>
                            </Stack>

                            <Stack
                              spacing={2}
                              sx={{
                                flex: 1,
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: "space-between",
                                flexDirection: isXs ? "row-reverse" : "column",
                                mt: isXs ? 2 : 0,
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
                                  handleEditItem(item?.id);
                                  setClickedId(item?.id);
                                }}
                                sx={{
                                  marginTop: 0,
                                  width: "100px",
                                }}
                              />
                              <ButtonTemplate
                                title="Delete"
                                color="error"
                                variant="outlined"
                                isLoading={
                                  isLoadingDelete?.isLoadingDelete &&
                                  item?.id ===
                                    isLoadingDelete?.isLoadingDeleteKey
                                }
                                onClick={() => {
                                  handleDeleteCard(item?.id);
                                  setClickedId(item?.id);
                                }}
                                startIcon={<DeleteIcon />}
                                sx={{
                                  marginTop: 0,
                                  width: "100px",
                                }}
                              />
                            </Stack>
                          </CardTemplate>
                        </Box>
                      )}
                    </Draggable>
                  );
                })
              ) : isInitialRender ? (
                <CircularProgressTemplate />
              ) : (
                <Box sx={{ display: "flex", justifyContent: "center" }}>
                  <img src="/post_null2.png" alt="post_null2" />
                </Box>
              )}

              {provided.placeholder}
            </Box>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default DragAndDrop;
