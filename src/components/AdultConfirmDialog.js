import React from 'react';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

// Shown when a user turns on adult content. The server won't enable it without this confirmation.
const AdultConfirmDialog = ({ open, onConfirm, onCancel }) => (
    <Dialog open={open} onClose={onCancel} fullWidth maxWidth="xs">
        <DialogTitle>Confirm your age</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Adult titles are only available to users 18 or older. By continuing, you confirm that you are at least 18 years old.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
            <Button onClick={onCancel}>Cancel</Button>
            <Button variant="contained" onClick={onConfirm}>
                I am 18 or older
            </Button>
        </DialogActions>
    </Dialog>
);

export default AdultConfirmDialog;