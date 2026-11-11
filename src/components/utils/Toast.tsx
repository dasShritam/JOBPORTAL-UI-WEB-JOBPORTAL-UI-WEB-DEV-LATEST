import * as React from "react";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant='filled' {...props} />;
});

export default function CustomizedSnackbars({
  toaster,
  setToaster,
}: {
  toaster: any;

  setToaster: React.Dispatch<React.SetStateAction<any>>;
}) {
  const [open, setOpen] = React.useState(false);
  const handleClick = () => {
    setOpen(true);
  };

  React.useEffect(() => {
    handleClick();
  }, [toaster]);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={handleClose}
          severity={toaster.type}
          sx={{ minWidth: 300 }}
        >
          {toaster.text}
        </Alert>
      </Snackbar>
    </>
  );
}
