import "./PleaseWait.css";
import loadingImage from "../../../Assets/Images/loading.gif";

function PleaseWait(): JSX.Element {
    return (
        <div className="PleaseWait">
			<img alt="" src={loadingImage} />
        </div>
    );
}

export default PleaseWait;
