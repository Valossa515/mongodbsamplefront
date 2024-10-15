import { BookDTO } from "./Book";

export interface ReservationDTO{
    Id: string;
    BookIds: string[];
    UserId: string;
    UserName: string;
    ReservationDate: Date;
    ReturnDate?: Date;
    Status?: string;
}