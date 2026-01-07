declare enum UserRole {
    USER = "user",
    ADMIN = "admin"
}
export declare class CreateUserDto {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phoneNumber: string;
    gender: string;
    age?: number;
    isActive?: boolean;
    role?: UserRole;
}
export {};
