import { create } from 'zustand';
import { toast } from 'react-hot-toast';

// Helper to get history from localStorage
const getHistory = () => {
  try {
    const history = localStorage.getItem('session_history');
    return history ? JSON.parse(history) : [];
  } catch (e) {
    return [];
  }
};

// Helper to save history to localStorage
const saveHistory = (history) => {
  localStorage.setItem('session_history', JSON.stringify(history.slice(0, 10))); // keep last 10
};

const getStoredSession = () => {
  try {
    const stored = localStorage.getItem('active_session');
    if (!stored) return null;
    const session = JSON.parse(stored);
    
    // Check if the session is active and has expired
    if (session.status === 'active' && session.endsAt) {
      const now = Date.now();
      if (now >= session.endsAt) {
        // Automatically set it to complete/completing if time elapsed
        session.status = 'active'; // Page code will trigger the completion
      }
    }
    return session;
  } catch (e) {
    return null;
  }
};

const defaultSessionState = {
  sessionId: null,
  duration: 25,
  stakeAmount: '',
  status: 'idle', // idle | staking | active | completing | success | forfeited | error
  stakeHash: null,
  returnHash: null,
  startedAt: null,
  endsAt: null,
  history: getHistory()
};

export const useSessionStore = create((set, get) => {
  const storedSession = getStoredSession();
  
  return {
    ...defaultSessionState,
    ...(storedSession || {}),

    setDuration: (duration) => set({ duration }),
    setStakeAmount: (stakeAmount) => set({ stakeAmount }),
    setStatus: (status) => set({ status }),

    startSession: (duration, stakeAmount, stakeHash) => {
      const sessionId = typeof crypto.randomUUID === 'function' 
        ? crypto.randomUUID() 
        : Math.random().toString(36).substring(2, 9);
      
      const startedAt = Date.now();
      const isDemo = typeof window !== 'undefined' && window.location.search.includes('demo=true');
      const endsAt = startedAt + (isDemo ? 10 * 1000 : duration * 60 * 1000);
      
      const newSession = {
        sessionId,
        duration,
        stakeAmount,
        status: 'active',
        stakeHash,
        returnHash: null,
        startedAt,
        endsAt
      };

      set(newSession);
      localStorage.setItem('active_session', JSON.stringify(newSession));

      // Append to history as pending/in-progress or wait until finished
      const historyItem = {
        id: sessionId,
        date: new Date(startedAt).toISOString(),
        duration,
        stakeAmount,
        outcome: 'active',
        stakeHash,
        returnHash: null
      };

      const updatedHistory = [historyItem, ...get().history];
      set({ history: updatedHistory });
      saveHistory(updatedHistory);
    },

    completeSession: (returnHash) => {
      const { sessionId, history } = get();
      if (!sessionId) return;

      const updatedHistory = history.map(item => {
        if (item.id === sessionId) {
          return { ...item, outcome: 'success', returnHash };
        }
        return item;
      });

      const updatedSession = {
        ...get(),
        status: 'success',
        returnHash
      };

      set({ status: 'success', returnHash, history: updatedHistory });
      localStorage.setItem('active_session', JSON.stringify(updatedSession));
      saveHistory(updatedHistory);
    },

    forfeitSession: () => {
      const { sessionId, history } = get();
      if (!sessionId) return;

      const updatedHistory = history.map(item => {
        if (item.id === sessionId) {
          return { ...item, outcome: 'forfeited' };
        }
        return item;
      });

      const updatedSession = {
        ...get(),
        status: 'forfeited'
      };

      set({ status: 'forfeited', history: updatedHistory });
      localStorage.setItem('active_session', JSON.stringify(updatedSession));
      saveHistory(updatedHistory);
    },

    resetSession: () => {
      set({
        sessionId: null,
        status: 'idle',
        stakeHash: null,
        returnHash: null,
        startedAt: null,
        endsAt: null,
        stakeAmount: ''
      });
      localStorage.removeItem('active_session');
    }
  };
});
