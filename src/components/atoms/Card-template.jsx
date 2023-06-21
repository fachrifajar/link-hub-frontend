import { Card, useMediaQuery, CardActionArea } from "@mui/material";

const CardTemplate = ({ sx, children, icon, onClick }) => {
  const isXs = useMediaQuery("(max-width: 600px)");
  return (
    <Card
      sx={{
        width: { md: "60%", sm: "60%", xs: "100%" },
        marginBottom: !isXs ? "1%" : "3%",
        borderRadius: "10px",
        bgcolor: "background.default2",
        display: "flex",
        flexDirection: isXs ? "column" : "row",
        px: 3,
        py: 3,
        ...sx,
      }}>
      <CardActionArea
        onClick={onClick}
        sx={{
          width: { md: "10%", sm: "10%", xs: "100%" },
          justifyContent: !isXs ? "center" : "flex-start",
          alignItems: "center",
          display: "flex",
          mr: 5,
          my: !isXs ? 0 : 1,
        }}>
        {icon}
      </CardActionArea>
      {children}
    </Card>
  );
};

export default CardTemplate;
