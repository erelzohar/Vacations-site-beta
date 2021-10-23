import VacationModel from "../Models/VacationModel";

export class VacationsState {
    public vacations: VacationModel[] = []; 
}

// Vacations Action Type: 
export enum VacationsActionType {
    VacationsDownloaded = "VacationsDownloaded",
    VacationAdded = "VacationAdded",
    VacationUpdated = "VacationUpdated",
    VacationDeleted = "VacationDeleted"
}

// Vacations Action:
export interface VacationsAction {
    type: VacationsActionType;
    payload?: any;
}
// Vacations Action Creators: 
export function vacationsDownloadedAction(vacations: VacationModel[]): VacationsAction {
    return { type: VacationsActionType.VacationsDownloaded, payload: vacations };
}
export function vacationAddedAction(addedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationAdded, payload: addedVacation };
}
export function vacationUpdatedAction(updatedVacation: VacationModel): VacationsAction {
    return { type: VacationsActionType.VacationUpdated, payload: updatedVacation };
}
export function vacationDeletedAction(uuid: string): VacationsAction {
    return { type: VacationsActionType.VacationDeleted, payload: uuid };
}

// Vacations Reducer: 
export function vacationsReducer(currentState: VacationsState = new VacationsState(), action: VacationsAction): VacationsState {

    const newState = { ...currentState };

    switch (action.type) {

        case VacationsActionType.VacationsDownloaded: // payload = all Vacations
            newState.vacations = action.payload;
            break;

        case VacationsActionType.VacationAdded: // payload = added Vacation
            newState.vacations.push(action.payload);
            break;

        case VacationsActionType.VacationUpdated: // payload = updated Vacation
            const indexToUpdate = newState.vacations.findIndex(v => v.uuid === action.payload.uuid);
            newState.vacations[indexToUpdate] = action.payload;
            break;

        case VacationsActionType.VacationDeleted: // payload = Vacation uuid to delete
            const indexToDelete = newState.vacations.findIndex(v => v.uuid === action.payload);
            newState.vacations.splice(indexToDelete, 1);
            break;
    }

    return newState;

}