"use strict";

var _apolloServer = require("apollo-server");

function _templateObject() {
  var data = _taggedTemplateLiteral(["\n  # Comments in GraphQL are defined with the hash (#) symbol.\n\n  # This \"Book\" type can be used in other type declarations.\n  type Book {\n    title: String\n    author: String\n  }\n\n  # The \"Query\" type is the root of all GraphQL queries.\n  # (A \"Mutation\" type will be covered later on.)\n  type Query {\n    books: [Book]\n  }\n"]);

  _templateObject = function _templateObject() {
    return data;
  };

  return data;
}

function _taggedTemplateLiteral(strings, raw) { if (!raw) { raw = strings.slice(0); } return Object.freeze(Object.defineProperties(strings, { raw: { value: Object.freeze(raw) } })); }

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
var _books = [{
  title: 'Harry Potter and the Chamber of Secrets',
  author: 'J.K. Rowling'
}, {
  title: 'Jurassic Park',
  author: 'Michael Crichton'
}]; // Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.

var typeDefs = (0, _apolloServer.gql)(_templateObject()); // Resolvers define the technique for fetching the types in the
// schema.  We'll retrieve books from the "books" array above.

var resolvers = {
  Query: {
    books: function books() {
      return _books;
    }
  }
}; // In the most basic sense, the ApolloServer can be started
// by passing type definitions (typeDefs) and the resolvers
// responsible for fetching the data for those types.

var server = new _apolloServer.ApolloServer({
  typeDefs: typeDefs,
  resolvers: resolvers
}); // This `listen` method launches a web-server.  Existing apps
// can utilize middleware options, which we'll discuss later.

