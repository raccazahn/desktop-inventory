import { User } from './user.entity';
import { Equipment } from './equipment.entity';
export declare class Maintenance {
    id: number;
    title: string;
    description: string;
    status: string;
    scheduled_date: Date;
    completed_date: Date;
    cost: number;
    technician_notes: string;
    equipment_id: number;
    assigned_to: number;
    created_at: Date;
    updated_at: Date;
    equipment: Equipment;
    assigned_to_user: User;
}
