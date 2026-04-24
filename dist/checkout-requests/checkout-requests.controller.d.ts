import { CheckoutRequestsService } from './checkout-requests.service';
import { CreateCheckoutRequestDto, UpdateCheckoutRequestDto } from './dto/create-checkout-request.dto';
export declare class CheckoutRequestsController {
    private readonly service;
    constructor(service: CheckoutRequestsService);
    create(req: any, createDto: CreateCheckoutRequestDto): Promise<import("../entities/checkout-request.entity").CheckoutRequest>;
    findMyRequests(req: any): Promise<import("../entities/checkout-request.entity").CheckoutRequest[]>;
    findAll(status?: string): Promise<import("../entities/checkout-request.entity").CheckoutRequest[]>;
    findOne(id: string): Promise<import("../entities/checkout-request.entity").CheckoutRequest>;
    updateStatus(id: string, updateDto: UpdateCheckoutRequestDto): Promise<import("../entities/checkout-request.entity").CheckoutRequest>;
    remove(id: string): Promise<any>;
    sendReminder(id: string): Promise<any>;
}
