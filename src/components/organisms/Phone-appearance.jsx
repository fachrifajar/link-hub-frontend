import React from "react";
import { Box, Avatar, Typography, Stack, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { lighten, darken } from "polished";
import ButtonTemplate from "../atoms/Button-template";
import DragAndDrop from "./DragAndADrop-template";

const PhoneAppearance = () => {
  const [getAuthDataRedux, setGetAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );
  const [getPostDataRedux, setGetPostDataRedux] = React.useState(
    useSelector((state) => state?.post?.data?.data?.item)
  );

  const getItemDataRedux = useSelector(
    (state) => state?.item?.data?.data?.itemData
  );
  // console.log(getItemDataRedux);
  console.log(getPostDataRedux);

  const bgDirection = getPostDataRedux?.bg_direction;
  const bg_dir = bgDirection === "gradientUp" ? "to top" : "to bottom";

  const hexColor = getPostDataRedux?.bg_color;
  const lightenedColor = lighten(0.3, hexColor);
  const gradientStyle = {
    backgroundImage: `linear-gradient(${bg_dir}, ${hexColor}, ${lightenedColor})`,
  };
  const bgStyle =
    getPostDataRedux?.bg === "flat" ? { bgcolor: hexColor } : gradientStyle;

  const buttonOption = getPostDataRedux?.button_option?.split("-")[0];
  const borderRadiusOption = getPostDataRedux?.button_option?.split("-")[1];

  return (
    <Box
      sx={{
        // width: "120%",
        // height: "100vh",
        // bgcolor: "red",
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "center",
      }}>
      <Box
        sx={{
          width: "230px",
          height: "60vh",
          ...bgStyle,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "background.default3",
          borderStyle: "solid",
          borderWidth: 10,
          borderRadius: "25px",
          // mb: "25%",
          mt: "30%",
          position: "fixed",
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "0.1em",
            height: "0.5em",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}>
        <Stack
          direction="column"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            height: "100%",
            width: "100%",
            p: 2,
          }}>
          <Avatar sx={{ mb: 1, bgcolor: "#000000", color: "#FFFFFF" }}>
            {getAuthDataRedux?.username?.[0].toUpperCase()}
          </Avatar>
          <Typography
            variant="body1"
            sx={{
              fontSize: "14px",
              fontWeight: 600,
              color: getPostDataRedux?.font_color,
              "& span": {
                letterSpacing: 1,
              },
            }}>
            <span>@{getAuthDataRedux?.username}</span>
          </Typography>

          <Box sx={{ width: "100%", mt: "10%" }}>
            {getPostDataRedux?.use_title == "1" && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: "12px",
                  fontWeight: 600,
                  color: getPostDataRedux?.font_color,
                  display: "flex",
                  justifyContent: "center",
                  mb: "5%",
                }}>
                {getPostDataRedux?.title}
              </Typography>
            )}

            {getItemDataRedux?.map((item, key) => (
              <>
                <ButtonTemplate
                  key={key}
                  variant={buttonOption === "fill" ? "contained" : "outlined"}
                  fullWidth={true}
                  title={item?.title}
                  sx={{
                    bgcolor: getPostDataRedux?.button_color,
                    color: getPostDataRedux?.button_font_color,
                    borderRadius: borderRadiusOption,
                    "&:hover": {
                      bgcolor: darken(0.1, getPostDataRedux?.button_color),
                    },
                    marginTop: "0px",
                    marginBottom: "5%",
                    fontSize: "11px",
                  }}
                />
              </>
            ))}
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default PhoneAppearance;
