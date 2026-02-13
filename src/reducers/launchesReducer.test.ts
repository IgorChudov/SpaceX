import { launchesReducer, initialState } from './launchesReducer';
import type { Launch, LaunchesAction, LaunchesState } from '../types';
import { describe, it, expect } from 'vitest';

describe('launchesReducer', () => {
  const mockLaunch: Launch = {
    mission_name: "Test Mission",
    rocket: { rocket_name: "Falcon 9" },
    links: { 
      mission_patch_small: "patch_small.jpg",
      mission_patch: "patch.jpg" 
    },
    details: "Test details"
  };

  const mockLaunches: Launch[] = [mockLaunch];

  // Тест 1: Начальное состояние
  it('возвращает начальное состояние при неизвестном action', () => {
    // Используем 'as any' для неизвестного action
    const action = { type: 'unknown' };
    const newState = launchesReducer(initialState, action as any);
    
    expect(newState).toEqual(initialState);
  });

  // Тест 2: Обработка fetch_init
  it('обрабатывает fetch_init правильно', () => {
    const action: LaunchesAction = { type: 'fetch_init' };
    const newState = launchesReducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      isLoading: true,
      error: null
    });
  });

  // Тест 3: Обработка fetch_success
  it('обрабатывает fetch_success правильно', () => {
    const action: LaunchesAction = { 
      type: 'fetch_success', 
      payload: mockLaunches 
    };
    const newState = launchesReducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      launches: mockLaunches,
      error: null
    });
  });

  // Тест 4: Обработка fetch_failure
  it('обрабатывает fetch_failure правильно', () => {
    const errorMessage = 'Network error';
    const action: LaunchesAction = { 
      type: 'fetch_failure', 
      payload: errorMessage 
    };
    const newState = launchesReducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      isLoading: false,
      error: errorMessage
    });
  });

  // Тест 5: Обработка open_modal
  it('обрабатывает open_modal правильно', () => {
    const action: LaunchesAction = { 
      type: 'open_modal', 
      payload: mockLaunch 
    };
    const newState = launchesReducer(initialState, action);
    
    expect(newState).toEqual({
      ...initialState,
      isModalOpen: true,
      selectedLaunch: mockLaunch
    });
  });

  // Тест 6: Обработка close_modal
  it('обрабатывает close_modal правильно', () => {
    // Сначала открываем модалку
    const stateWithModal: LaunchesState = {
      ...initialState,
      isModalOpen: true,
      selectedLaunch: mockLaunch
    };
    
    const action: LaunchesAction = { type: 'close_modal' };
    const newState = launchesReducer(stateWithModal, action);
    
    expect(newState).toEqual({
      ...stateWithModal,
      isModalOpen: false,
      selectedLaunch: null
    });
  });
});