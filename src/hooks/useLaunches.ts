import { useEffect, useReducer } from "react";
import { launchesReducer, initialState } from "../reducers/launchesReducer";
import { fetchLaunchesApi } from "../services/fetchLaunchesApi";

export const useLaunches = () => {
  const [state, dispatch] = useReducer(launchesReducer, initialState);

  useEffect(() => {
    const fetchLaunches = async () => {
      dispatch({ type: 'fetch_init' });

      try {
        const data = await fetchLaunchesApi();
        dispatch({ type: 'fetch_success', payload: data });
      } catch (error) {
        dispatch({ type: 'fetch_failure', payload: error.message });
      }
    }

    fetchLaunches();
  }, []);

  const openModal = (launch) => {
    dispatch({ type: 'open_modal', payload: launch });
  };

  const closeModal = () => {
    dispatch({ type: 'close_modal' });
  };

  return {
    ...state,
    openModal,
    closeModal,
  };
};