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
  padding: "3%",
  overflowY: "auto",
  width: "500px",
});

const ModalConfirmationTemplate = ({ open, onClose, children }) => {
  return (
    <>
      <MyModal open={open} onClose={onClose}>
        <MyCard>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: "50px" }} />
          <Typography
            variant="h4"
            color="text.primary"
            sx={{
              marginTop: "20px",
            }}>
            Verification email sent!
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ marginTop: "3%" }}>
            Please wait approximately <strong>1 minute.</strong> If you still
            have not received the email, click the button below to resend.
          </Typography>

          {children}
        </MyCard>
      </MyModal>
    </>
  );
};

export default ModalConfirmationTemplate;
