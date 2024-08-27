import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { CircularProgress } from "@mui/material";
import Image from "next/image";

const DeleteDialog = ({
  deleteOpen,
  handleDeleteCose,
  deleteFunction,
  lable,
  text,
  loading,
}: any) => {
  return (
    <Dialog
      className="delete-dialog"
      onClose={handleDeleteCose}
      aria-labelledby="customized-dialog-title"
      open={deleteOpen}
    >
      <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
        <Image src="/map/delete-info-icon.svg" alt="" width="20" height="20" />
        {lable}
      </DialogTitle>

      <DialogContent>
        <Typography className="delete-text" gutterBottom>
          {text}
        </Typography>
      </DialogContent>
      <DialogActions className="action-btnGrp">
        <Button onClick={handleDeleteCose} className="cancel">
          Cancel
        </Button>
        <Button className="delete" autoFocus onClick={deleteFunction}>
          {loading ? (
            <CircularProgress color="inherit" size={"1rem"} />
          ) : (
            " Yes,Delete"
          )}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteDialog;
