import Web3 from 'web3'
import { ApolloServer, gql } from 'apollo-server'
import debug from 'debug'

import resolvers from './resolvers'
import typeDefs from './schema/type-defs'

export default (web3: Web3): void => {

  // In the most basic sense, the ApolloServer can be started
  // by passing type definitions (typeDefs) and the resolvers
  // responsible for fetching the data for those types.
  const server = new ApolloServer({
    typeDefs,
    resolvers: resolvers(web3),
  });

  // This `listen` method launches a web-server.  Existing apps
  // can utilize middleware options, which we'll discuss later.
  server.listen({
    port: 6500,
  })
    .then(
      ({ url }): void => {
        debug('catapillarql:serve')(`🚀  Server ready at ${url}`)
      },
    )
    .catch(
      (ex): void => {
        debug('catapillarql:serve')('error', ex)
        global.process.exit(1)
      },
    )
}