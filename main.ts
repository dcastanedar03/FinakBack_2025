import { MongoClient } from "mongodb";
import { ApolloServer } from "@apollo/server";
import { resolvers } from "./resolvers.ts";
import { RestaurantModel } from "./type.ts";
import { startStandaloneServer } from "@apollo/server/standalone";
import { schema as typeDefs } from "./schema.ts";

const MONGO_URL = Deno.env.get("MONGO_URL");

if (!MONGO_URL) {
  throw new Error("Please provide a MONGO_URL");
}

const mongoClient = new MongoClient(MONGO_URL);
await mongoClient.connect();

console.info("Connected to MongoDB");

const mongoDB = mongoClient.db("restaurants");
const RestaurantCollection = mongoDB.collection<RestaurantModel>("restaurants");

const server = new ApolloServer({
    typeDefs, 
    resolvers,
});

const { url } = await startStandaloneServer(server, {
  context: async () => ({ RestaurantCollection : RestaurantCollection}),
});

console.info(`Server ready at ${url}`);
