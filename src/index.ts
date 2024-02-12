import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from '@apollo/server/standalone';
import typeDefs from './schema.js';
import resolvers from './resolvers.js';
import tmdbAPI from './tmdbAPI.js';
// have to import *.js so that it will works after compilation

interface ContextValue {
    dataSources: {
        tmdbAPI: tmdbAPI;
    };
}

const server = new ApolloServer<ContextValue>({
    typeDefs,
    resolvers,
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context: async () => {
        const { cache } = server;

        return {
            dataSources: {
                tmdbAPI: new tmdbAPI({ cache })
            }
        }
    }
});

console.log(`🚀  Server ready at: ${url}`);