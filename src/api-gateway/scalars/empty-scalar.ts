import { GraphQLScalarType } from "graphql";

export const EmptyScalar = new GraphQLScalarType({
  name: "Empty",
  description: "Empty object",
  serialize(): string {
    return "{}";
  },
  // @ts-ignore
  parseValue(value: object): object {
    return {};
  },
  // @ts-ignore
  parseLiteral(value: object): object {
    return {};
  }
});
