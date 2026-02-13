import type { LaunchesState, LaunchesAction } from '../types';

export const initialState: LaunchesState = {
  launches: [],
  isLoading: false,
  error: null,
  selectedLaunch: null,
  isModalOpen: false
};

export const launchesReducer = (state: LaunchesState, action: LaunchesAction): LaunchesState => {
  switch (action.type) {
    case 'fetch_init':
      return { ...state, isLoading: true, error: null };
    case 'fetch_success':
      return { ...state, isLoading: false, launches: action.payload };
    case 'fetch_failure':
      return { ...state, isLoading: false, error: action.payload };
    case 'open_modal':
      return { ...state, isModalOpen: true, selectedLaunch: action.payload };
    case 'close_modal':
      return { ...state, isModalOpen: false, selectedLaunch: null };
    default: 
    return state;
  }
}