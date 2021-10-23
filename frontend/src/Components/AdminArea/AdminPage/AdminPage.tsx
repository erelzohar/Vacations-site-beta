import { Component } from "react";
import VacationModel from "../../../Models/VacationModel";
import store from "../../../Redux/Store";
import "./AdminPage.css";
import notify from "../../../Services/Notify";
import { History } from "history";
import jwtAxios from "../../../Services/JwtAxios";
import globals from "../../../Services/Globals";
import { vacationsDownloadedAction } from "../../../Redux/VacationsState";
import PleaseWait from "../../SharedArea/PleaseWait/PleaseWait";
import VacationCard from "../../VacationsArea/VacationCard/VacationCard";
import { Unsubscribe } from "redux";


interface AdminPageProps {
    history: History;
}

interface AdminPageState {
    vacations: VacationModel[];
}

class AdminPage extends Component<AdminPageProps, AdminPageState> {

    private unsubscribe : Unsubscribe;

    public constructor(props: AdminPageProps) {
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

            // Block non admin users:
            if (!store.getState().authState.user.isAdmin) {
                notify.error("You are not an admin.");
                this.props.history.push("/home");
                return;
            }

            if (this.state.vacations.length === 0) {
                const response = await jwtAxios.get<VacationModel[]>(globals.vacationsUrl + store.getState().authState.user.uuid);//store.getState().authState.user.uuid
                this.setState({ vacations: response.data });
                store.dispatch(vacationsDownloadedAction(response.data));
            }
            this.unsubscribe = store.subscribe(() => { this.setState({ vacations: store.getState().vacationsState.vacations }) })
        }
        catch (err) {
            notify.error(err);
        }
    }

    componentWillUnmount(){
        this.unsubscribe && this.unsubscribe();
    }

    public render(): JSX.Element {
        return (
            <div className="AdminPage">
                <div>
                    {this.state.vacations.length === 0 && <PleaseWait />}
                </div>
                {this.state.vacations.map((v, index) =>
                    <div key={index}>

                        <VacationCard vacation={v} />
                    </div>
                )}
            </div>
        );
    }
}

export default AdminPage;
