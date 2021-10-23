import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import VacationModel from "../../../Models/VacationModel";
import { vacationUpdatedAction } from "../../../Redux/VacationsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import "./UpdateVacation.css";
import notify from "../../../Services/Notify";
import { RouteComponentProps } from "react-router-dom";
import { SyntheticEvent, useEffect, useState } from "react";

interface RouteParams {
    uuid: string;
}

interface UpdateVacationProps extends RouteComponentProps<RouteParams> { }

function UpdateVacation(props: UpdateVacationProps): JSX.Element {


    const uuid = props.match.params.uuid;
    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();
    const [vacationToUpdate, setVacationToUpdate] = useState<VacationModel>(store.getState().vacationsState.vacations.filter(v => v.uuid === uuid)[0]);



    useEffect(() => {
        if (store.getState().vacationsState.vacations.find(v => v.uuid === uuid)) {
            const vacation: VacationModel = store.getState().vacationsState.vacations.filter(v => v.uuid === uuid)[0];
            vacation.vacationStart = vacation.vacationStart.slice(0, 10);
            vacation.vacationEnd = vacation.vacationEnd.slice(0, 10);

            setVacationToUpdate(vacation);
        }
        else {
            (async () => {
                const response = await jwtAxios.get<VacationModel>(globals.vacationsUrl + "select/" + uuid);
                response.data.vacationStart = response.data.vacationStart.slice(0, 10);
                response.data.vacationEnd = response.data.vacationEnd.slice(0, 10);
                setVacationToUpdate(response.data);
            })();
        }

    },[]);

    async function updateVacation(vacation: VacationModel) {
        try {
            if (!store.getState().authState.user?.isAdmin) {
                notify.error("You are not an admin!");
                history.push("/home");
                return;
            }
            if(!vacation.imageName) vacation.imageName = vacationToUpdate.imageName; 
            const response = await jwtAxios.put<VacationModel>(globals.vacationsUrl + uuid, VacationModel.convertToFormData(vacation));
            const updatedVacation = response.data; // The updated vacation the backend returns.
            store.dispatch(vacationUpdatedAction(updatedVacation));
            notify.success("Vacation has been updated.");
            history.push("/admin-home");
        }
        catch (err) {
            notify.error("Error: " + err);
        }
    }

    function textChanged(args: SyntheticEvent) {
        const value: any = (args.target as HTMLInputElement).value;
        const name: string = (args.target as HTMLInputElement).name;
        const newVacationToUpdate = { ...vacationToUpdate };
        switch (name) {
            case "destination":
                newVacationToUpdate.destination = value;
                setVacationToUpdate(newVacationToUpdate);
                break;
            case "description":
                newVacationToUpdate.description = value;
                setVacationToUpdate(newVacationToUpdate);

                break;
            case "price":
                newVacationToUpdate.price = +value;
                setVacationToUpdate(newVacationToUpdate);

                break;
            case "vacationStart":
                newVacationToUpdate.vacationStart = value;
                setVacationToUpdate(newVacationToUpdate);

                break;
            case "vacationEnd":
                newVacationToUpdate.vacationEnd = value;
                setVacationToUpdate(newVacationToUpdate);

                break;
            case "image":
                newVacationToUpdate.image = (value as FileList);
                setVacationToUpdate(newVacationToUpdate);

                break;

        }
        setVacationToUpdate(newVacationToUpdate);
    }

    return (
        <div className="UpdateVacation Box">

            <h2>Update Vacation</h2>

            <form onSubmit={handleSubmit(updateVacation)}>

                <label>Destination: </label> <br />
                <input name="destination" placeholder={vacationToUpdate.destination} onChange={e => textChanged(e)} type="text" autoFocus {...register("destination", { required: true, minLength: 3 })} />
                {formState.errors.destination?.type === "required" && <span>Missing destination.</span>}
                {formState.errors.destination?.type === "minLength" && <span>Destination too short.</span>}
                <br /><br />

                <label>Price: </label> <br />
                <input name="price" placeholder={vacationToUpdate.price.toLocaleString()} type="number" step="0.01" onChange={e => textChanged(e)} {...register("price", { required: true, min: 0 })} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}
                <br /><br />

                <label>Description: </label> <br />
                <input name="description" placeholder={vacationToUpdate.description} type="text" onChange={e => textChanged(e)} {...register("description", { required: true, minLength: 8 })} />
                {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                {formState.errors.description?.type === "minLength" && <span>Description too short.</span>}
                <br /><br />

                <label>Starts At: </label> <br />
                <input name="vacationStart" placeholder={vacationToUpdate.vacationStart.slice(0, 10)} type="date" onChange={e => textChanged(e)} {...register("vacationStart", { required: true, minLength: 8 })} />
                {formState.errors.vacationStart?.type === "required" && <span>Missing date.</span>}
                <br /><br />

                <label>Ends At: </label> <br />
                <input name="vacationEnd" placeholder={vacationToUpdate.vacationEnd.slice(0, 10)} type="date" onChange={e => textChanged(e)} {...register("vacationEnd", { required: true, minLength: 8 })} />
                {formState.errors.vacationEnd?.type === "required" && <span>Missing date.</span>}
                <br /><br />

                <label>Image: </label> <br />
                <input name="image" type="file" accept="image/*" onChange={e => textChanged(e)} {...register("image")} />
                <br /><br />

                <button>Update</button>

            </form>

        </div>
    );
}

export default UpdateVacation;
