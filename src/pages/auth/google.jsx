import React from "react";
import axios from "axios";
import { Grid, Typography, useMediaQuery } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import * as authReducer from "../../store/reducer/auth";
import { useNavigate } from "react-router-dom";

import NavbarTemplate from "../../components/organisms/Navbar-template";
import ContainerTemplate from "../../components/atoms/Container-template";
import TextFieldTemplate from "../../components/atoms/Textfield-template";
import ButtonTemplate from "../../components/atoms/Button-template";
import ModalSuccessTemplate from "../../components/molecules/Modal-success-template";
import ModalErrorTemplate from "../../components/molecules/Modal-error-template";

import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

const Google = () => {
  document.title = "LinkHub | New User";
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );
  const isXs = useMediaQuery("(max-width: 600px)");
  const isSm = useMediaQuery("(min-width: 601px) and (max-width: 930px)");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [modalLogout, setModalLogout] = React.useState(false);
  const [username, setUsername] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
    isDisabled: true,
  });

  const [authDataRedux, setAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );

  const [isLoading, setIsLoading] = React.useState(false);

  const [isSuccess, setIsSuccess] = React.useState(false);

  const handleChangeName = (event) => {
    const newValue = event.target.value;
    const strRegex = /^(?!.*[_.]{2})[A-Za-z0-9][A-Za-z0-9_.]{3,18}[A-Za-z0-9]$/;

    if (!strRegex.test(newValue)) {
      if (!newValue.length) {
        setUsername((prevValue) => ({
          ...prevValue,
          isErr: false,
          errMsg: "",
          value: "",
        }));
      } else {
        setUsername((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg:
            "Name must start with a letter or number, and can only contain letters, numbers, underscores, and periods. It should be between 5-20 characters long.",
          value: "",
        }));
      }
    } else {
      setUsername((prevValue) => ({
        ...prevValue,
        isErr: false,
        value: newValue,
        errMsg: "",
      }));
    }
  };

  const handleSubmit = async (newAccessToken) => {
    try {
      setUsername((prevValue) => ({
        ...prevValue,
        isErr: false,
      }));
      setIsSuccess(false);
      setIsLoading(true);
      let accessToken = authDataRedux?.accessToken;

      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/edit`,
        {
          username: username?.value,
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const newUsername = response?.data?.data?.username;

      dispatch(
        authReducer.setAuth({
          data: {
            ...authDataRedux,
            username: newUsername,
          },
        })
      );
      setIsSuccess(true);

      setIsLoading(false);
    } catch (error) {
      setIsSuccess(false);
      setIsLoading(false);
      console.log("error-handleSubmit", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        handleRefToken();
      } else if (errMsg == "That username is already taken") {
        setUsername((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg,
        }));
      }
    }
  };

  const handleRefToken = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/auth/refresh`,
        {
          withCredentials: true,
        }
      );
      const newAccessToken = response?.data?.data?.getRefreshToken;

      setAuthDataRedux((prevAuthData) => ({
        ...prevAuthData,
        accessToken: newAccessToken,
      }));

      handleSubmit(newAccessToken);
    } catch (error) {
      console.log("error-HandleRefToken", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg == "Token Expired") {
        dispatch(authReducer.deleteAuth());
        setModalLogout(true);
      }
    }
  };

  React.useEffect(() => {
    if (!authDataRedux) {
      navigate("/login");
    }

    if (username?.value) {
      setUsername((prevValue) => ({
        ...prevValue,
        isDisabled: false,
      }));
    } else {
      setUsername((prevValue) => ({
        ...prevValue,
        isDisabled: true,
      }));
    }
  }, [username?.value]);

  return (
    <>
      <NavbarTemplate
        _setTheme={mode}
        getTheme={(e) => setMode(e)}
        getAuthDataRedux={(e) => {
          setAuthDataRedux(e);
        }}
      />
      <ContainerTemplate
        _setTheme={mode}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <Grid container flexDirection={isXs ? "column-reverse" : "row"}>
          <Grid
            md={8}
            sm={12}
            xs={12}
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
            // height="90vh"
          >
            <Typography
              variant={!isXs ? "h3" : "h4"}
              fontWeight={1000}
              mb={2}
              color="text.primary"
              textAlign="center"
              sx={{
                "& span": {
                  color: "primary.main",
                },
              }}>
              Welcome to <span>LinkHub!</span>
            </Typography>
            <Typography
              variant={!isXs ? "body1" : "body2"}
              color="text.secondary"
              mb={2}
              textAlign="center">
              Choose your Linkhub username. You can always change it later.
            </Typography>
            <TextFieldTemplate
              label="Username"
              placeholder="Change your Username"
              fullWidth={true}
              variant="filled"
              sx={{
                maxWidth: !isXs ? "80%" : "100%",
              }}
              onChange={handleChangeName}
              error={username?.isErr}
              helperText={username?.errMsg}
              InputProps={{
                inputProps: {
                  maxLength: 20,
                },
              }}
            />

            <ButtonTemplate
              title="Submit"
              sx={{
                fontSize: !isXs ? "18px" : "16px",
                maxWidth: !isXs ? "80%" : "100%",
              }}
              fullWidth={true}
              disabled={username?.isDisabled}
              onClick={handleSubmit}
              isLoading={isLoading}
            />
          </Grid>
          <Grid
            md={4}
            sm={0}
            xs={0}
            display="flex"
            justifyContent="center"
            alignItems="center"
            sx={{
              "& img": {
                width: isXs ? "80%" : isSm ? "90%" : "inherit",
                mb: 3,
              },
            }}>
            {mode === "light" ? (
              <img src="/auth.png" alt="auth-img" />
            ) : (
              <img src="/auth2.png" alt="auth2-img" />
            )}
          </Grid>
        </Grid>
        <ModalSuccessTemplate
          text="Username successfully changed"
          open={isSuccess}>
          <ButtonTemplate
            title="Get Started"
            color="success"
            sx={{ width: "100%", fontSize: "18px" }}
            endIcon={<ArrowRightAltIcon />}
            onClick={() => {
              navigate("/admin");
            }}
          />
        </ModalSuccessTemplate>

        <ModalErrorTemplate open={modalLogout} text="Session Expired">
          <ButtonTemplate
            title="LOGIN"
            sx={{ width: "50%" }}
            onClick={() => navigate("/login")}
          />
        </ModalErrorTemplate>
      </ContainerTemplate>
    </>
  );
};

export default Google;
