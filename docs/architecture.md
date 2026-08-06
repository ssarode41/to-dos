# Architecture

The application follows a layered architecture that separates concerns:

- Routes: HTTP entry points
- Controllers: request/response orchestration
- Services: business logic
- Repositories: persistence abstraction
- Models: schema definition
- Middleware: cross-cutting concerns such as validation and error handling

This structure makes the sample easier to evolve into a larger enterprise system.
