import { Equipment } from './equipment.entity';
export declare class Alert {
    id: number;
    title: string;
    message: string;
    severity: string;
    status: string;
    triggered_by: string;
    equipment_id: number;
    created_at: Date;
    equipment: Equipment;
}
