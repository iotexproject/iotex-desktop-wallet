import { ASTNode, GraphQLScalarType } from "graphql";
import * as language from "graphql/language/kinds";

export const BufferScalar = new GraphQLScalarType({
  name: "Buffer",
  description: "JS Buffer or Uint8Array",
  serialize(value: Buffer): string {
    return value.toString("hex");
  },
  parseValue(value: string | ArrayBuffer | Uint8Array | Array<number>): Buffer {
    // @ts-ignore
    return Buffer.from(value);
  },
  // value received from the client
  parseLiteral(ast: ASTNode): Buffer | null {
    switch (ast.kind) {
      case language.Kind.LIST:
      case language.Kind.STRING:
        // @ts-ignore
        return Buffer.from(ast.value);
      default:
        return null;
    }
  }
});
