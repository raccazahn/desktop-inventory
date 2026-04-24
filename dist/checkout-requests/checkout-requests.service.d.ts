import { Repository } from 'typeorm';
import { CheckoutRequest } from '../entities/checkout-request.entity';
import { Equipment } from '../entities/equipment.entity';
import { CreateCheckoutRequestDto, UpdateCheckoutRequestDto } from './dto/create-checkout-request.dto';
export declare class CheckoutRequestsService {
    private readonly requestRepository;
    private readonly equipmentRepository;
    constructor(requestRepository: Repository<CheckoutRequest>, equipmentRepository: Repository<Equipment>);
    create(userId: number, createDto: CreateCheckoutRequestDto): Promise<CheckoutRequest>;
    findByStudent(studentId: number): Promise<CheckoutRequest[]>;
    findAll(status?: string): Promise<CheckoutRequest[]>;
    findOne(id: number): Promise<CheckoutRequest>;
    updateStatus(id: number, updateDto: UpdateCheckoutRequestDto): Promise<CheckoutRequest>;
    remove(id: number): Promise<any>;
    sendReminder(id: number): Promise<any>;
    findOverdueRequests(): Promise<CheckoutRequest[]>;
}
