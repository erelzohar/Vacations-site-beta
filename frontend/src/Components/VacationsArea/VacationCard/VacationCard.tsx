import VacationModel from "../../../Models/VacationModel";
import globals from "../../../Services/Globals";
import { DeleteForever, Edit } from "@material-ui/icons";
import "./VacationCard.css";
import notify from "../../../Services/Notify";
import store from "../../../Redux/Store";
import { vacationDeletedAction } from "../../../Redux/VacationsState";
import jwtAxios from "../../../Services/JwtAxios";
import { NavLink } from "react-router-dom";
import Switch from "react-switch";
import { useEffect } from "react";
import { followerAddedAction, FollowersDownloadedAction, UnfollowedAction } from "../../../Redux/followersState";

interface VacationCardProps {
    vacation: VacationModel;
}

store.dispatch(FollowersDownloadedAction(JSON.parse(localStorage.getItem("followedVacations"))));

function VacationCard(props: VacationCardProps): JSX.Element {

    useEffect(() => {
        store.dispatch(FollowersDownloadedAction(JSON.parse(localStorage.getItem("followedVacations"))));
    }, []);

    async function followUnfollowAsync(vacationUuid: string) {
        try {
            const response = await jwtAxios.post(globals.vacationsUrl + "follow/" + vacationUuid, { uuid: store.getState().authState.user.uuid });
            if (response.data === "Followed!") {
                const newArr = JSON.parse(localStorage.getItem("followedVacations"));
                newArr.push(vacationUuid);
                localStorage.setItem("followedVacations", JSON.stringify(newArr));
                store.dispatch(followerAddedAction(vacationUuid));
            }
            else {
                const newArr: string[] = JSON.parse(localStorage.getItem("followedVacations"));
                const index = newArr.findIndex(e => e === vacationUuid);
                newArr.splice(index, 1);
                localStorage.setItem("followedVacations", JSON.stringify(newArr));
                store.dispatch(UnfollowedAction(vacationUuid));
            }
            notify.success(response.data);
        }
        catch (err) {
            notify.error(err);
        }
    }

    async function deleteVacationAsync(uuid: string) {

        try {
            const ok = window.confirm("Are you sure?");
            if (!ok) return;
            await jwtAxios.delete(globals.vacationsUrl + uuid);
            store.dispatch(vacationDeletedAction(uuid));
            notify.success("Vacation deleted!");

        }

        catch (err) {
            notify.error(err)
        }
    }


    const checked = (): boolean => {
        for (let item of store.getState().followersState.followedVacationsUuid) {
            if (item === props.vacation.uuid) return true;
        }
        return false
    };
    
    return (
        <div className="VacationCard Box">
            <div>
                {store.getState().authState.user.isAdmin && <span>
                    <button onClick={() => deleteVacationAsync(props.vacation.uuid)}><DeleteForever /></button>
                    <button ><NavLink to={"admin-home/update/" + props.vacation.uuid} ><Edit /></NavLink></button>
                </span>
                }
                {!store.getState().authState.user.isAdmin &&
                    <> <span>following :   <Switch checked={checked()} onChange={() => followUnfollowAsync(props.vacation.uuid)} /></span>
                    </>}
                <br />
                {props.vacation.destination}
                <br />
                Price: ${props.vacation.price}
                <br />
                From : {props.vacation.vacationStart.slice(0, 10)}
                <br />
                To : {props.vacation.vacationEnd.slice(0, 10)}
                <br />
                Description: {props.vacation.description}
                <br />
                Followers : {props.vacation.followers}
            </div>
            <img alt="" src={globals.vacationsUrl + "images/" + props.vacation.imageName} />
        </div>
    );
}

export default VacationCard;
