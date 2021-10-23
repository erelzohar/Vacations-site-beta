class VacationModel {

    public uuid : string;
    public destination : string;
    public description : string;
    public price : number;
    public vacationStart : string;
    public vacationEnd : string;
    public imageName : string;
    public image : FileList;
    public followers : number;

    
    public static convertToFormData(vacation: VacationModel): FormData {
        const myFormData = new FormData();
        myFormData.append("destination", vacation.destination);
        myFormData.append("price", vacation.price.toString());
        myFormData.append("description", vacation.description);
        myFormData.append("vacationStart", vacation.vacationStart);
        myFormData.append("vacationEnd", vacation.vacationEnd);
        myFormData.append("image", vacation.image.item(0));
        return myFormData;
    }

}

export default VacationModel;