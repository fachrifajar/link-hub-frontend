import React from "react";
import { Modal, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "30vh",
});

const MyCard = styled(Card)(({ theme, sx }) => ({
  textAlign: "center",
  borderRadius: "20px",
  padding: "30px 50px",
  overflowY: "auto",
  // width: "80vw",
  // [theme.breakpoints.up("md")]: {
  //   width: "40vw",
  // },
  width: "500px",
  ...sx,
}));

const ModalErrorTemplate = ({ open, onClose, text, children, sx }) => {
  return (
    <>
      <MyModal open={open} onClose={onClose}>
        <MyCard sx={sx}>
          <ReportProblemIcon color="error" sx={{ fontSize: "50px" }} />
          <Typography
            variant="h4"
            color="text.secondary"
            sx={{ marginTop: "2%" }}>
            {text?.split("\n").map((line, index) => (
              <span
                key={index}
                style={{ fontSize: index === 1 ? "1.2rem" : "inherit" }}>
                {line}
                <br />
              </span>
            ))}
          </Typography>

          {children}
        </MyCard>
      </MyModal>
    </>
  );
};

export default ModalErrorTemplate;
