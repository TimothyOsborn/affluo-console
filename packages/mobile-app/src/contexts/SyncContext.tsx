import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FormSubmission } from '../types/navigation';

interface SyncState {
  isOnline: boolean;
  pendingSubmissions: FormSubmission[];
  isSyncing: boolean;
  lastSyncTime: Date | null;
}

type SyncAction =
  | { type: 'SET_ONLINE_STATUS'; payload: boolean }
  | { type: 'ADD_PENDING_SUBMISSION'; payload: FormSubmission }
  | { type: 'REMOVE_PENDING_SUBMISSION'; payload: string }
  | { type: 'SET_SYNCING'; payload: boolean }
  | { type: 'SET_LAST_SYNC_TIME'; payload: Date }
  | { type: 'LOAD_PENDING_SUBMISSIONS'; payload: FormSubmission[] };

interface SyncContextType extends SyncState {
  addPendingSubmission: (submission: FormSubmission) => void;
  removePendingSubmission: (submissionId: string) => void;
  syncPendingSubmissions: () => Promise<void>;
  checkOnlineStatus: () => void;
}

const SyncContext = createContext<SyncContextType | undefined>(undefined);

const initialState: SyncState = {
  isOnline: true,
  pendingSubmissions: [],
  isSyncing: false,
  lastSyncTime: null,
};

const syncReducer = (state: SyncState, action: SyncAction): SyncState => {
  switch (action.type) {
    case 'SET_ONLINE_STATUS':
      return { ...state, isOnline: action.payload };
    case 'ADD_PENDING_SUBMISSION':
      return {
        ...state,
        pendingSubmissions: [...state.pendingSubmissions, action.payload],
      };
    case 'REMOVE_PENDING_SUBMISSION':
      return {
        ...state,
        pendingSubmissions: state.pendingSubmissions.filter(
          sub => sub.id !== action.payload
        ),
      };
    case 'SET_SYNCING':
      return { ...state, isSyncing: action.payload };
    case 'SET_LAST_SYNC_TIME':
      return { ...state, lastSyncTime: action.payload };
    case 'LOAD_PENDING_SUBMISSIONS':
      return { ...state, pendingSubmissions: action.payload };
    default:
      return state;
  }
};

export const SyncProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(syncReducer, initialState);

  useEffect(() => {
    loadPendingSubmissions();
    checkOnlineStatus();
    
    const interval = setInterval(checkOnlineStatus, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const loadPendingSubmissions = async () => {
    try {
      const stored = await AsyncStorage.getItem('pendingSubmissions');
      if (stored) {
        const submissions = JSON.parse(stored);
        dispatch({ type: 'LOAD_PENDING_SUBMISSIONS', payload: submissions });
      }
    } catch (error) {
      console.error('Failed to load pending submissions:', error);
    }
  };

  const savePendingSubmissions = async (submissions: FormSubmission[]) => {
    try {
      await AsyncStorage.setItem('pendingSubmissions', JSON.stringify(submissions));
    } catch (error) {
      console.error('Failed to save pending submissions:', error);
    }
  };

  const checkOnlineStatus = () => {
    // In a real app, you'd check network connectivity
    const isOnline = navigator.onLine !== false;
    dispatch({ type: 'SET_ONLINE_STATUS', payload: isOnline });
  };

  const addPendingSubmission = (submission: FormSubmission) => {
    dispatch({ type: 'ADD_PENDING_SUBMISSION', payload: submission });
    const newPending = [...state.pendingSubmissions, submission];
    savePendingSubmissions(newPending);
  };

  const removePendingSubmission = (submissionId: string) => {
    dispatch({ type: 'REMOVE_PENDING_SUBMISSION', payload: submissionId });
    const newPending = state.pendingSubmissions.filter(sub => sub.id !== submissionId);
    savePendingSubmissions(newPending);
  };

  const syncPendingSubmissions = async () => {
    if (!state.isOnline || state.pendingSubmissions.length === 0) {
      return;
    }

    dispatch({ type: 'SET_SYNCING', payload: true });

    try {
      // In a real app, you'd send pending submissions to the server
      for (const submission of state.pendingSubmissions) {
        // await apiService.submitForm(submission);
        removePendingSubmission(submission.id);
      }

      dispatch({ type: 'SET_LAST_SYNC_TIME', payload: new Date() });
    } catch (error) {
      console.error('Failed to sync pending submissions:', error);
    } finally {
      dispatch({ type: 'SET_SYNCING', payload: false });
    }
  };

  const value: SyncContextType = {
    ...state,
    addPendingSubmission,
    removePendingSubmission,
    syncPendingSubmissions,
    checkOnlineStatus,
  };

  return <SyncContext.Provider value={value}>{children}</SyncContext.Provider>;
};

export const useSync = (): SyncContextType => {
  const context = useContext(SyncContext);
  if (context === undefined) {
    throw new Error('useSync must be used within a SyncProvider');
  }
  return context;
};
