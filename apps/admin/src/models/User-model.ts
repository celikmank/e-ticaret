
export interface UserModel {
    id?: string;
    firstName: string;
    lastName: string;
    fullName: string;
    username: string;
    email: string;
    password?: string;
    isAdmin: boolean;
}

export const initialUser: UserModel = {
    id: '',
    firstName: '',
    lastName: '',
    fullName: '',
    username: '',
    email: '',
    password: '',
    isAdmin: false,
};