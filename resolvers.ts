import { GraphQLError } from "graphql";
import { ObjectId, Collection } from "mongodb";
import {APIPhone, APITime, RestaurantModel } from "./type.ts";

type GetRestaurantQueryArgs ={
  id: string
}
type DeleteRestaurantMutationArgs={
  id: string
}
type AddRestaurantMutationArgs ={
  name: string,
  direction: string,
  city: string,
  phone: string,
}
type Context = {
  RestaurantCollection: Collection<RestaurantModel>
}

export const resolvers = {
    Query: {
      getRestaurant: async (_: unknown, args: GetRestaurantQueryArgs, ctx: Context): Promise<RestaurantModel|null > => {
          return await ctx.RestaurantCollection.findOne({_id: new ObjectId(args.id)})
      },
      getRestaurants: async (_: unknown, __: unknown, ctx: Context): Promise<RestaurantModel[] > => {
        return await ctx.RestaurantCollection.find().toArray()
      }
    },
    Mutation: {
      deleteRestaurant: async (_: unknown, args: DeleteRestaurantMutationArgs, ctx: Context): Promise<boolean > => {
        const {deletedCount} = await ctx.RestaurantCollection.deleteOne({_id: new ObjectId(args.id)})
        return deletedCount === 1;
      },
      addRestaurant: async(_: unknown, args: AddRestaurantMutationArgs, ctx: Context) : Promise<RestaurantModel> =>{
        const API_KEY = Deno.env.get("API_KEY")
        if (!API_KEY) throw new GraphQLError("API_KEY NOT DEFINED")
        const {name, direction, city, phone} = args
        const phoneExists= await ctx.RestaurantCollection.countDocuments({phone})
        if(phoneExists>=1) throw new GraphQLError("el telefono ya existe")
        const url = `https://api.api-ninjas.com/v1/validatephone?number=${phone}`
        const data = await fetch(url,{headers: { "X-Api-Key": API_KEY}})
        if(data.status !== 200) throw new GraphQLError("error url1")
        const response : APIPhone = await data.json()
        if(!response.is_valid) throw new GraphQLError("Incorrect Phone format")
        const country = response.country
        const timezone = response.timezones[0]
        const {insertedID} = await ctx.RestaurantCollection.insertOne({
          name,
          direction,
          city,
          country,
          phone,
          timezone,
        })
        return{
          _id: insertedID,
          name,
          direction,
          city,
          country,
          phone,
          timezone,
        }
      }
      

    },
    Restaurant :{
      id: (parent: RestaurantModel): string => parent._id!.toString(),
      time: async (parent: RestaurantModel): Promise<string>=>{
        const API_KEY = Deno.env.get("API_KEY")
        if (!API_KEY) throw new GraphQLError("API_KEY NOT DEFINED")
        const timezone = parent.timezone;
        const url = `https://api.api-ninjas.com/v1/worldtime?timezone=${timezone}`
        const data = await fetch(url,{headers: { "X-Api-Key": API_KEY}})
        if(data.status !== 200) throw new GraphQLError("error url2")
        const response : APITime = await data.json()
        return response.datetime;
      }
    }
};