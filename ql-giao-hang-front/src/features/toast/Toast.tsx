import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import { useAppDispatch, useAppSelector } from '@App/hook';
import { closeToast, selectToast } from './toastSlice';
import { Alert } from '@mui/material';



export default function Toast() {
    const toast = useAppSelector(selectToast);
    const dispatch = useAppDispatch();
    const { message, open, status } = toast;

    const handleClose = () => {
        dispatch(closeToast());
    };



    return (
        <Snackbar
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open}
            onClose={handleClose}
            autoHideDuration={3000}

        >
            <Alert color={status} severity={status} onClose={handleClose}>
                {message}
            </Alert>
        </Snackbar>
    );
}