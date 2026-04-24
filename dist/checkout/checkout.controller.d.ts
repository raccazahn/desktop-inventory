import { CheckoutService } from './checkout.service';
import { CreateCheckoutDto } from './dto/create-checkout.dto';
export declare class CheckoutController {
    private readonly checkoutService;
    constructor(checkoutService: CheckoutService);
    findAll(status?: string): Promise<import("../entities/checkout.entity").Checkout[]>;
    findOne(id: string): Promise<import("../entities/checkout.entity").Checkout>;
    create(createCheckoutDto: CreateCheckoutDto): Promise<import("../entities/checkout.entity").Checkout>;
    markAsReturned(id: string): Promise<any>;
    remove(id: string): Promise<any>;
}
