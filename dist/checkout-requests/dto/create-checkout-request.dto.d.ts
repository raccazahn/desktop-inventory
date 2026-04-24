export declare class CreateCheckoutRequestDto {
    equipmentId: number;
    studentId?: number;
    borrowerName: string;
    borrowerEmail: string;
    dueDate: string;
    purpose: string;
}
export declare class UpdateCheckoutRequestDto {
    status?: string;
    adminNotes?: string;
}
