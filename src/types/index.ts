export interface LaunchLinks {
  mission_patch?: string;
  mission_patch_small?: string;
}

export interface LaunchRocket {
  rocket_name?: string;
}

export interface Launch {
  mission_name: string;
  details?: string | null;
  links?: LaunchLinks;
  rocket?: LaunchRocket;
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
  | { type: 'fetch_success'; payload: Launch[] }
  | { type: 'fetch_failure'; payload: string }
  | { type: 'open_modal'; payload: Launch }
  | { type: 'close_modal' };

export interface LaunchCardProps {
  launch: Launch;
  onSeeMore: (launch: Launch) => void;
}

export interface LaunchModalProps {
  launch: Launch | null;
  onClose: () => void;
}

export interface OverlayProps {
  onClose: () => void;
}

