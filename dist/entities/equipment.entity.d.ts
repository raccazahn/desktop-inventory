import { Checkout } from './checkout.entity';
export declare class Equipment {
    id: number;
    name: string;
    serialNumber: string;
    status: string;
    location: string;
    condition: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    checkouts: Checkout[];
}
