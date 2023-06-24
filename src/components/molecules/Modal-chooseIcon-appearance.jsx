import React from "react";
import {
  Modal,
  Card,
  styled,
  Typography,
  Box,
  CardActionArea,
} from "@mui/material";
import { useSelector } from "react-redux";

import EmailIcon from "@mui/icons-material/Email";
import FacebookIcon from "@mui/icons-material/Facebook";
import GitHubIcon from "@mui/icons-material/GitHub";
import InstagramIcon from "@mui/icons-material/Instagram";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import TwitterIcon from "@mui/icons-material/Twitter";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";

import ModalFormIconAppearance from "./Modal-formIcon-appearance";

const MyModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const MyCard = styled(Card)({
  textAlign: "center",
  borderRadius: "20px",
  padding: "30px 50px",
  overflowY: "auto",
  width: "500px",
});

const iconsData = [
  { Icon: EmailIcon, name: "Email", type: "email" },
  { Icon: FacebookIcon, name: "Facebook", type: "text" },
  { Icon: GitHubIcon, name: "GitHub", type: "text" },
  { Icon: InstagramIcon, name: "Instagram", type: "text" },
  { Icon: LinkedInIcon, name: "LinkedIn", type: "text" },
  { Icon: TwitterIcon, name: "Twitter", type: "text" },
  { Icon: WhatsAppIcon, name: "WhatsApp", type: "number" },
  { Icon: YouTubeIcon, name: "YouTube", type: "text" },
];

const ModalChooseIcon = ({
  open,
  onClose,
  text,
  children,
  forceClose,
  forceOpen,
}) => {
  const [isModalOpen, setIsModalopen] = React.useState(false);
  const [type, setType] = React.useState("");
  const [title, setTitle] = React.useState("");

  const getPostDataRedux = useSelector(
    (state) => state?.post?.data?.data?.item
  );

  return (
    <>
      <MyModal open={open} onClose={onClose}>
        <MyCard>
          <Typography variant="h5" fontWeight="bold" mb={3}>
            Add icon
          </Typography>
          <Box
            sx={{ display: "flex", flexDirection: "column", overflow: "auto" }}>
            {iconsData?.map((item, index) => {
              const matchingIcon = getPostDataRedux?.SocialMedia.find(
                (icon) => icon.platform === item.name
              );

              return (
                <CardActionArea
                  key={index}
                  disabled={matchingIcon?.id !== item?.id}
                  onClick={() => {
                    forceClose(true);
                    setIsModalopen(true);
                    setType(item?.type);
                    setTitle(item?.name);
                  }}
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <item.Icon sx={{ marginY: 2, marginX: 1 }} />
                    <Typography variant="body1" sx={{ marginLeft: 1 }}>
                      {item?.name}
                    </Typography>
                  </Box>
                  {matchingIcon?.id !== item?.id ? (
                    <Typography
                      variant="body1"
                      fontWeight="bold"
                      sx={{ color: "green" }}>
                      Already Added
                    </Typography>
                  ) : (
                    <ChevronRightIcon />
                  )}
                </CardActionArea>
              );
            })}
          </Box>
        </MyCard>
      </MyModal>
      <ModalFormIconAppearance
        interactType="Add"
        open={isModalOpen}
        onClose={() => setIsModalopen(false)}
        _onClick={() => setIsModalopen(false)}
        success={(e) => {
          if (e) {
            setIsModalopen(false);
          }
        }}
        type={type}
        title={title}
        onClick={() => forceOpen(true)}
      />
    </>
  );
};

export default ModalChooseIcon;
