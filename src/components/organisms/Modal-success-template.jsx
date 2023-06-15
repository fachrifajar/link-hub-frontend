import React from "react";
import { Modal, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";"../atoms/Button-template";
import { useNavigate } from "react-router-dom";

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "30vh"
});

const MyCard = styled(Card)({
  textAlign: "center",
  borderRadius: "20px",
  padding: "30px 50px",
  overflowY: "auto",
  width: "500px",
});

const ModalSuccessTemplate = ({ open, onClose, text, children }) => {
  return (
    <>
      <MyModal open={open} onClose={onClose}>
        <MyCard>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: "50px" }} />
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              fontSize: { xs: "20px", sm: "24px", md: "24px" },
              marginTop: "20px",
            }}>
            {text}
          </Typography>
          {children}
        </MyCard>
      </MyModal>
    </>
  );
};

export default ModalSuccessTemplate;
