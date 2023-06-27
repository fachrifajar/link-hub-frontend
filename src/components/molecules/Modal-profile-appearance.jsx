import React from "react";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import { Modal, Card, styled, Box, Typography } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import { useNavigate } from "react-router-dom";

import ButtonTemplate from "../atoms/Button-template";
import ModalErrorTemplate from "./Modal-error-template";

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const MyCard = styled(Card)({
  textAlign: "center",
  borderRadius: "20px",
  padding: "30px 50px",
  overflowY: "auto",
  width: "500px",
});

const ModalProfileAppearance = ({ open, onClose, success }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedImage, setSelectedImage] = React.useState(null);
  const [previewImage, setPreviewImage] = React.useState(null);
  const [isModalErrOpen, setIsModalErrOpen] = React.useState({
    isErr: false,
    errMsg: "",
  });
  const [modalLogout, setModalLogout] = React.useState(false);

  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewImage(null);
  };

  const onDrop = (acceptedFiles) => {
    const file = acceptedFiles[0];
    setSelectedImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setPreviewImage(reader.result);
    };
    reader.readAsDataURL(file);
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
      console.log(response?.data?.data?.profile_picture);
      setIsLoading(false);

      dispatch(
        authReducer.setAuth({
          data: {
            ...getAuthDataRedux,
            profile_picture: response?.data?.data?.profile_picture,
          },
        })
      );
      success(true);
    } catch (error) {
      console.log("error-handleGetData", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken("get");
      }
    }
  };

  const handleUploadData = async (newAccessToken) => {
    try {
      setIsLoading(true);
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/edit`,
        {
          profile_picture: selectedImage,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      handleGetData();
    } catch (error) {
      console.log("error-handleUploadData", error);

      const errMsg = error?.response?.data?.message;
      console.log(errMsg);
      if (errMsg === "Token Expired") {
        handleRefToken("post");
      } else {
        if (error?.response?.status === 413) {
          setIsLoading(false);
          setIsModalErrOpen((prevValue) => ({
            ...prevValue,
            isErr: true,
            errMsg:
              "Upload failed. IMG_5821.JPG is over the file size limit of 2 MB.",
          }));
        } else if (error?.response?.status === 422) {
          setIsLoading(false);
          setIsModalErrOpen((prevValue) => ({
            ...prevValue,
            isErr: true,
            errMsg:
              "Upload failed. Only .png, .jpg, .jpeg, .PNG, .JPG, .JPEG files allowed.",
          }));
        } else if (error?.response?.status === 500) {
          setIsLoading(false);
          setIsModalErrOpen((prevValue) => ({
            ...prevValue,
            isErr: true,
            errMsg: "Internal Server Error",
          }));
        }
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
      } else if (fetchType === "post") {
        handleUploadData(newAccessToken);
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
    if (selectedImage) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [selectedImage]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });
  return (
    <>
      <MyModal open={open} onClose={onClose}>
        <MyCard>
          <Box textAlign="center" sx={{ marginTop: "1%" }}>
            <Box
              {...getRootProps()}
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "50vh",
                border: "2px dashed",
                borderRadius: "8px",
                borderColor: isDragActive ? "primary.main" : "text.disabled",
                backgroundColor: isDragActive ? "primary.light" : "transparent",
                cursor: "pointer",
                marginTop: "10%",
                position: "relative",
                overflow: "hidden",
              }}>
              <input {...getInputProps()} />
              {selectedImage ? (
                <img
                  src={previewImage}
                  alt="Preview"
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              ) : isDragActive ? (
                <Typography variant="body1" color="primary">
                  Drop the file here
                </Typography>
              ) : (
                <Typography variant="body1" color="text.disabled">
                  Drag and drop a file here or click to browse
                </Typography>
              )}
            </Box>
            {selectedImage && (
              <Typography
                component="div"
                color="text.secondary"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "1%",
                }}>
                <ButtonTemplate
                  onClick={handleRemoveImage}
                  variant="outlined"
                  fullWidth="true"
                  title="Remove"
                  color="error"
                  sx={{
                    borderRadius: "5px",
                  }}
                />
              </Typography>
            )}
            <Box textAlign="center">
              <ButtonTemplate
                fullWidth="true"
                disabled={isDisabled}
                isLoading={isLoading}
                onClick={handleUploadData}
                title="Save"
                color="success"
                sx={{
                  borderRadius: "10px",
                }}
              />
            </Box>
          </Box>
        </MyCard>
      </MyModal>

      <ModalErrorTemplate
        open={isModalErrOpen?.isErr}
        onClose={() =>
          setIsModalErrOpen((prevValue) => ({
            ...prevValue,
            isErr: false,
          }))
        }
        text={isModalErrOpen?.errMsg}
      />

      <ModalErrorTemplate open={modalLogout} text="Session Expired">
        <ButtonTemplate
          title="LOGIN"
          sx={{ width: "50%" }}
          onClick={() => navigate("/login")}
        />
      </ModalErrorTemplate>
    </>
  );
};

export default ModalProfileAppearance;
