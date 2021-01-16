## Schema

Responsible for
 - Generating AST for graphq
 - Parse and Validating a query against that

    extend GraphQL::Schema::Member::AcceptsDefinition # allows you to define things on schema like "max_complexity"
    extend GraphQL::Schema::Member::HasAstNode
    include GraphQL::Define::InstanceDefinable
    extend GraphQL::Schema::FindInheritedValue # allows for inherited schemas

## Relay

## Field

## Mutation

## Query
