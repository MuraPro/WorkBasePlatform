import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleError } from '@shared/lib/errors';
import { memoSelector } from '@shared/lib/helpers/memoSelector';
import { localStorageService } from '@shared/lib/storage';
import authService from '../api/auth.service';
import userService from '../api/user.service';

const hasToken = localStorageService.getAccessToken();

const initialState = hasToken
  ? {
      entities: null,
      isLoading: true,
      error: null,
      auth: { userId: localStorageService.getUserId() ?? null },
      isLoggedIn: true,
      dataLoaded: false,
    }
  : {
      entities: null,
      isLoading: false,
      error: null,
      auth: { userId: null },
      isLoggedIn: false,
      dataLoaded: false,
    };

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    usersRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    usersReceived: (state, action) => {
      state.entities = action.payload;
      state.dataLoaded = true;
      state.isLoading = false;
    },
    usersRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    authRequestSuccess: (state, action) => {
      state.auth = action.payload ?? { userId: null };
      state.isLoggedIn = Boolean(action.payload?.userId);
    },
    authRequestFailed: (state, action) => {
      state.error = action.payload;
    },
    userCreated: (state, action) => {
      if (!Array.isArray(state.entities)) state.entities = [];
      state.entities.push(action.payload);
    },
    userLoggedOut: (state) => {
      state.entities = null;
      state.isLoggedIn = false;
      state.auth = { userId: null };
      state.dataLoaded = false;
    },
    userUpdateSuccessed: (state, action) => {
      if (!Array.isArray(state.entities)) return;
      const updated = action.payload;
      console.log(action);
      state.entities = state.entities.map((u) =>
        String(u._id) === String(updated._id) ? updated : u
      );
      state.entities = [...state.entities];
    },
  },
});

const { reducer: usersReducer, actions } = usersSlice;
const {
  usersRequested,
  usersReceived,
  usersRequestFailed,
  authRequestSuccess,
  authRequestFailed,
  userLoggedOut,
  userUpdateSuccessed,
} = actions;

const authRequested = createAction('users/authRequested');
const userUpdateRequested = createAction('users/userUpdateRequested');
const userUpdateFailed = createAction('users/userUpdateFailed');

export const login = createAsyncThunk(
  'users/signWithPassword',
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    dispatch(authRequested());
    try {
      const data = await authService.login({ email, password });
      localStorageService.setTokens(data);
      dispatch(authRequestSuccess({ userId: data.userId }));
      return { userId: data.userId };
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(authRequestFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const signUp = createAsyncThunk(
  'users/signUp',
  async (payload, { dispatch, rejectWithValue }) => {
    try {
      const data = await authService.register(payload);
      localStorageService.setTokens(data);
      dispatch(authRequestSuccess({ userId: data.userId }));
      return data.userId;
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(authRequestFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const logOut = () => (dispatch) => {
  localStorageService.removeAuthData();
  dispatch(userLoggedOut());
};

export const loadUsersList = () => async (dispatch) => {
  dispatch(usersRequested());
  try {
    const { content } = await userService.get();
    dispatch(usersReceived(content));
  } catch (error) {
    handleError(error);
    const message = error?.response?.data.status;
    dispatch(usersRequestFailed(message));
    return rejectWithValue(message);
  }
};

export const updateUser = createAsyncThunk(
  'users/updateUser',
  async (payload, { dispatch, rejectWithValue }) => {
    dispatch(userUpdateRequested());
    try {
      const { content } = await userService.update(payload);
      dispatch(userUpdateSuccessed(content));
      return content;
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(userUpdateFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const toggleLike = createAsyncThunk(
  'users/toggleLike',
  async (profileId, { getState, dispatch, rejectWithValue }) => {
    dispatch(userUpdateRequested());

    const state = getState();
    const currentUserId = state.users.auth?.userId;

    if (!currentUserId) {
      return rejectWithValue('Пользователь не авторизован');
    }

    if (currentUserId === profileId) {
      return rejectWithValue('Вы не можете лайкнуть сами себя');
    }

    try {
      const resp = await userService.likeUser(profileId);

      const updatedUser = resp.content?.content
        ? resp.content.content
        : resp.content;

      dispatch(userUpdateSuccessed(updatedUser));
      return updatedUser;
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(userUpdateFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const hasUserLiked = (profileId) => (state) => {
  const currentUserId = String(state.users.auth?.userId);
  const user = state.users.entities?.find(
    (u) => String(u._id) === String(profileId)
  );

  if (!user) return false;

  return user.likedBy.map(String).includes(currentUserId);
};

export const toggleFavorite = createAsyncThunk(
  'users/toggleFavorite',
  async (profileId, { dispatch, getState, rejectWithValue }) => {
    dispatch(userUpdateRequested());

    try {
      const { content } = await userService.favoriteUser(profileId);
      const currentUser = content.content;
      dispatch(userUpdateSuccessed(currentUser));
      return currentUser;
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(userUpdateFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const getUsersList = () => (state) => state.users.entities;

export const getCurrentUserData = () => (state) => {
  const userId = state.users.auth?.userId;
  const list = state.users.entities;
  if (!userId || !Array.isArray(list)) return null;
  return list.find((u) => u._id === userId) ?? null;
};

export const getUserById = (userId) => (state) => {
  const list = state.users.entities;
  if (!Array.isArray(list)) return null;

  return (
    list.find((u) => {
      const id = typeof u._id === 'object' ? u._id.toString() : u._id;
      return id === userId;
    }) ?? null
  );
};

export const isFavorite = (id) => (state) => {
  const currentUser = getCurrentUserData()(state);
  if (!currentUser) return false;

  return currentUser.favorites?.map(String).includes(String(id));
};
export const getIsLoggedIn = memoSelector(
  () => (state) => state.users.isLoggedIn
);
export const getDataStatus = memoSelector(
  () => (state) => state.users.dataLoaded
);
export const getUsersLoadingStatus = memoSelector(
  () => (state) => state.users.isLoading
);
export const getCurrentUserId = memoSelector(
  () => (state) => state.users.auth?.userId ?? null
);
export const getAuthErrors = memoSelector(() => (state) => state.users.error);

export default usersReducer;
