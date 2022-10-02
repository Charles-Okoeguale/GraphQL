import {gql} from 'apollo-server-express';

export const typeDefs = gql `
    type Query {
        category (name: ID!): Category!
        product (name: ID!): Product
        products: [Product!]!
        categories: [Category!]!
    }

    type Product {
        name: String!
        price: Int!
        onSale: Boolean!
        description: String!
        categoryId: String!
        category: Category
    }

    type Category {
        id: String!
        name: String!
        products: [Product!]!
    }
`