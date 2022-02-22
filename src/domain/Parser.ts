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
    console.log("CURRENT ", this.currentToken)
    return this;
  }

  Program() {
    return {
      type: 'Program',
      body: this.Literal()
    }
  }

  Literal() {
    switch (this.currentToken?.type) {
      case 'NUMBER':
        return this.NumericLiteral();
      case 'STRING':
        return this.StringLiteral();
      default:
        throw new SyntaxError(`Literal: unespected literal, ${this.currentToken?.type} `);
    }
  }

  NumericLiteral(): NumericLiteralI {
    const token = this.getToken("NUMBER");
    return {
      type: "NumericLiteral",
      value: Number(token.value)
    }
  }

  StringLiteral() {
    const token = this.getToken("STRING")
    return {
      type: "StringLiteral",
      value: (token.value as string).slice(1, -1)
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

