import { Repository } from 'typeorm';
import { Checkout } from '../entities/checkout.entity';
import { Equipment } from '../entities/equipment.entity';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
export declare class CheckoutService {
    private readonly checkoutRepository;
    private readonly equipmentRepository;
    constructor(checkoutRepository: Repository<Checkout>, equipmentRepository: Repository<Equipment>);
    findAll(status?: string): Promise<Checkout[]>;
    findOne(id: number): Promise<Checkout>;
    create(createCheckoutDto: CreateCheckoutDto): Promise<Checkout>;
    markAsReturned(id: number): Promise<any>;
    remove(id: number): Promise<any>;
    findOverdue(): Promise<Checkout[]>;
}
