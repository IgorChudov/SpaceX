export interface Launch {
  mission_name: string;
}

export interface LaunchesState {
  launches: Launch[];
  isLoading: boolean;
  error: string | null;
  selectedLaunch: Launch | null;
  isModalOpen: boolean;
}

export type LaunchesAction = 
  | { type: 'fetch_init' }
  | { type: 'fetch_success', payload: Launch[] }
  | { type: 'fetch_failure', payload: string }
  | { type: 'open_modal', payload: Launch }
  | { type: 'close_modal' }