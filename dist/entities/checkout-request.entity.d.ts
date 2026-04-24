import { User } from './user.entity';
import { Equipment } from './equipment.entity';
export declare class CheckoutRequest {
    id: number;
    equipment: Equipment;
    equipmentId: number;
    student: User;
    studentId: number;
    borrowerName: string;
    borrowerEmail: string;
    dueDate: Date;
    purpose: string;
    status: string;
    adminNotes: string;
    createdAt: Date;
    updatedAt: Date;
    approvedAt: Date;
    pickedUpAt: Date;
    returnedAt: Date;
}
