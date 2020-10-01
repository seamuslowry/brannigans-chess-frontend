import React from 'react';
import { AxiosResponse } from 'axios';
import { useMediaQuery, useTheme } from '@material-ui/core';

interface CallState<T> {
  loading: boolean;
  response?: T;
  error?: string;
}

export const useServiceCall = <T>(servicePromise: Promise<AxiosResponse<T>>) => {
  const [state, setState] = React.useState<CallState<T>>({
    loading: true
  });

  React.useEffect(() => {
    servicePromise
      .then(res => setState({ error: undefined, response: res.data, loading: false }))
      .catch(e => setState({ error: e.message, response: undefined, loading: false }));
  }, [servicePromise]);

  return state;
};

export const usePieceSize = () => {
  const theme = useTheme();
  const sm = useMediaQuery(theme.breakpoints.down('sm'));

  return sm ? '8vw' : '5vw';
};
