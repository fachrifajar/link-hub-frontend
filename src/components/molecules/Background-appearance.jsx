import React from "react";
import axios from "axios";
import {
  Typography,
  Paper,
  Box,
  Radio,
  RadioGroup,
  FormControl,
  InputAdornment,
  FormControlLabel,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import * as postReducer from "../../store/reducer/post";
import * as authReducer from "../../store/reducer/auth";
import { debounce } from "lodash";

import TextFieldTemplate from "../atoms/Textfield-template";

const BackgroundAppearance = () => {
  const dispatch = useDispatch();

  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);
  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );

  const [getBg, setGetBg] = React.useState("");
  const [getBg_color, setGetBg_color] = React.useState("");
  const [getBg_direction, setGetBg_direction] = React.useState("");

  const handleEditStyle = async (newAccessToken, value, key) => {
    try {
      let accessToken;
      if (newAccessToken?.length) {
        accessToken = newAccessToken;
      } else {
        accessToken = getAuthDataRedux?.accessToken;
      }

      const requestBody = {
        post_id: getPostDataRedux?.id,
      };

      const updatedPostItem = {
        ...getPostDataRedux,
      };

      if (value) {
        if (key === "bg") {
          requestBody.bg = value;
          updatedPostItem.bg = value;
        }
        if (key === "bg_color") {
          requestBody.bg_color = value;
          updatedPostItem.bg_color = value;
        }
        if (key === "bg_direction") {
          requestBody.bg_direction = value;
          updatedPostItem.bg_direction = value;
        }
      } else {
        if (getBg) {
          requestBody.bg = getBg;
          updatedPostItem.bg = getBg;
        } else if (getBg_color) {
          requestBody.bg_color = getBg_color;
          updatedPostItem.bg_color = getBg_color;
        } else if (getBg_direction) {
          requestBody.bg_direction = getBg_direction;
          updatedPostItem.bg_direction = getBg_direction;
        }
      }

      const response = await axios.patch(
        `${import.meta.env.VITE_BASE_URL}/post/edit`,
        requestBody,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log("response-handleEditStyle", response);

      dispatch(
        postReducer.setPost({
          data: {
            item: updatedPostItem,
          },
        })
      );
    } catch (error) {
      console.log("error-handleEditStyle", error);

      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        handleRefToken(value, key);
      }
    }
  };

  const debouncedHandleEditStyle = debounce(handleEditStyle, 300);

  const handleRefToken = async (value, key) => {
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

      handleEditStyle(newAccessToken, value, key);
    } catch (error) {
      setIsLoadingDelete(false);
      console.log("error-HandleRefToken", error);
      const errMsg = error?.response?.data?.message;

      if (errMsg === "Token Expired") {
        console.log("HARUS LOGOUT");
      }
    }
  };

  return (
    <>
      <Typography variant="h5" mt={3} fontWeight="bold">
        Backgrounds
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
          marginBottom: "5%",
        }}>
        <Box display="flex" direction="row" justifyContent="space-evenly">
          <Box
            onClick={() => {
              setGetBg("flat");
              handleEditStyle(undefined, "flat", "bg");
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}>
            <Box
              sx={{
                bgcolor: getPostDataRedux?.bg !== "flat" && "#3d444b",
                height: { md: "30vh", sm: "30vh", xs: "27vh" },
                width: { md: "150px", sm: "150px", xs: "100px" },
                borderRadius: "10px",

                borderColor: "background.default3",
                borderStyle: getPostDataRedux?.bg == "flat" && "solid",
                borderWidth: 1,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              {getPostDataRedux?.bg === "flat" && (
                <Box
                  sx={{
                    bgcolor: "#3d444b",
                    height: { md: "27vh", sm: "27vh", xs: "24vh" },
                    width: { md: "130px", sm: "130px", xs: "80px" },
                    borderRadius: "10px",
                  }}
                />
              )}
            </Box>
            <Typography variant="body1" mt={1}>
              Flat Colour
            </Typography>
          </Box>

          <Box
            onClick={() => {
              setGetBg("gradient");
              handleEditStyle(undefined, "gradient", "bg");
            }}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              cursor: "pointer",
            }}>
            <Box
              sx={{
                backgroundImage:
                  getPostDataRedux?.bg === "flat" &&
                  "linear-gradient(to bottom, #3d444b, lightgray)",
                height: { md: "30vh", sm: "30vh", xs: "27vh" },
                width: { md: "150px", sm: "150px", xs: "100px" },
                borderRadius: "10px",

                borderColor: "background.default3",
                borderStyle: getPostDataRedux?.bg !== "flat" && "solid",
                borderWidth: 1,

                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}>
              {getPostDataRedux?.bg !== "flat" && (
                <Box
                  sx={{
                    backgroundImage:
                      "linear-gradient(to bottom, #3d444b, lightgray)",

                    height: { md: "27vh", sm: "27vh", xs: "24vh" },
                    width: { md: "130px", sm: "130px", xs: "80px" },
                    borderRadius: "10px",
                  }}
                />
              )}
            </Box>
            <Typography variant="body1" mt={1}>
              Gradient Colour
            </Typography>
          </Box>
        </Box>

        <Typography variant="body1" fontWeight="bold" my={2}>
          Direction
        </Typography>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={getPostDataRedux?.bg_direction}
            name="radio-buttons-group">
            <FormControlLabel
              disabled={getPostDataRedux?.bg !== "gradient" && true}
              sx={{ marginBottom: 1 }}
              value="gradientUp"
              defaultChecked={getPostDataRedux?.bg_direction}
              control={<Radio />}
              onClick={(e) => {
                setGetBg_direction(e.target.value);
                handleEditStyle(undefined, e.target.value, "bg_direction");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: { md: "50px", sm: "50px", xs: "40px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      backgroundImage:
                        "linear-gradient(to top, #3d444b, lightgray)",
                      marginRight: "5px",
                      borderRadius: "10px",
                    }}
                  />
                  Gradient Up
                </Box>
              }
            />
            <FormControlLabel
              disabled={getPostDataRedux?.bg !== "gradient" && true}
              value="gradientBottom"
              defaultChecked={getPostDataRedux?.bg_direction}
              control={<Radio />}
              onClick={(e) => {
                setGetBg_direction(e.target.value);
                handleEditStyle(undefined, e.target.value, "bg_direction");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    sx={{
                      width: { md: "50px", sm: "50px", xs: "40px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      backgroundImage:
                        "linear-gradient(to bottom, #3d444b, lightgray)",
                      marginRight: "5px",
                      borderRadius: "10px",
                    }}
                  />
                  Gradient Down
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="body1" fontWeight="bold" my={2}>
          Color
        </Typography>
        <TextFieldTemplate
          fullWidth={true}
          value={getPostDataRedux?.bg_color}
          defaultValue={getPostDataRedux?.bg_color}
          onChange={(e) => {
            setGetBg_color(e.target.value);
            debouncedHandleEditStyle(undefined, e.target.value, "bg_color");
          }}
          type="color"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  style={{
                    backgroundColor: getPostDataRedux?.bg_color,
                    width: "30px",
                    height: "30px",
                    display: "inline-block",
                    borderRadius: "50%",
                    marginRight: "8px",
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            width: { md: "50%", sm: "50%", xs: "70%" },
            display: "flex",
            justifyContent: "center",
          }}
        />
      </Paper>
    </>
  );
};

export default BackgroundAppearance;
