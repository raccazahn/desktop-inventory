import { Category } from './category.entity';
export declare class Equipment {
    id: number;
    name: string;
    asset_tag: string;
    description: string;
    serial_number: string;
    status: string;
    purchase_price: number;
    purchase_date: Date;
    location: string;
    is_active: boolean;
    category_id: number;
    created_at: Date;
    updated_at: Date;
    category: Category;
}
