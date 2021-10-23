
export class followersState{
    public followedVacationsUuid:string[] = [];
}

export enum FollowersActionType{
    FollowersDownloaded = "FollowersDownloaded",
    FollowedVacation = "FollowedVacation",
    UnfollowedVacation = "UnfollowedVacation"
}

export interface FollowerAction {
    type: FollowersActionType;
    payload?: any;
}
// Vacations Action Creators: 
export function followerAddedAction(vacationUuid:string): FollowerAction {
    return { type: FollowersActionType.FollowedVacation, payload: vacationUuid };
}
export function UnfollowedAction(vacationUuid:string): FollowerAction {
    return { type: FollowersActionType.UnfollowedVacation, payload: vacationUuid };
}
export function FollowersDownloadedAction(followedVacations:string[]): FollowerAction {
    return { type: FollowersActionType.FollowersDownloaded, payload: followedVacations };
}

// Vacations Reducer: 
export function followersReducer(currentState: followersState = new followersState(), action: FollowerAction): followersState {

    const newState = { ...currentState };

    switch (action.type) {

        case FollowersActionType.FollowersDownloaded: // payload = all Vacations
            newState.followedVacationsUuid = action.payload;
            break;

        case FollowersActionType.FollowedVacation: // payload = added Vacation
            newState.followedVacationsUuid.push(action.payload);
            break;

        case FollowersActionType.UnfollowedVacation: // payload = Vacation uuid to delete
            const indexToDelete = newState.followedVacationsUuid.findIndex(v => v === action.payload);
            newState.followedVacationsUuid.splice(indexToDelete, 1);
            break;
    }

    return newState;

}