import { GraphQLError } from "graphql";
import { ObjectId, Collection } from "mongodb";
import {ContactModel } from "./type.ts";

export const resolvers = {
    Query: {
        test: async (_: unknown, args: unknown, ctx: unknown): Promise<String > => {
            return ("Holita")
        }
    }
};