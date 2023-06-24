import React from "react";
import { Modal, Card, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  marginBottom: "30vh",
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
            variant="h4"
            color="text.secondary"
            sx={{
              marginTop: "2%",
            }}>
            <strong>{text}</strong>
          </Typography>
          {children}
        </MyCard>
      </MyModal>
    </>
  );
};

export default ModalSuccessTemplate;
