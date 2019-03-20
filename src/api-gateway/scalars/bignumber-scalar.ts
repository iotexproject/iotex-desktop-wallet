import { BigNumber } from "bignumber.js";
import { ASTNode, GraphQLScalarType } from "graphql";
import * as language from "graphql/language/kinds";

export const BigNumberScalar = new GraphQLScalarType({
  name: "BigNumber",
  description:
    "The BigNumber scalar type represents numeric values with precision as in https://github.com/MikeMcl/bignumber.js/",
  serialize(value: BigNumber): string {
    return new BigNumber(value).toString();
  },
  parseValue(value: string): string {
    return new BigNumber(value).toString(10);
  },
  // value received from the client
  parseLiteral(ast: ASTNode): string | null {
    switch (ast.kind) {
      case language.Kind.INT:
      case language.Kind.FLOAT:
        return new BigNumber(ast.value).toString(10);
      default:
        return null;
    }
  }
});
