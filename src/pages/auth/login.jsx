import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { InputAdornment, IconButton, Divider, Typography } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";

import ContainerTemplate from "../../components/atoms/Container-template";
import ButtonTemplate from "../../components/atoms/Button-template";
import TextFieldTemplate from "../../components/atoms/Textfield-template";
import PaperTemplate from "../../components/atoms/Paper-template";
import NavbarTemplate from "../../components/organisms/Navbar-template";
import ModalErrorTemplate from "../../components/organisms/Modal-error-template";
import ModalSuccessTemplate from "../../components/organisms/Modal-success-template";

import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../config/firebase";

import { useDispatch, useSelector } from "react-redux";
import * as authReducer from "../../store/reducer/auth";

const Login = () => {
  document.title = "Login";
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );

  const [email, setEmail] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
  });

  const [pwd, setPwd] = React.useState({
    value: "",
    showPwd: false,
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isModalSuccess, setIsModalSuccess] = React.useState(false);
  const [isModalErr, setIsModalErr] = React.useState({
    isErr: false,
    errMsg: "",
  });
  const [authData, setAuthData] = React.useState(null);

  const handleChangeEmail = (event) => {
    const newValue = event.target.value;
    const strRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!strRegex.test(newValue)) {
      if (!newValue.length) {
        setEmail((prevValue) => ({
          ...prevValue,
          isErr: false,
          errMsg: "",
          value: "",
        }));
      } else {
        setEmail((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg: "Please input Valid Email Address",
          value: "",
        }));
      }
    } else {
      setEmail((prevValue) => ({
        ...prevValue,
        isErr: false,
        value: newValue,
        errMsg: "",
      }));
    }
  };

  const handleChangePassword = (event) => {
    const newValue = event.target.value;
    setPwd((prevValue) => ({
      ...prevValue,
      value: newValue,
    }));
  };

  const handleClickShowPassword = () => {
    setPwd((prevValue) => ({
      ...prevValue,
      showPwd: !pwd?.showPwd,
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleLogin = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          email: email?.value,
          pwd: pwd?.value,
        }
      );
      // setIsLoading(false);
      console.log(response);
      setAuthData(response?.data?.data);
      firebaseAuth();
    } catch (error) {
      setIsLoading(false);
      setIsModalErr((prevValue) => ({
        ...prevValue,
        isErr: true,
        errMsg: error?.response?.data?.message,
      }));
      console.log(error);
    }
  };

  const firebaseAuth = () => {
    setIsLoading(true);

    signInWithEmailAndPassword(auth, email?.value, pwd?.value)
      .then((userCredential) => {
        onAuthStateChanged(auth, (user) => {
          if (user) {
            if (!user?.emailVerified) {
              console.log("NOT VERIFIED");
              setIsModalErr((prevValue) => ({
                ...prevValue,
                isErr: true,
                errMsg: "Email not verified. Please check your inbox",
              }));
            } else {
              dispatch(
                authReducer.setAuth({
                  data: authData,
                })
              );
              setIsModalSuccess(true);
            }
          }
        });
      })
      .finally(() => {
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log(error);
      });
  };

  React.useEffect(() => {
    if (email?.value && pwd?.value) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email?.value, pwd?.value]);

  return (
    <>
      <NavbarTemplate _setTheme={mode} getTheme={(e) => setMode(e)} />
      <ContainerTemplate
        _setTheme={mode}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        <PaperTemplate title="Login" onClick={() => navigate("/register")}>
          <TextFieldTemplate
            variant="standard"
            label="Email"
            placeholder="Enter your Email"
            onChange={handleChangeEmail}
            error={email?.isErr}
            helperText={email?.errMsg}
          />
          <TextFieldTemplate
            variant="standard"
            label="Password"
            placeholder="Enter your Password"
            type={pwd?.showPwd ? "text" : "password"}
            onChange={handleChangePassword}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}>
                    {pwd?.showPwd ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              ),
              inputProps: {
                maxLength: 20,
              },
            }}
          />

          <ButtonTemplate
            title="LOGIN"
            onClick={handleLogin}
            isLoading={isLoading}
            // endIcon={<ArrowForwardIcon />}
            disabled={isDisabled}
            sx={{ bgcolor: "primary.main", marginBottom: "5%" }}
          />

          <Divider>
            <Typography variant="body1" color="textSecondary">
              Login with
            </Typography>
          </Divider>

          <ButtonTemplate
            title="GOOGLE"
            // onClick={handleRegisterGoogle}
            // isLoading={isLoading}
            startIcon={<GoogleIcon />}
            variant="outlined"
            sx={{ color: "primary.main", marginBottom: "5%" }}
          />
        </PaperTemplate>
        <ModalErrorTemplate
          open={isModalErr?.isErr}
          text={isModalErr?.errMsg}
          onClose={() =>
            setIsModalErr((prevValue) => ({
              ...prevValue,
              isErr: false,
            }))
          }
        />
        <ModalSuccessTemplate text="Login Successful!" open={isModalSuccess}>
          <ButtonTemplate
            title="Get Started"
            color="success"
            sx={{ width: "100%" }}
            endIcon={<ArrowRightAltIcon />}
            onClick={() => {
              navigate("/");
            }}
          />
        </ModalSuccessTemplate>
      </ContainerTemplate>
    </>
  );
};

export default Login;
