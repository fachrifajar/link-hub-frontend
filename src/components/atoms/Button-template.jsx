import React from "react";
import { Button } from "@mui/material";
import LoadingButton from "@mui/lab/LoadingButton";

const ButtonTemplate = ({
  title,
  onClick,
  disabled,
  isLoading,
  sx,
  color,
  endIcon,
  component,
  variant,
  size,
  startIcon,
}) => {
  if (isLoading) {
    return (
      <LoadingButton
        component={component}
        loading={true}
        variant={variant ? variant : "contained"}
        disabled={disabled}
        onClick={onClick}
        size={size}
        sx={{
          borderRadius: "20px",
          marginTop: "20px",
          color: "white",
          textTransform: "none",
          ...sx,
        }}>
        Loading...
      </LoadingButton>
    );
  }

  return (
    <Button
      color={color}
      component={component}
      variant={variant ? variant : "contained"}
      disabled={disabled}
      onClick={onClick}
      endIcon={endIcon}
      startIcon={startIcon}
      size={size}
      sx={{
        borderRadius: "50px",
        marginTop: "20px",
        // color: "white",
        textTransform: "none",
        ...sx,
      }}>
      {title}
    </Button>
  );
};

export default ButtonTemplate;
