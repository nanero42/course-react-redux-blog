import { createSlice } from "@reduxjs/toolkit";
import { State } from "src/interfaces";

export interface User {
  id: string;
  name: string;
}

export interface UsersState {
  items: User[];
}

const initialState: UsersState = {
  items: [
    {
      id: '1234t5yu',
      name: 'Geralt',
    },
    {
      id: 'e2rfgthy67u',
      name: 'Yennefer',
    },
    {
      id: 'vfgui7u6t5r',
      name: 'Ciri',
    },
  ]
}

export const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {}
})

export const { reducer: usersReducer } = usersSlice;

export const getUsers = (state: State) => state.users.items;