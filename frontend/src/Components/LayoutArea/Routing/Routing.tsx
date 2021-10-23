import { Redirect, Route, Switch } from "react-router-dom";
import Page404 from "../../SharedArea/Page404/Page404";
// import Loadable from "react-loadable";
// import PleaseWait from "../../SharedArea/PleaseWait/PleaseWait";
import Register from "../../AuthArea/Register/Register";
import Login from "../../AuthArea/Login/Login";
import Logout from "../../AuthArea/Logout/Logout";
import VacationsList from "../../VacationsArea/VacationsList/VacationsList";
import AddVacation from "../../VacationsArea/AddVacation/AddVacation";
import AdminPage from "../../AdminArea/AdminPage/AdminPage";
import UpdateVacation from "../../VacationsArea/UpdateVacation/UpdateVacation";

function Routing(): JSX.Element {
    return (
        <Switch>
            <Route path="/home" component={VacationsList} exact />
            <Route path="/register" component={Register} exact />
            <Route path="/login" component={Login} exact />
            <Route path="/logout" component={Logout} exact />
            <Route path="/admin-home" component={AdminPage} exact />
            <Route path="/admin-home/new" component={AddVacation} exact />
            <Route path="/admin-home/update/:uuid" component={UpdateVacation} exact />
            {/* <Route path="/contact-us" component={Loadable({ loader: () => import("../../ContactUs/ContactUs"), loading: PleaseWait })} /> */}
            <Redirect from="/" to="/login" exact />
            <Route component={Page404} /> 
        </Switch>
    );
}

export default Routing;
