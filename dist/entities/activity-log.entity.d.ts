import { User } from './user.entity';
export declare class ActivityLog {
    id: number;
    action: string;
    entity_type: string;
    entity_id: number;
    changes: object;
    description: string;
    ip_address: string;
    user_id: number;
    created_at: Date;
    user: User;
}
