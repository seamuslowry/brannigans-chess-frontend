import { useAuth0 } from '@auth0/auth0-react';
import { useSelector } from 'react-redux';
import { AppState } from '@auth0/auth0-react/dist/auth0-provider';

const useLoggedIn = () => {
  const { isAuthenticated } = useAuth0();
  const hasPlayer = useSelector<AppState, boolean>(state => !!state.auth.player);

  return isAuthenticated && hasPlayer;
};

export default useLoggedIn;
