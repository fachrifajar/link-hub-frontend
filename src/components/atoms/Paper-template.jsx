import { Paper, Typography, Box } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const PaperTemplate = ({ children, sx, title, onClick }) => {
  return (
    <>
      <Paper
        elevation={2}
        sx={{
          width: "400px",
          height: "auto",
          padding: { md: "3%", sm: "3%", xs: "10%" },
          marginTop: "5vh",
          bgcolor: "background.default",
          borderRadius: "20px",

          display: "flex",
          textAlign: "center",
          flexDirection: "column",
          maxHeight: "100vh",
          overflow: "auto",

          ...sx,
        }}>
        <Typography
          variant="h4"
          fontWeight="bold"
          sx={{
            color: "text.contrastText",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "5%",
            flexGrow: 1,
          }}>
          <ArrowBackIosNewIcon
            onClick={onClick}
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              cursor: "pointer",
            }}
          />
          <Box sx={{ flexGrow: 1 }}>{title}</Box>
        </Typography>

        {children}
      </Paper>
    </>
  );
};

export default PaperTemplate;
