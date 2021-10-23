// Login

import "./Login.css";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import axios from "axios";
import store from "../../../Redux/Store";
import { userLoggedInAction } from "../../../Redux/AuthState";
import globals from "../../../Services/Globals";
import CredentialsModel from "../../../Models/CredentialsModel";
import UserModel from "../../../Models/UserModel";
import notify from "../../../Services/Notify";
import jwtAxios from "../../../Services/JwtAxios";
import VacationModel from "../../../Models/VacationModel";
import { FollowersDownloadedAction } from "../../../Redux/followersState";

function Login(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<CredentialsModel>();

    // Submit:
    async function submit(credentials: CredentialsModel) {
        try {
            const response = await axios.post<UserModel>(globals.loginUrl, credentials);
            store.dispatch(userLoggedInAction(response.data));
            notify.success("Logged-in successfully.");

            if (response.data.isAdmin) {
                history.push("/admin-home"); return;
            }
            const followerResponse = await jwtAxios.get(globals.vacationsUrl + "check-follower/" + store.getState().authState.user.uuid);
            const followedVacations:VacationModel[] = followerResponse.data;
            const followersState:string[] = [];

            followedVacations.map(v=>followersState.push(v.uuid));
            store.dispatch(FollowersDownloadedAction(followersState));
            localStorage.setItem("followedVacations",JSON.stringify(followersState));

            delete response.data.isAdmin;
            history.push("/home");
        }
        catch (err) {
            notify.error(err);
        }
    }



    return (
        <div className="Login Box">

            <h2>Log in</h2>

            <form onSubmit={handleSubmit(submit)}>

                <label>Username:</label>
                <input type="text" autoFocus {...register("username", {
                    required: { value: true, message: "Missing username." },
                    minLength: { value: 4, message: "Username too short." }
                })} />
                <span>{formState.errors.username?.message}</span>

                <label>Password:</label>
                <input type="password" {...register("password", {
                    required: { value: true, message: "Missing password." },
                    minLength: { value: 4, message: "password too short." }
                })} />
                <span>{formState.errors.password?.message}</span>

                <button>Log in</button>

            </form>
        </div>
    );
}

export default Login;