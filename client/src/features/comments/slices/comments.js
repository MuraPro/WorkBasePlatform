import { createAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { handleError } from '@shared/lib/errors';
import commentService from '../api/comment.service';

const initialState = {
  entities: null,
  isLoading: false,
  error: null,
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    commentsRequested: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    commentsReceived: (state, action) => {
      state.entities = action.payload;
      state.isLoading = false;
    },
    commentsRequestFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    commentCreated: (state, action) => {
      if (!Array.isArray(state.entities)) state.entities = [];
      state.entities.push(action.payload);
    },
    commentCreatedFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },

    commentRemoved: (state, action) => {
      if (!Array.isArray(state.entities)) return;
      state.entities = state.entities.filter((c) => c._id !== action.payload);
    },
    commentRemovedFailed: (state, action) => {
      state.error = action.payload;
      state.isLoading = false;
    },
  },
});

const { reducer: commentsReducer, actions } = commentsSlice;
const {
  commentsRequested,
  commentsReceived,
  commentsRequestFailed,
  commentCreated,
  commentCreatedFailed,
  commentRemoved,
  commentRemovedFailed,
} = actions;

const addCommentRequested = createAction('comments/addCommentRequested');
const removeCommentRequested = createAction('comments/removeCommentRequested');

export const loadCommentsList = createAsyncThunk(
  'comments/loadCommentsList',
  async (userId, { dispatch, rejectWithValue }) => {
    dispatch(commentsRequested());
    try {
      const { content } = await commentService.getComments(userId);
      dispatch(commentsReceived(content));
      return content;
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(commentsRequestFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const createComment = (payload) => async (dispatch, getState) => {
  dispatch(addCommentRequested(payload));
  try {
    const comment = {
      ...payload,
      created_at: Date.now(),
    };

    const { content } = await commentService.createComment(comment);
    dispatch(commentCreated(content));
  } catch (error) {
    handleError(error);
    const message = error?.response?.data.status;
    dispatch(commentCreatedFailed(message));
    return rejectWithValue(message);
  }
};

// Удаление комментария
export const removeComment = createAsyncThunk(
  'comments/removeComment',
  async (commentId, { dispatch, rejectWithValue }) => {
    dispatch(removeCommentRequested());
    try {
      const { content } = await commentService.removeComment(commentId);
      if (content?.message === 'Комментарий успешно удалён') {
        dispatch(commentRemoved(commentId));
      }

      return commentId;
    } catch (error) {
      handleError(error);
      const message = error?.response?.data.status;
      dispatch(commentRemovedFailed(message));
      return rejectWithValue(message);
    }
  }
);

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
  state.comments.isLoading;
export const getCommentsError = () => (state) => state.comments.error;

export default commentsReducer;
