import { configureStore } from '@reduxjs/toolkit';
import partsReducer from './parts.slice';
import dialogReducer from './dialog.slice';
import rejectionsReducer from './rejections.slice';

export const store = configureStore({
  reducer: {
    parts: partsReducer,
    dialog: dialogReducer,
    rejectionsReducer: rejectionsReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
