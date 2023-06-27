import React from "react";
import { Modal, Card, styled, Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import * as postReducer from "../../store/reducer/post";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import TextFieldTemplate from "../atoms/Textfield-template";
import ButtonTemplate from "../atoms/Button-template";
import ModalErrorTemplate from "./Modal-error-template";

import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import CloseIcon from "@mui/icons-material/Close";

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "30vh",
});

const MyCard = styled(Card)({
  textAlign: "center",
  borderRadius: "20px",
  padding: "30px 50px",
  overflowY: "auto",
  width: "500px",
});

const ModalFormIconAppearance = ({
  open,
  onClose,
  type,
  title,
  onClick,
  _onClick,
  success,
  interactType,
  id,
  url,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);

  const [value, setValue] = React.useState({
    value: "",
    isLoading: false,
    isDisabled: true,
  });
  const [isLoadingDelete, setIsLoadingDelete] = React.useState(false);
  const [modalLogout, setModalLogout] = React.useState(false);

  const handleChangeValue = (event) => {
    const newValue = event.target.value;

    if (type === "number") {
      setValue((prevValue) => ({
        ...prevValue,
        value: `https://api.whatsapp.com/send?phone=${newValue}`,
      }));
    } else {
      setValue((prevValue) => ({
        ...prevValue,
        value: newValue,
      }));
    }
  };

  const handleGetPost = async (newAccessToken) => {
    try {
      const getUrl = window.location.href.split("/");
      const id = getUrl[getUrl.length - 1];

      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/post`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const filterData = response?.data?.data?.post.filter(
        (item) => item?.id === id
      );
      const fixedData = filterData?.[0];

      dispatch(postReducer.deletePost());
      dispatch(
        postReducer.setPost({
          data: {
            item: fixedData,
          },
        })
      );
      setValue((prevValue) => ({
        ...prevValue,
        isLoading: false,
      }));
      setIsLoadingDelete(false);
      success(true);
    } catch (error) {
      console.log("error-handleGetPost", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("get");
      }
    }
  };

  const handleAddSocmed = async (newAccessToken) => {
    try {
      setValue((prevValue) => ({
        ...prevValue,
        isLoading: true,
      }));

      const getUrl = window.location.href.split("/");
      const id = getUrl[getUrl.length - 1];

      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/socmed/add`,
        {
          platform: title,
          url: value?.value,
          post_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      handleGetPost();
      setValue((prevValue) => ({
        ...prevValue,
        isLoading: false,
      }));
    } catch (error) {
      console.log("error-handleAddSocmed", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        handleRefToken("post");
      } else {
        setValue((prevValue) => ({
          ...prevValue,
          isLoading: false,
        }));
      }
    }
  };

  const handleDeleteSocmed = async (newAccessToken) => {
    try {
      setIsLoadingDelete(true);

      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/socmed/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      handleGetPost();
    } catch (error) {
      console.log("error-handleDeleteSocmed", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        handleRefToken("delete");
      } else {
        setIsLoadingDelete(false);
      }
    }
  };

  const handleEditSocmed = async (newAccessToken) => {
    try {
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      setValue((prevValue) => ({
        ...prevValue,
        isLoading: true,
      }));

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/socmed/edit`,
        {
          platform: title,
          url: value?.value,
          socmed_id: id,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log(response);
      handleGetPost();
    } catch (error) {
      console.log("error-handleEditSocmed", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        handleRefToken("edit");
      } else {
        setValue((prevValue) => ({
          ...prevValue,
          isLoading: false,
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
        handleAddSocmed(newAccessToken);
      } else if (fetchType === "delete") {
        handleDeleteSocmed(newAccessToken);
      } else {
        handleEditSocmed(newAccessToken);
      }
    } catch (error) {
      console.log("error-HandleRefToken", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        dispatch(authReducer.deleteAuth());
        setModalLogout(true);
      }
    }
  };

  React.useEffect(() => {
    if (value?.value.length !== 0) {
      setValue((prevValue) => ({
        ...prevValue,
        isDisabled: false,
      }));
    } else if (value?.value?.length === 0) {
      setValue((prevValue) => ({
        ...prevValue,
        isDisabled: true,
      }));
    }
  }, [value?.value]);

  return (
    <>
      <MyModal open={open} onClose={onClose}>
        <MyCard>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}>
            <ChevronLeftIcon
              onClick={onClick}
              sx={{
                cursor: "pointer",
                display: interactType !== "Add" && "none",
              }}
            />
            {interactType !== "Add" && <Box></Box>}
            <Typography variant="h5" fontWeight="bold">
              {interactType} {title}
            </Typography>
            <CloseIcon sx={{ cursor: "pointer" }} onClick={_onClick} />
          </Box>

          <TextFieldTemplate
            label={
              type === "number"
                ? `Enter ${title} Number*`
                : type === "email"
                ? `Enter ${title} address*`
                : `Enter ${title} URL*`
            }
            variant="filled"
            fullWidth={true}
            onChange={handleChangeValue}
            defaultValue={interactType === "Edit" ? url : null}
            type={
              type === "number" ? "number" : type === "email" ? "email" : "text"
            }
            sx={{ mt: 3 }}
          />
          {interactType === "Add" ? (
            <ButtonTemplate
              title="Add to Linkhub"
              fullWidth={true}
              disabled={value?.isDisabled}
              isLoading={value?.isLoading}
              onClick={handleAddSocmed}
            />
          ) : (
            <>
              <ButtonTemplate
                title="Save"
                fullWidth={true}
                disabled={value?.isDisabled}
                isLoading={value?.isLoading}
                onClick={handleEditSocmed}
              />
              <ButtonTemplate
                title="Remove"
                variant="outlined"
                fullWidth={true}
                isLoading={isLoadingDelete}
                onClick={handleDeleteSocmed}
                sx={{ marginTop: "2%" }}
              />
            </>
          )}
        </MyCard>

        <ModalErrorTemplate open={modalLogout} text="Session Expired">
          <ButtonTemplate
            title="LOGIN"
            sx={{ width: "50%" }}
            onClick={() => navigate("/login")}
          />
        </ModalErrorTemplate>
      </MyModal>
    </>
  );
};

export default ModalFormIconAppearance;