server.listen({
  port: 6500
}).then(function (_ref) {
  var url = _ref.url;
  console.log("\uD83D\uDE80  Server ready at ".concat(url));
})["catch"](function (ex) {
  console.error('error', ex);
  process.exit(1);
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL2FwcC9hcHAub2xkLnRzIl0sIm5hbWVzIjpbImJvb2tzIiwidGl0bGUiLCJhdXRob3IiLCJ0eXBlRGVmcyIsImdxbCIsInJlc29sdmVycyIsIlF1ZXJ5Iiwic2VydmVyIiwiQXBvbGxvU2VydmVyIiwibGlzdGVuIiwicG9ydCIsInRoZW4iLCJ1cmwiLCJjb25zb2xlIiwibG9nIiwiZXgiLCJlcnJvciIsInByb2Nlc3MiLCJleGl0Il0sIm1hcHBpbmdzIjoiOztBQUFBOzs7Ozs7Ozs7Ozs7OztBQUdBO0FBQ0E7QUFDQTtBQUNBLElBQU1BLE1BQUssR0FBRyxDQUNaO0FBQ0VDLEVBQUFBLEtBQUssRUFBRSx5Q0FEVDtBQUVFQyxFQUFBQSxNQUFNLEVBQUU7QUFGVixDQURZLEVBS1o7QUFDRUQsRUFBQUEsS0FBSyxFQUFFLGVBRFQ7QUFFRUMsRUFBQUEsTUFBTSxFQUFFO0FBRlYsQ0FMWSxDQUFkLEMsQ0FXQTtBQUNBOztBQUNBLElBQU1DLFFBQVEsT0FBR0MsaUJBQUgsb0JBQWQsQyxDQWdCQTtBQUNBOztBQUNBLElBQU1DLFNBQVMsR0FBRztBQUNoQkMsRUFBQUEsS0FBSyxFQUFFO0FBQ0xOLElBQUFBLEtBQUssRUFBRTtBQUFBLGFBQWdCQSxNQUFoQjtBQUFBO0FBREY7QUFEUyxDQUFsQixDLENBTUE7QUFDQTtBQUNBOztBQUNBLElBQU1PLE1BQU0sR0FBRyxJQUFJQywwQkFBSixDQUFpQjtBQUFFTCxFQUFBQSxRQUFRLEVBQVJBLFFBQUY7QUFBWUUsRUFBQUEsU0FBUyxFQUFUQTtBQUFaLENBQWpCLENBQWYsQyxDQUVBO0FBQ0E7O0FBQ0FFLE1BQU0sQ0FBQ0UsTUFBUCxDQUFjO0FBQ1pDLEVBQUFBLElBQUksRUFBRTtBQURNLENBQWQsRUFHR0MsSUFISCxDQUlJLGdCQUFtQjtBQUFBLE1BQWhCQyxHQUFnQixRQUFoQkEsR0FBZ0I7QUFDakJDLEVBQUFBLE9BQU8sQ0FBQ0MsR0FBUix5Q0FBbUNGLEdBQW5DO0FBQ0QsQ0FOTCxXQVNJLFVBQUNHLEVBQUQsRUFBYztBQUNaRixFQUFBQSxPQUFPLENBQUNHLEtBQVIsQ0FBYyxPQUFkLEVBQXVCRCxFQUF2QjtBQUNBRSxFQUFBQSxPQUFPLENBQUNDLElBQVIsQ0FBYSxDQUFiO0FBQ0QsQ0FaTCIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEFwb2xsb1NlcnZlciwgZ3FsIH0gZnJvbSAnYXBvbGxvLXNlcnZlcidcblxuXG4vLyBUaGlzIGlzIGEgKHNhbXBsZSkgY29sbGVjdGlvbiBvZiBib29rcyB3ZSdsbCBiZSBhYmxlIHRvIHF1ZXJ5XG4vLyB0aGUgR3JhcGhRTCBzZXJ2ZXIgZm9yLiAgQSBtb3JlIGNvbXBsZXRlIGV4YW1wbGUgbWlnaHQgZmV0Y2hcbi8vIGZyb20gYW4gZXhpc3RpbmcgZGF0YSBzb3VyY2UgbGlrZSBhIFJFU1QgQVBJIG9yIGRhdGFiYXNlLlxuY29uc3QgYm9va3MgPSBbXG4gIHtcbiAgICB0aXRsZTogJ0hhcnJ5IFBvdHRlciBhbmQgdGhlIENoYW1iZXIgb2YgU2VjcmV0cycsXG4gICAgYXV0aG9yOiAnSi5LLiBSb3dsaW5nJyxcbiAgfSxcbiAge1xuICAgIHRpdGxlOiAnSnVyYXNzaWMgUGFyaycsXG4gICAgYXV0aG9yOiAnTWljaGFlbCBDcmljaHRvbicsXG4gIH0sXG5dO1xuXG4vLyBUeXBlIGRlZmluaXRpb25zIGRlZmluZSB0aGUgXCJzaGFwZVwiIG9mIHlvdXIgZGF0YSBhbmQgc3BlY2lmeVxuLy8gd2hpY2ggd2F5cyB0aGUgZGF0YSBjYW4gYmUgZmV0Y2hlZCBmcm9tIHRoZSBHcmFwaFFMIHNlcnZlci5cbmNvbnN0IHR5cGVEZWZzID0gZ3FsYFxuICAjIENvbW1lbnRzIGluIEdyYXBoUUwgYXJlIGRlZmluZWQgd2l0aCB0aGUgaGFzaCAoIykgc3ltYm9sLlxuXG4gICMgVGhpcyBcIkJvb2tcIiB0eXBlIGNhbiBiZSB1c2VkIGluIG90aGVyIHR5cGUgZGVjbGFyYXRpb25zLlxuICB0eXBlIEJvb2sge1xuICAgIHRpdGxlOiBTdHJpbmdcbiAgICBhdXRob3I6IFN0cmluZ1xuICB9XG5cbiAgIyBUaGUgXCJRdWVyeVwiIHR5cGUgaXMgdGhlIHJvb3Qgb2YgYWxsIEdyYXBoUUwgcXVlcmllcy5cbiAgIyAoQSBcIk11dGF0aW9uXCIgdHlwZSB3aWxsIGJlIGNvdmVyZWQgbGF0ZXIgb24uKVxuICB0eXBlIFF1ZXJ5IHtcbiAgICBib29rczogW0Jvb2tdXG4gIH1cbmA7XG5cbi8vIFJlc29sdmVycyBkZWZpbmUgdGhlIHRlY2huaXF1ZSBmb3IgZmV0Y2hpbmcgdGhlIHR5cGVzIGluIHRoZVxuLy8gc2NoZW1hLiAgV2UnbGwgcmV0cmlldmUgYm9va3MgZnJvbSB0aGUgXCJib29rc1wiIGFycmF5IGFib3ZlLlxuY29uc3QgcmVzb2x2ZXJzID0ge1xuICBRdWVyeToge1xuICAgIGJvb2tzOiAoKTogb2JqZWN0W10gPT4gYm9va3MsXG4gIH0sXG59O1xuXG4vLyBJbiB0aGUgbW9zdCBiYXNpYyBzZW5zZSwgdGhlIEFwb2xsb1NlcnZlciBjYW4gYmUgc3RhcnRlZFxuLy8gYnkgcGFzc2luZyB0eXBlIGRlZmluaXRpb25zICh0eXBlRGVmcykgYW5kIHRoZSByZXNvbHZlcnNcbi8vIHJlc3BvbnNpYmxlIGZvciBmZXRjaGluZyB0aGUgZGF0YSBmb3IgdGhvc2UgdHlwZXMuXG5jb25zdCBzZXJ2ZXIgPSBuZXcgQXBvbGxvU2VydmVyKHsgdHlwZURlZnMsIHJlc29sdmVycyB9KTtcblxuLy8gVGhpcyBgbGlzdGVuYCBtZXRob2QgbGF1bmNoZXMgYSB3ZWItc2VydmVyLiAgRXhpc3RpbmcgYXBwc1xuLy8gY2FuIHV0aWxpemUgbWlkZGxld2FyZSBvcHRpb25zLCB3aGljaCB3ZSdsbCBkaXNjdXNzIGxhdGVyLlxuc2VydmVyLmxpc3Rlbih7XG4gIHBvcnQ6IDY1MDAsXG59KVxuICAudGhlbihcbiAgICAoeyB1cmwgfSk6IHZvaWQgPT4ge1xuICAgICAgY29uc29sZS5sb2coYPCfmoAgIFNlcnZlciByZWFkeSBhdCAke3VybH1gKTtcbiAgICB9LFxuICApXG4gIC5jYXRjaChcbiAgICAoZXgpOiB2b2lkID0+IHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2Vycm9yJywgZXgpXG4gICAgICBwcm9jZXNzLmV4aXQoMSlcbiAgICB9LFxuICApXG5cbiJdfQ==