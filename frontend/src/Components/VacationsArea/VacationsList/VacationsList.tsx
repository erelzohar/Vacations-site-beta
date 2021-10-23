import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import "./VacationsList.css";
import notify from "../../../Services/Notify";
import { History } from "history";
import jwtAxios from "../../../Services/JwtAxios";
import globals from "../../../Services/Globals";
import { vacationsDownloadedAction } from "../../../Redux/VacationsState";
import VacationCard from "../VacationCard/VacationCard";
import PleaseWait from "../../SharedArea/PleaseWait/PleaseWait";
import { userLoggedOutAction } from "../../../Redux/AuthState";
import { Unsubscribe } from "redux";


interface VacationsListProps {
    history: History;
}

interface VacationsListState {
    vacations: VacationModel[];
}

class VacationsList extends Component<VacationsListProps, VacationsListState> {

    private unsubscribe: Unsubscribe;


    public constructor(props: VacationsListProps) {
        super(props);
        this.state = { vacations: store.getState().vacationsState.vacations };
    }

    public async componentDidMount() {
        try {

            // Block non logged-in users:
            if (!store.getState().authState.user) {
                notify.error("You are not logged in.");
                this.props.history.push("/login");
                return;
            }


            if (this.state.vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(globals.vacationsUrl + store.getState().authState.user.uuid);//store.getState().authState.user.uuid
                this.setState({ vacations: response.data });
                store.dispatch(vacationsDownloadedAction(response.data));
            }

            this.unsubscribe = store.subscribe(() => { this.setState({ vacations: store.getState().vacationsState.vacations }) });
        }
        catch (err) {
            notify.error(err);
        }
    }



    public componentWillUnmount() {
        
        if(this.unsubscribe) this.unsubscribe();
        window.setTimeout(()=> store.dispatch(userLoggedOutAction()),60000 * 20);
    }

    public render(): JSX.Element {

        return (
            <div className="VacationsList">

                {this.state.vacations.length === 0 && <PleaseWait />}

                {this.state.vacations.map((v, index) => <VacationCard vacation={v} key={index} />)}
            </div>
        );
    }
}

export default VacationsList;
