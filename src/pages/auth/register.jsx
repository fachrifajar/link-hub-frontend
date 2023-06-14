import React from "react";
import {
  Box,
  Typography,
  useMediaQuery,
  Card,
  Paper,
  Stack,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import theme from "../../theme";

import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import GoogleIcon from "@mui/icons-material/Google";

import NavbarTemplate from "../../components/organisms/Navbar-template";
import ContainerTemplate from "../../components/atoms/Container-template";
import TextFieldTemplate from "../../components/atoms/Textfield-template";
import ButtonTemplate from "../../components/atoms/Button-template";

import {
  createUserWithEmailAndPassword,
  updateProfile,
  sendEmailVerification,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
} from "firebase/auth";
import { auth } from "../../config/firebase";

const Register = () => {
  document.title = "Register";
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isDisabled, setIsDisabled] = React.useState(true);
  const [isModalSuccess, setIsModalSuccess] = React.useState(false);
  const [isModalErr, setIsModalErr] = React.useState({
    isErr: false,
    errMsg: "",
  });

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

  const handleClickShowPassword = () => {
    setPwd((prevValue) => ({
      ...prevValue,
      showPwd: !pwd?.showPwd,
    }));
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const handleRegister = () => {
    // const email = email?.value;
    // const password = pwd?.value;

    setIsLoading(true);

    createUserWithEmailAndPassword(auth, email?.value, pwd?.value)
      .then((userCredential) => {
        // setShowModal(true);

        const user = userCredential.user;
        console.log("user,", user);
        updateProfile(auth.currentUser, {
          displayName: username?.value,
        }).then(() => {
          setIsLoading(false);

          // useDb.sendData("users", {
          //   ...usersList,
          //   [user.uid]: {
          //     emailVerified: user.emailVerified,
          //     email: user.email,
          //     user_id: user.uid,
          //     profile_picture: "null",
          //     fullname: user.displayName,
          //     providerId: "email/pass",
          //     created_at: user?.auth?.currentUser?.reloadUserInfo?.createdAt,
          //     password: user?.auth?.currentUser?.reloadUserInfo?.passwordHash,
          //     is_online: false,
          //     friend_list: "null",
          //   },
          // });

          console.log("auth,", auth);
          console.log("email,", email?.value);
          console.log("password,", pwd?.value);
          setIsLoading(false);
          // Send confirmation email
          sendEmailVerification(auth.currentUser)
            .then(() => {
              console.log("Verification email sent successfully");
            })
            .catch((error) => {
              console.error("Error sending verification email:", error);
            });
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        setIsLoading(false);

        // if (errorMessage == "Firebase: Error (auth/invalid-email).") {
        //   setIsErrorEmail(true);
        //   setErrorMessageEmail("Please enter a valid email address");
        // } else if (errorCode == "auth/email-already-in-use") {
        //   setIsErrorEmail(true);
        //   setErrorMessageEmail("Email already in use");
        // } else {
        //   setIsErrorPass(true);
        //   setErrorMessagePass("Password should be at least 6 characters ");
        // }

        console.log("error,", error);
        console.log("errorCode,", errorCode);
        console.log("errorMessage,", errorMessage);
      });
  };

  const handleRegisterGoogle = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        // useDb.sendData("users", {
        //   ...usersList,
        //   [user.uid]: {
        //     emailVerified: user.emailVerified,
        //     email: user.email,
        //     created_at: new Date().getTime(),
        //     user_id: user.uid,
        //     profile_picture: user.photoURL,
        //     fullname: user.displayName,
        //     is_online: false,
        //     friend_list: "null",
        //   },
        // });
        // router.push("/auth/login");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;

        const credential = GoogleAuthProvider.credentialFromError(error);
      });
  };

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
        }}>
        <Paper
          elevation={2}
          sx={{
            // width: { md: "25vw", sm: "50vw", xs: "100vw" },
            width: "400px",
            height: "auto",
            padding: { md: "3%", sm: "3%", xs: "10%" },
            marginTop: "5vh",
            bgcolor: "background.default",
            borderRadius: "20px",
            display: "flex",
            // alignItems: "center",
            textAlign: "center",
            // justifyContent: "center",
            flexDirection: "column",
            maxHeight: "100vh",
            overflow: "auto",
          }}>
          <Typography
            variant="h4"
            fontWeight="bold"
            sx={{
              color: "text.contrastText",
              textAlign: "flex-start",
              marginBottom: "5%",

              // mr: 3,
              // , mr: { md: 15, sm: 10, xs: 10 }
            }}>
            {/* <ArrowBackIosNewIcon
                sx={{
                  cursor: "pointer",
                  fontSize: "large",
                  // mr: 3,
                  // mr: { md: 15, sm: 10, xs: 10 },
                }}
              /> */}
            Register
          </Typography>

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
            placeholder="Enter your Password"
            type="password"
          />

          <ButtonTemplate
            title="REGISTER"
            onClick={handleRegister}
            isLoading={isLoading}
            endIcon={<ArrowForwardIcon />}
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
            isLoading={isLoading}
            startIcon={<GoogleIcon />}
            variant="outlined"
            sx={{ color: "primary.main", marginBottom: "5%" }}
          />
        </Paper>
      </ContainerTemplate>
    </>
  );
};

export default Register;
