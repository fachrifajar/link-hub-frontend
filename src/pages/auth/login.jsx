import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
  InputAdornment,
  IconButton,
  Divider,
  Typography,
  useMediaQuery,
} from "@mui/material";
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
  document.title = "LinkHub | Login";
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isXs = useMediaQuery("(max-width: 600px)");
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );

  const [authDataRedux, setAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
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
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isModalSuccess, setIsModalSuccess] = React.useState(false);
  const [isModalErr, setIsModalErr] = React.useState({
    isErr: false,
    errMsg: "",
  });

  const [authData, setAuthData] = React.useState(null);
  const [redirect, setRedirect] = React.useState(null);

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
        },
        {
          withCredentials: true,
        }
      );
      // setIsLoading(false);
      console.log(response);
      setAuthData(response?.data?.data);

      const getAuthData = response?.data?.data

      firebaseAuth(getAuthData);
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

  const firebaseAuth = async (getAuthData) => {
    try {
      setIsLoading(true);

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email?.value,
        pwd?.value
      );
      const user = userCredential.user;

      onAuthStateChanged(auth, (user) => {
        if (user) {
          if (!user.emailVerified) {
            console.log("NOT VERIFIED");
            setIsModalErr((prevValue) => ({
              ...prevValue,
              isErr: true,
              errMsg: "EMAIL NOT VERIFIED \nPlease check your Inbox/Spam",
            }));
          } else {
            dispatch(
              authReducer.setAuth({
                data: getAuthData,
              })
            );
            setRedirect("/admin");
            setIsModalSuccess(true);
          }
        }
      });

      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const handleLoginGoogle = async () => {
    try {
      setIsLoadingGoogle(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/login`,
        {
          email: user?.email,
          pwd: import.meta.env.VITE_SECRET_PWD,
        },
        {
          withCredentials: true,
        }
      );

      dispatch(
        authReducer.setAuth({
          data: response?.data?.data,
        })
      );

      const validateUsername = response?.data?.data?.username.split("-")[0];

      if (validateUsername == "firebase") {
        setRedirect("/auth");
      } else {
        setRedirect("/admin");
      }

      setIsModalSuccess(true);
      setIsLoadingGoogle(false);
    } catch (error) {
      setIsLoadingGoogle(false);
      console.log(error);
      if (error?.response?.data?.message === "Email not found") {
        setIsModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg:
            "Sorry, your Google Account is not registered.\nPlease register your account first.",
        }));
        // navigate("/register");
      }
    }
  };

  React.useEffect(() => {
    if (authDataRedux) {
      navigate("/admin");
    }

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

          ...(isXs
            ? {}
            : {
                backgroundImage: `url(${
                  mode === "light" ? "/register.png" : "/register2.png"
                })`,
                backgroundSize: "auto",
                backgroundPosition: "left",
                backgroundPositionY: "5vh",
                backgroundPositionX: "3vw",
                backgroundRepeat: "no-repeat",
              }),
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
            onClick={handleLoginGoogle}
            isLoading={isLoadingGoogle}
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
            sx={{ width: "100%", fontSize: "18px" }}
            endIcon={<ArrowRightAltIcon />}
            onClick={() => {
              navigate(`${redirect}`);
            }}
          />
        </ModalSuccessTemplate>
      </ContainerTemplate>
    </>
  );
};

export default Login;
