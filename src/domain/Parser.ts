import { Tokenizer } from "./Tokenizer";
import { NumericLiteralI } from "../interfaces/NumericLiteralI";
import { TokenI } from "../interfaces/TokenI";
export class Parser {
  private stringExpression: string;
  private tokenizer: Tokenizer;
  private currentToken: TokenI | null;

  constructor() {
    this.stringExpression = '';
    this.tokenizer = new Tokenizer();
    this.currentToken = null;
  }

  parse(stringExpression: string) {
    this.stringExpression = stringExpression;
    this.tokenizer.init(stringExpression);
    this.currentToken = this.tokenizer.getNextToken();
    return this;
  }

  Program() {
    return {
      type: 'Program',
      body: this.StatementList()
    }
  }

  StatementList() {
    const statementList = [this.Statement()];
    while (this.currentToken !== null) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    return this.ExpressionStatement();
  }

  ExpressionStatement() {
    const expression = this.Expression();
    this.getToken(';');
    return {
      type: 'ExpressionStatement',
      expression
    }
  }

  Expression() {
    return this.Literal();
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

