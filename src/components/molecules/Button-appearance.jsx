import React from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import * as postReducer from "../../store/reducer/post";
import * as authReducer from "../../store/reducer/auth";
import { debounce } from "lodash";
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

import TextFieldTemplate from "../atoms/Textfield-template";

const ButtonAppearance = () => {
  const dispatch = useDispatch();

  const getAuthDataRedux = useSelector((state) => state?.auth?.data?.data);
  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );
  console.log(getPostDataRedux);

  const [getButton_color, setGetButton_color] = React.useState(
    getPostDataRedux?.button_color
  );
  const [getButton_font_color, setGetButton_font_color] = React.useState(
    getPostDataRedux?.button_font_color
  );
  const [getButton_option, setGetButton_option] = React.useState(
    getPostDataRedux?.button_option
  );
  const [getFont_color, setGetFont_color] = React.useState(
    getPostDataRedux?.font_color
  );

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
        if (key === "button_color") {
          requestBody.button_color = value;
          updatedPostItem.button_color = value;
        }
        if (key === "button_font_color") {
          requestBody.button_font_color = value;
          updatedPostItem.button_font_color = value;
        }
        if (key === "button_option") {
          requestBody.button_option = value;
          updatedPostItem.button_option = value;
        }
        if (key === "font_color") {
          requestBody.font_color = value;
          updatedPostItem.font_color = value;
        }
      } else {
        if (getButton_color) {
          requestBody.button_color = getButton_color;
          updatedPostItem.button_color = getButton_color;
        } else if (getButton_font_color) {
          requestBody.button_font_color = getButton_font_color;
          updatedPostItem.button_font_color = getButton_font_color;
        } else if (getButton_option) {
          requestBody.button_option = getButton_option;
          updatedPostItem.button_option = getButton_option;
        } else if (getFont_color) {
          requestBody.font_color = getFont_color;
          updatedPostItem.font_color = getFont_color;
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
        Buttons
      </Typography>
      <Paper
        elevation={0}
        sx={{
          width: { md: "80%", sm: "80%", xs: "100%" },
          height: "auto",
          bgcolor: "background.default2",
          borderRadius: "20px",
          mt: "1%",
          p: "3%",
          marginBottom: "5%",
        }}>
        <Typography variant="body1" fontWeight="bold" marginBottom={2}>
          Button Shape
        </Typography>
        <FormControl>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue={getPostDataRedux?.button_option}
            name="radio-buttons-group">
            <FormControlLabel
              sx={{ marginBottom: 2 }}
              value="fill-0px"
              defaultChecked={getPostDataRedux?.button_option}
              control={<Radio />}
              onClick={(e) => {
                setGetButton_option(e.target.value);
                handleEditStyle(undefined, e.target.value, "button_option");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    mr={1}
                    sx={{
                      width: { md: "150px", sm: "150px", xs: "120px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      bgcolor: "#3d444b",
                    }}
                  />
                  Fill Square
                </Box>
              }
            />
            <FormControlLabel
              sx={{ marginBottom: 2 }}
              value="fill-10px"
              defaultChecked={getPostDataRedux?.button_option}
              control={<Radio />}
              onClick={(e) => {
                setGetButton_option(e.target.value);
                handleEditStyle(undefined, e.target.value, "button_option");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    mr={1}
                    sx={{
                      width: { md: "150px", sm: "150px", xs: "120px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      bgcolor: "#3d444b",

                      borderRadius: "10px",
                    }}
                  />
                  Fill Semi Square
                </Box>
              }
            />
            <FormControlLabel
              sx={{ marginBottom: 2 }}
              value="fill-50px"
              defaultChecked={getPostDataRedux?.button_option}
              control={<Radio />}
              onClick={(e) => {
                setGetButton_option(e.target.value);
                handleEditStyle(undefined, e.target.value, "button_option");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    mr={1}
                    sx={{
                      width: { md: "150px", sm: "150px", xs: "120px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      bgcolor: "#3d444b",

                      borderRadius: "50px",
                    }}
                  />
                  Fill Round
                </Box>
              }
            />
            <FormControlLabel
              sx={{ marginBottom: 2 }}
              value="outlined-0px"
              defaultChecked={getPostDataRedux?.button_option}
              control={<Radio />}
              onClick={(e) => {
                setGetButton_option(e.target.value);
                handleEditStyle(undefined, e.target.value, "button_option");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    mr={1}
                    sx={{
                      width: { md: "150px", sm: "150px", xs: "120px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      borderColor: "#3d444b",
                      borderStyle: "solid",
                      borderWidth: 1,
                    }}
                  />
                  Outline Square
                </Box>
              }
            />
            <FormControlLabel
              sx={{ marginBottom: 2 }}
              value="outlined-10px"
              defaultChecked={getPostDataRedux?.button_option}
              control={<Radio />}
              onClick={(e) => {
                setGetButton_option(e.target.value);
                handleEditStyle(undefined, e.target.value, "button_option");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    mr={1}
                    sx={{
                      width: { md: "150px", sm: "150px", xs: "120px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      borderColor: "#3d444b",
                      borderStyle: "solid",
                      borderWidth: 1,
                      borderRadius: "10px",
                    }}
                  />
                  Outline Semi Square
                </Box>
              }
            />
            <FormControlLabel
              sx={{ marginBottom: 2 }}
              value="outlined-50px"
              defaultChecked={getPostDataRedux?.button_option}
              control={<Radio />}
              onClick={(e) => {
                setGetButton_option(e.target.value);
                handleEditStyle(undefined, e.target.value, "button_option");
              }}
              label={
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box
                    mr={1}
                    sx={{
                      width: { md: "150px", sm: "150px", xs: "120px" },
                      height: { md: "50px", sm: "50px", xs: "40px" },
                      borderColor: "#3d444b",
                      borderStyle: "solid",
                      borderWidth: 1,
                      borderRadius: "50px",
                    }}
                  />
                  Outline Round
                </Box>
              }
            />
          </RadioGroup>
        </FormControl>

        <Typography variant="body1" fontWeight="bold" my={2}>
          Button Color
        </Typography>
        <TextFieldTemplate
          fullWidth={true}
          value={getPostDataRedux?.button_color}
          defaultValue={getPostDataRedux?.button_color}
          onChange={(e) => {
            setGetButton_color(e.target.value);
            debouncedHandleEditStyle(undefined, e.target.value, "button_color");
          }}
          type="color"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  style={{
                    backgroundColor: getPostDataRedux?.button_color,
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

        <Typography variant="body1" fontWeight="bold" my={2}>
          Button Font Color
        </Typography>
        <TextFieldTemplate
          fullWidth={true}
          value={getPostDataRedux?.button_font_color}
          defaultValue={getPostDataRedux?.button_font_color}
          onChange={(e) => {
            setGetButton_font_color(e.target.value);
            debouncedHandleEditStyle(
              undefined,
              e.target.value,
              "button_font_color"
            );
          }}
          type="color"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  style={{
                    backgroundColor: getPostDataRedux?.button_font_color,
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

        <Typography variant="body1" fontWeight="bold" my={2}>
          Font Color
        </Typography>
        <TextFieldTemplate
          fullWidth={true}
          value={getPostDataRedux?.font_color}
          defaultValue={getPostDataRedux?.font_color}
          onChange={(e) => {
            setGetFont_color(e.target.value);
            debouncedHandleEditStyle(undefined, e.target.value, "font_color");
          }}
          type="color"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <span
                  style={{
                    backgroundColor: getPostDataRedux?.font_color,
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

export default ButtonAppearance;
