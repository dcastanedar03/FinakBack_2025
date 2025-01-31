import { OptionalId, ObjectId } from "mongodb";

export type RestaurantModel = OptionalId<{
    name: string
    direction: string
    city: string
    country: string
    timezone: string
    phone: string
}>;


export type APIPhone = {
    is_valid: boolean
    country: string
    timezones: string
}

export type APITime = {
    datetime: string
}

export type APIWheader = {

}