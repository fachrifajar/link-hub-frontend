import React from "react";
import { TextField, useMediaQuery } from "@mui/material";

const TextFieldTemplate = ({
  label,
  error,
  placeholder,
  onChange,
  value,
  helperText,
  type,
  InputProps,
  disabled,
  sx,
  size,
  onKeyDown,
  onInput,
  name,
  variant,
  fullWidth
}) => {
  const isXs = useMediaQuery("(max-width: 600px)");
  return (
    <>
      <TextField
        fullWidth={fullWidth}
        name={name}
        onKeyDown={onKeyDown}
        onInput={onInput}
        size={isXs ? "small" : "medium"}
        id="outlined-basic"
        margin="normal"
        variant={variant ? variant : "outlined"}
        disabled={disabled}
        label={label}
        error={error}
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        helperText={helperText}
        type={type}
        InputProps={{
          sx: {
            color: "text.secondary",
          },
          ...InputProps,
        }}
        sx={{
          "& label": {
            color: "text.secondary",
          },
          "& label.Mui-focused": {
            color: "primary.main",
          },
          "& .MuiOutlinedInput-root": {
            "& fieldset": {
              borderColor: "#8692a6",
            },
            "&:hover fieldset": {
              borderColor: "secondary",
            },
            "&.Mui-focused fieldset": {
              borderColor: "secondary",
            },
          },
          //   width: { xs: "20rem", sm: "20rem", md: "25rem" },
          ...sx,
        }}
      />
    </>
  );
};

export default TextFieldTemplate;
