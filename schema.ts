export const schema = `#graphql
    type Restaurant{
        id: ID!
        name: String!
        direction: String!
        city: String!
        country: String!
        time: String!
        phone: String!
    }
    type Query {
        getRestaurant(id: ID!): Restaurant
        getRestaurants: [Restaurant!]!
    }
    type Mutation {
        deleteRestaurant(id: ID!): Boolean!
        addRestaurant(name: String!, direction: String!, city: String!, phone: String!): Restaurant!
    }

`;