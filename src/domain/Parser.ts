import { Tokenizer } from "./Tokenizer";
import { NumericLiteralI } from "../interfaces/NumericLiteralI";
export class Parser {
  private expression: string;

  constructor() {
    this.expression = '';
  }

  parse(expression: string) {
    this.expression = expression;
  }

  Program() {
    return this.NumericLiteral();
  }

  NumericLiteral(): NumericLiteralI {
    return {
      type: "NumericLiteral",
      value: Number(this.expression)
    }
  }


}

