class UserModel {
    public uuid: number;
    public firstName: string;
    public lastName: string;
    public username: string;
    public password: string;
    public isAdmin: boolean;
    public token: string;
}

export default UserModel;