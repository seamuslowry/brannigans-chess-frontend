import { Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AlertInfo, removeAlert } from '../../store/notifications/notifications';
import { AppState } from '../../store/store';

const Notifications: React.FC = () => {
  const dispatch = useDispatch();
  const [displayAlert, setDisplayAlert] = React.useState<AlertInfo | undefined>(undefined);
  const [open, setOpen] = React.useState<boolean>(false);

  const alerts = useSelector<AppState, AlertInfo[]>(state => state.notifications.alerts);

  React.useEffect(() => {
    if (alerts.length && !displayAlert) {
      // Set a new snack when we don't have an active one
      setDisplayAlert({ ...alerts[0] });
      dispatch(removeAlert(alerts[0]));
      setOpen(true);
    } else if (alerts.length && displayAlert && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [alerts, displayAlert, open]);

  const handleClose = (event: React.SyntheticEvent | MouseEvent, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setDisplayAlert(undefined);
  };

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      onExited={handleExited}
    >
      <Alert onClose={handleClose} severity={displayAlert?.severity}>
        {displayAlert?.message}
      </Alert>
    </Snackbar>
  );
};

export default Notifications;
