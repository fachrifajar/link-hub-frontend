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
}) => {
  if (isLoading) {
    return (
      <LoadingButton
        // fullWidth
        component={component}
        loading={true}
        variant={variant ? variant : "contained"}
        disabled={disabled}
        onClick={onClick}
        size={size}
        sx={{
          borderRadius: "10px",
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
      //   fullWidth
      color={color}
      component={component}
      variant={variant ? variant : "contained"}
      disabled={disabled}
      onClick={onClick}
      endIcon={endIcon}
      size={size}
      sx={{
        borderRadius: "10px",
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
