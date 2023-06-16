import React from "react";
import {
  Typography,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
  useMediaQuery,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";
import axios from "axios";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

import NavbarTemplate from "../../components/organisms/Navbar-template";
import ContainerTemplate from "../../components/atoms/Container-template";
import TextFieldTemplate from "../../components/atoms/Textfield-template";
import ButtonTemplate from "../../components/atoms/Button-template";
import PaperTemplate from "../../components/atoms/Paper-template";
import ModalErrorTemplate from "../../components/organisms/Modal-error-template";
import ModalSuccessTemplate from "../../components/organisms/Modal-success-template";

import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../../config/firebase";

const Register = () => {
  document.title = "Register";
  const navigate = useNavigate();
  const isXs = useMediaQuery("(max-width: 600px)");
  const [mode, setMode] = React.useState(
    localStorage.getItem("selectedTheme") || "light"
  );

  const [email, setEmail] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
  });
  const [username, setUsername] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
  });
  const [pwd, setPwd] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
    showPwd: false,
  });
  const [confirmPwd, setConfirmPwd] = React.useState({
    isErr: false,
    errMsg: "",
    value: "",
  });

  const [isLoading, setIsLoading] = React.useState(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isModalSuccess, setIsModalSuccess] = React.useState(false);
  const [isModalErr, setIsModalErr] = React.useState({
    isErr: false,
    errMsg: "",
  });
  const [isResendLoading, setIsResendLoading] = React.useState(false);

  const handleChangeName = (event) => {
    const newValue = event.target.value;
    const strRegex = /^(?!(?:.*\s){3})[A-Za-z][A-Za-z\s\d]{5,25}$/;

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
            "Name must contain only letters & numbers and letters. Start with a letter and be between 5-20 characters long",
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
    const strRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!strRegex.test(newValue)) {
      if (!newValue.length) {
        setPwd((prevValue) => ({
          ...prevValue,
          isErr: false,
          errMsg: "",
          value: "",
        }));
      } else {
        setPwd((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg:
            "Password min 8 characters & must contain combination of letters, numbers, uppercase and symbol",
          value: "",
        }));
      }
    } else {
      setPwd((prevValue) => ({
        ...prevValue,
        isErr: false,
        value: newValue,
        errMsg: "",
      }));
    }
  };

  const handleChangeConfirmPassword = (event) => {
    const newValue = event.target.value;

    if (newValue === pwd?.value) {
      setConfirmPwd((prevValue) => ({
        ...prevValue,
        isErr: false,
        errMsg: "",
        value: newValue,
      }));
    } else if (newValue !== pwd?.value) {
      setConfirmPwd((prevValue) => ({
        ...prevValue,
        isErr: true,
        errMsg: "Password-Confirmation does'nt match with Password",
        value: "",
      }));
    }
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

  const handleRegister = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          email: email?.value,
          username: username?.value,
          pwd: pwd?.value,
        }
      );
      firebaseAuth();
    } catch (error) {
      setIsLoading(false);
      setIsModalErr((prevValue) => ({
        ...prevValue,
        isErr: true,
        errMsg: error?.response?.data?.message?.message,
      }));
      console.log(error);
    }
  };

  const firebaseAuth = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email?.value,
        pwd?.value
      );
      // const user = userCredential.user;
      // console.log("user,", user);

      setIsLoading(false);
      setIsModalSuccess(true);

      // Send confirmation email
      try {
        await sendEmailVerification(auth.currentUser);
        console.log("Verification email sent successfully");
      } catch (error) {
        console.error("Error sending verification email:", error);
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  const handleResend = () => {
    setIsResendLoading(true);
    sendEmailVerification(auth.currentUser)
      .then(() => {
        setIsResendLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsResendLoading(false);
      });
  };

  const handleRegisterGoogle = async () => {
    try {
      setIsLoadingGoogle(true);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log(user);

      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/auth/register`,
        {
          email: user?.email,
          username: "",
          pwd: "",
        }
      );

      console.log(response);
      setIsLoadingGoogle(false);
    } catch (error) {
      setIsLoadingGoogle(false);
      console.log(error);
      if (
        error?.response?.data?.message?.message === "Email already registered"
      ) {
        // navigate("/login");
        setIsModalErr((prevValue) => ({
          ...prevValue,
          isErr: true,
          errMsg: "Sorry, your Google Account is already registered.",
        }));
      }
    }
  };

  React.useEffect(() => {
    if (email?.value && username?.value && pwd?.value && confirmPwd?.value) {
      setIsDisabled(false);
    } else {
      setIsDisabled(true);
    }
  }, [email?.value, username?.value, pwd?.value, confirmPwd?.value]);

  return (
    <>
      <NavbarTemplate _setTheme={mode} getTheme={(e) => setMode(e)} />

      <ContainerTemplate
        _setTheme={mode}
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          // minHeight: "90vh",

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
        <PaperTemplate title="Register" onClick={() => navigate("/login")}>
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
            label="Username"
            placeholder="Enter your Username"
            onChange={handleChangeName}
            error={username?.isErr}
            helperText={username?.errMsg}
            InputProps={{
              inputProps: {
                maxLength: 25,
              },
            }}
          />
          <TextFieldTemplate
            variant="standard"
            label="Password"
            placeholder="Enter your Password"
            type={pwd?.showPwd ? "text" : "password"}
            onChange={handleChangePassword}
            error={pwd?.isErr}
            helperText={pwd?.errMsg}
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

          <TextFieldTemplate
            variant="standard"
            label="Password Confirmation"
            placeholder="Enter your Confirmation Password"
            type="password"
            onChange={handleChangeConfirmPassword}
            error={confirmPwd?.isErr}
            helperText={confirmPwd?.errMsg}
            disabled={pwd?.value ? false : true}
          />

          <ButtonTemplate
            title="REGISTER"
            onClick={handleRegister}
            isLoading={isLoading}
            // endIcon={<ArrowForwardIcon />}
            disabled={isDisabled}
            sx={{ bgcolor: "primary.main", marginBottom: "5%" }}
          />

          <Divider>
            <Typography variant="body1" color="textSecondary">
              Register with
            </Typography>
          </Divider>

          <ButtonTemplate
            title="GOOGLE"
            onClick={handleRegisterGoogle}
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

        <ModalSuccessTemplate
          text="Verification Email sent!"
          open={isModalSuccess}>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ marginTop: "5%" }}>
            Please wait approximately <strong>1 minute</strong> and check your
            Inbox/Spam folder.
            <br />
            <br />
            <Typography variant="body1">
              Still have not received the Email ? Click the button below to
              resend.
            </Typography>
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center">
            <ButtonTemplate
              title="Resend"
              onClick={handleResend}
              isLoading={isResendLoading}
              variant="outlined"
              sx={{ width: "40%" }}
            />
            <ButtonTemplate
              title="Already received"
              onClick={() => navigate("/login")}
              sx={{ width: "40%" }}
            />
          </Stack>
        </ModalSuccessTemplate>
      </ContainerTemplate>
    </>
  );
};

export default Register;
