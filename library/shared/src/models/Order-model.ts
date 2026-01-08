import { cartModel } from "./cart.model";
export interface OrderModel {
    id?: string;
    userId: string;
    orderNumber:string;
    date: Date;
    fullName: string;
    phoneNumber: string;
    city: string;
    district: string;
    fullAddress: string;
    cartNumber: string;
    cartOwnerName: string;
    expiresDate: string;
    cvv: number;
    installmentOptions: string;
    status:string;
    carts: cartModel[];
}

export const initialOrder: OrderModel = {
    userId: "",
    fullName: "",
    orderNumber: "",
    date: new Date(),
    phoneNumber: "",
    city: "",
    district: "",
    fullAddress: "",
    cartNumber: "",
    cartOwnerName: "",
    expiresDate: "",
    cvv: 0,
    installmentOptions: "",
    status: "Hazırlanıyor",
    carts: []
}