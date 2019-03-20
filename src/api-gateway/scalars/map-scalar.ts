import { ASTNode, GraphQLScalarType, Kind } from "graphql";

export const MapScalar = new GraphQLScalarType({
  name: "Map",
  description: "scalar type of map buffer",
  parseValue(value: Map<string, Uint8Array>): Map<string, Buffer> {
    const map = new Map<string, Buffer>();
    for (let [k, v] of value.entries()) {
      map.set(k, Buffer.from(v));
    }
    return map;
  },
  serialize(value: Map<string, Buffer>): string {
    return JSON.stringify([...value.entries()]); // value sent to the client
  },
  parseLiteral(ast: ASTNode): Map<string, Buffer> | null {
    if (ast.kind === Kind.STRING) {
      return new Map(JSON.parse(ast.value));
    }
    return null;
  }
});
