import { User } from './user.entity';
import { Equipment } from './equipment.entity';
export declare class Checkout {
    id: number;
    equipment: Equipment;
    equipmentId: number;
    user: User;
    userId: number;
    borrowerName: string;
    borrowerEmail: string;
    dueDate: Date;
    purpose: string;
    status: string;
    createdAt: Date;
    returnDate: Date;
}
