import React from "react";
import { Box, Avatar, Typography, Stack, Skeleton } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

const PhoneAppearance = () => {
  const [getAuthDataRedux, setGetAuthDataRedux] = React.useState(
    useSelector((state) => state?.auth?.data?.data)
  );
  //   console.log(getAuthDataRedux);
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
          width: "15vw",
          height: "60vh",
          // bgcolor: "yellow",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          borderColor: "background.default3",
          borderStyle: "solid",
          borderWidth: 10,
          borderRadius: "25px",
          mb: "25%",
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
          <Avatar sx={{ mb: 1 }}>
            {getAuthDataRedux?.username?.[0].toUpperCase()}
          </Avatar>
          <Typography
            variant="body1"
            sx={{
              fontSize: "13px",
              fontWeight: 600,
              "& span": {
                letterSpacing: 1,
              },
            }}>
            @<span>{getAuthDataRedux?.username}</span>
          </Typography>
          <Box sx={{ width: "100%", mt: "10%" }}>
            <Skeleton animation="wave" sx={{ height: "5vh" }} />
            <Skeleton animation="wave" sx={{ height: "5vh" }} />
            <Skeleton animation="wave" sx={{ height: "5vh" }} />
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default PhoneAppearance;
