import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import Typography from '@mui/material/Typography';
import { CircularProgress } from '@mui/material';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
        padding: theme.spacing(1),
    },
}));

const DeleteDialog = ({ deleteOpen, handleDeleteCose, deleteFunction, lable, text, loading }: any) => {

    return (
        <BootstrapDialog
            onClose={handleDeleteCose}
            aria-labelledby="customized-dialog-title"
            open={deleteOpen}
        >
            <DialogTitle sx={{ m: 0, p: 2 }} id="customized-dialog-title">
                {lable}
            </DialogTitle>
            <IconButton
                aria-label="close"
                onClick={handleDeleteCose}
                sx={{
                    position: 'absolute',
                    right: 8,
                    top: 8,
                    color: (theme) => theme.palette.grey[500],
                }}
            >
                <CloseIcon />
            </IconButton>
            <DialogContent dividers>
                <Typography gutterBottom>
                    {text}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={deleteFunction}>
                    {loading ? (
                        <CircularProgress color="inherit" size={"1rem"} />
                    ) : (
                        "Delete"
                    )}
                </Button>
            </DialogActions>
        </BootstrapDialog>
    );
}

export default DeleteDialog;