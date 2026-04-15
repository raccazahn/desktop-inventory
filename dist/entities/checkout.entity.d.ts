import { User } from './user.entity';
import { Equipment } from './equipment.entity';
export declare class Checkout {
    id: number;
    checkout_date: Date;
    expected_return_date: Date;
    actual_return_date: Date;
    purpose: string;
    status: string;
    notes: string;
    user_id: number;
    equipment_id: number;
    created_at: Date;
    updated_at: Date;
    user: User;
    equipment: Equipment;
}
