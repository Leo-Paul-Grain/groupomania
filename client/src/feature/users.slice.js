import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const usersSlice = createSlice({
    name: "users",
    initialState: {
        users: ' ',
    },
    reducers: {
        setUsersData: (state, action) => {
            state.users = action.payload;
        },
    },
});

export default usersSlice.reducer;

//Action
const { setUsersData } = usersSlice.actions;

export const fetchUsers = () => async dispatch => {
    try {
        await axios
        .get(`${process.env.REACT_APP_API_URL}api/user`)
        .then((res) => dispatch(setUsersData(res.data)))
        } catch (err) {
            return console.log(err)
        }
    };