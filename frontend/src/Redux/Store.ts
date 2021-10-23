import { combineReducers, createStore } from "redux";
import { authReducer } from "./AuthState";
import { followersReducer } from "./followersState";
import { vacationsReducer } from "./VacationsState";

const reducers = combineReducers({ vacationsState: vacationsReducer, authState: authReducer ,followersState:followersReducer});
const store = createStore(reducers);

export default store;

