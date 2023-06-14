import { Stack, Typography } from "@mui/material";

const FooterTemplate = () => {
  return (
    <>
      <Stack alignItems="center" m={1}>
        <Typography
          variant="h6"
          noWrap
          component="a"
          //   onClick={() => window.location.reload()}
          sx={{
            mr: 2,
            // display: { xs: "none", md: "flex" },
            fontFamily: "monospace",
            fontWeight: 700,
            letterSpacing: ".3rem",
            textDecoration: "none",
            color: "text.primary",
            "& span": {
              color: "white",
              //   backgroundColor: "#ff9000",
              borderRadius: "5px",
              paddingLeft: "5px",
              bgcolor: "primary.main",
            },
          }}>
          Link
          <span>Hub</span>
        </Typography>
      </Stack>
    </>
  );
};

export default FooterTemplate;
