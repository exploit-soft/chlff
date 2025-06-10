import { configureStore } from '@reduxjs/toolkit';
import controlReducer from '../features/control/controlSlice';
import authReducer from '../features/auth/authSlice';
import gameReducer from '../features/game/gameSlice';
import soundReducer from '../features/sound/soundSlice';
import puzzleReducer from '../features/puzzleSlice';
import userReducer from '../features/user/userSlice';
import LeaderBoardReducer from '../features/leaderBoard/leaderBoardSlice';
import CharactersReducer from '../features/characters/charactersSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';

export const store = configureStore({
  reducer: {
    control: controlReducer,
    auth: authReducer,
    user: userReducer,
    game: gameReducer,
    sound: soundReducer,
    puzzle: puzzleReducer,
    leaderBoard: LeaderBoardReducer,
    characters: CharactersReducer,
    dashboard: dashboardReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['sound/registerGameSounds'], // Ignore actions that cause the warning
        ignoredPaths: ['sound.currentGameSounds'], // Ignore the path in the state
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
