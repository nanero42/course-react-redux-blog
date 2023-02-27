import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Status } from "src/enums";
import { State } from "src/interfaces";

export interface User {
  id: string;
  name: string;
}

export interface UsersState {
  items: User[];
  status: Status;
  error: any;
}

const USERS_URL = 'http://localhost:4000/users';

export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  return (await axios.get(USERS_URL)).data;
})

const initialState: UsersState = {
  items: [],
  status: Status.idle,
  error: null,
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(fetchUsers.pending, (state, action) => {
        state.status = Status.loading;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = Status.succeeded;
        state.items = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = Status.failed;
        state.error = action.error.message;
      })
  },
})

export const { reducer: usersReducer } = usersSlice;

export const getUsers = (state: State) => state.users.items;
export const getUsersStatus = (state: State) => state.users.status;
export const getUsersError = (state: State) => state.users.error;