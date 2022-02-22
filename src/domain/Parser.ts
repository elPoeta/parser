import { Tokenizer } from "./Tokenizer";
import { NumericLiteralI } from "../interfaces/NumericLiteralI";
import { TokenI } from "../interfaces/TokenI";
export class Parser {
  private expression: string;
  private tokenizer: Tokenizer;
  private currentToken: TokenI | null;

  constructor() {
    this.expression = '';
    this.tokenizer = new Tokenizer();
    this.currentToken = null;
  }

  parse(expression: string) {
    this.expression = expression;
    this.tokenizer.init(expression);
    this.currentToken = this.tokenizer.getNextToken();
    return this;
  }

  Program() {
    return {
      type: 'Program',
      body: this.NumericLiteral()
    }
  }
  NumericLiteral(): NumericLiteralI {
    const token = this.getToken("NUMBER")
    return {
      type: "NumericLiteral",
      value: Number(token.value)
    }
  }

  getToken(tokenType: string) {
    const token = this.currentToken;
    if (token === null) {
      throw new SyntaxError(`Unespected end of input, expected: ${tokenType}`);
    }

    if (token.type !== tokenType) {
      throw new SyntaxError(`Unespected token: "${token.value}", expected: ${tokenType}`);
    }

    this.currentToken = this.tokenizer.getNextToken();
    return token;
  }
}

