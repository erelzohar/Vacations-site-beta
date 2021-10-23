import { useForm } from "react-hook-form";
import { useHistory } from "react-router";
import VacationModel from "../../../Models/VacationModel";
import { vacationAddedAction } from "../../../Redux/VacationsState";
import store from "../../../Redux/Store";
import globals from "../../../Services/Globals";
import jwtAxios from "../../../Services/JwtAxios";
import "./AddVacation.css";
import notify from "../../../Services/Notify";

function AddVacation(): JSX.Element {

    const history = useHistory();
    const { register, handleSubmit, formState } = useForm<VacationModel>();

    async function addVacation(vacation: VacationModel) {
        try {
            if (!store.getState().authState.user.isAdmin) {
                notify.error("You are not an admin!");
                history.push("/home");
                return;
            }
            const response = await jwtAxios.post<VacationModel>(globals.vacationsUrl, VacationModel.convertToFormData(vacation));
            const addedVacation = response.data; // The added vacation the backend returns.
            store.dispatch(vacationAddedAction(addedVacation));
            notify.success("Vacation has been added.");
            history.push("/admin-home");
        }
        catch (err) {
            notify.error("Error: " + err);
        }
    }

    return (
        <div className="AddVacation Box">

            <h2>Add new Vacation</h2>

            <form onSubmit={handleSubmit(addVacation)}>

                <label>Destination: </label> <br />
                <input type="text" autoFocus {...register("destination", { required: true, minLength: 3 })} />
                {formState.errors.destination?.type === "required" && <span>Missing destination.</span>}
                {formState.errors.destination?.type === "minLength" && <span>Destination too short.</span>}
                <br /><br />

                <label>Price: </label> <br />
                <input type="number" step="0.01" {...register("price", { required: true, min: 0 })} />
                {formState.errors.price?.type === "required" && <span>Missing price.</span>}
                {formState.errors.price?.type === "min" && <span>Price can't be negative.</span>}
                <br /><br />

                <label>Description: </label> <br />
                <input type="text" {...register("description", { required: true, minLength: 8 })} />
                {formState.errors.description?.type === "required" && <span>Missing description.</span>}
                {formState.errors.description?.type === "minLength" && <span>Description too short.</span>}
                <br /><br />

                <label>Starts At: </label> <br />
                <input type="date" {...register("vacationStart", { required: true, minLength: 8 })} />
                {formState.errors.vacationStart?.type === "required" && <span>Missing date.</span>}
                <br /><br />

                <label>Ends At: </label> <br />
                <input type="date" {...register("vacationEnd", { required: true, minLength: 8 })} />
                {formState.errors.vacationEnd?.type === "required" && <span>Missing date.</span>}
                <br /><br />

                <label>Image: </label> <br />
                <input type="file" accept="image/*" {...register("image", { required: true })} />
                {formState.errors.image?.type === "required" && <span>Missing image.</span>}
                <br /><br />

                <button>Add</button>

            </form>

        </div>
    );
}

export default AddVacation;
