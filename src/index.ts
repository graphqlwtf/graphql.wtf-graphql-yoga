import { createServer, createPubSub } from "graphql-yoga";

const pubSub = createPubSub();

const typeDefs = /* GraphQL */ `
  type Query {
    hello: String!
  }

  type Mutation {
    speak(word: String!): String!
  }

  type Subscription {
    speaking: String!
  }
`;

const resolvers = {
  Query: {
    hello: () => "World!",
  },
  Mutation: {
    speak: (_, { word }) => {
      pubSub.publish("speak", word);

      return word;
    },
  },
  Subscription: {
    speaking: {
      subscribe: () => pubSub.subscribe("speak"),
      resolve: (payload) => payload,
    },
  },
};

const server = createServer({
  typeDefs,
  resolvers,
});

server.start(() => console.log("Server is running on localhost:4000"));
