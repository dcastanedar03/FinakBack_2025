import { OptionalId, ObjectId } from "mongodb";

export type ContactModel = OptionalId<{
    name: string;
}>;