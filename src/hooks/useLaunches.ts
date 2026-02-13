import { useEffect, useReducer } from "react";
import { launchesReducer, initialState } from "../reducers/launchesReducer";
import { fetchLaunchesApi } from "../services/fetchLaunchesApi";
import type { Launch } from '../types';

interface UseLaunchesReturn {
  launches: Launch[];
  isLoading: boolean;
  error: string | null;
  selectedLaunch: Launch | null;
  isModalOpen: boolean;
  openModal: (launch: Launch) => void;
  closeModal: () => void;
}

export const useLaunches = (): UseLaunchesReturn => {
  const [state, dispatch] = useReducer(launchesReducer, initialState);

  useEffect(() => {
    const fetchLaunches = async (): Promise<void> => {
      dispatch({ type: 'fetch_init' });

      try {
        const data = await fetchLaunchesApi();
        dispatch({ type: 'fetch_success', payload: data });
      } catch (error) {
        dispatch({ type: 'fetch_failure', payload: error instanceof Error ? error.message : 'error' });
      }
    }

    fetchLaunches();
  }, []);

  const openModal = (launch: Launch): void => {
    dispatch({ type: 'open_modal', payload: launch });
  };

  const closeModal = (): void => {
    dispatch({ type: 'close_modal' });
  };

  return {
    ...state,
    openModal,
    closeModal,
  };
};