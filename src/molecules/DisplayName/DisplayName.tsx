import React from 'react';
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  makeStyles,
  OutlinedInput
} from '@material-ui/core';
import { Player } from '../../services/ChessService.types';
import { useAppDispatch } from '../../store/store';
import { Check, Close, Edit } from '@material-ui/icons';
import { updateDisplayName } from '../../store/auth/auth';

interface DisplayNameChangeState {
  loading: boolean;
  editing: boolean;
  name: string;
  initialName: string;
}

interface StartEditAction {
  type: 'start';
}

interface CancelEditAction {
  type: 'cancel';
}

interface SubmitPendingAction {
  type: 'submit/pending';
}

interface SubmitSuccessAction {
  type: 'submit/success';
}

interface SubmitFailureAction {
  type: 'submit/failure';
}

interface InputChangeAction {
  type: 'change';
  payload: string;
}

type DisplayNameChangeAction =
  | StartEditAction
  | CancelEditAction
  | SubmitPendingAction
  | SubmitFailureAction
  | SubmitSuccessAction
  | InputChangeAction;

const reducer = (state: DisplayNameChangeState, action: DisplayNameChangeAction) => {
  switch (action.type) {
    case 'change':
      return {
        ...state,
        name: action.payload
      };
    case 'submit/success':
      return {
        ...state,
        loading: false,
        editing: false,
        initialName: state.name
      };
    case 'submit/failure':
      return {
        ...state,
        loading: false
      };
    case 'submit/pending':
      return {
        ...state,
        loading: true
      };
    case 'start':
      return {
        ...state,
        editing: true
      };
    case 'cancel':
    default:
      return {
        ...state,
        editing: false,
        name: state.initialName
      };
  }
};

const useStyles = makeStyles({
  formControl: {
    margin: '0.1rem'
  }
});

interface Props {
  player: Player;
}

const DisplayName: React.FC<Props> = ({ player }) => {
  const dispatch = useAppDispatch();
  const classes = useStyles();

  const [localState, localDispatch] = React.useReducer(reducer, {
    loading: false,
    editing: false,
    name: player.name,
    initialName: player.name
  });

  const { name, loading, editing } = localState;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    localDispatch({ type: 'change', payload: e.target.value });
  };

  const handleAdornmentClick = (type: 'start' | 'cancel' | 'submit') => async () => {
    switch (type) {
      case 'submit':
        localDispatch({ type: 'submit/pending' });
        dispatch(updateDisplayName(name))
          .then(() => {
            localDispatch({ type: 'submit/success' });
          })
          .finally(() => {
            localDispatch({ type: 'submit/failure' });
          });
        break;
      case 'start':
        localDispatch({ type: 'start' });
        break;
      case 'cancel':
      default:
        localDispatch({ type: 'cancel' });
        break;
    }
  };

  let adornments: JSX.Element;
  if (loading) {
    adornments = <CircularProgress />;
  } else if (editing) {
    adornments = (
      <>
        <IconButton aria-label="cancel" disabled={loading} onClick={handleAdornmentClick('cancel')}>
          <Close />
        </IconButton>
        <IconButton
          aria-label="confirm"
          disabled={loading}
          onClick={handleAdornmentClick('submit')}
        >
          <Check />
        </IconButton>
      </>
    );
  } else {
    adornments = (
      <IconButton aria-label="edit" disabled={loading} onClick={handleAdornmentClick('start')}>
        <Edit />
      </IconButton>
    );
  }

  return (
    <FormControl fullWidth className={classes.formControl} variant="outlined">
      <InputLabel color="secondary" htmlFor={`display-name-${player.id}`}>
        Display Name
      </InputLabel>
      <OutlinedInput
        id={`display-name-${player.id}`}
        fullWidth
        value={name}
        disabled={loading || !editing}
        onChange={handleChange}
        endAdornment={adornments}
        label="Display Name"
        color="secondary"
      />
    </FormControl>
  );
};

export default DisplayName;
