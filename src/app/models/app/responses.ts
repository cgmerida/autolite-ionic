import { User } from 'firebase';
import { Order } from './order';

export class Responses {
    uid?: string;
    userUid: User["uid"];
    orderUid: Order["uid"];
    responses: object; // [{question: "", response:"0-5"}]
    createdAt: Date;
    updatedAt: Date;
}