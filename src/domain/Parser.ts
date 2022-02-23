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

  StatementList(stopCurrent: string | null = null) {
    const statementList = [this.Statement()];
    while (this.currentToken !== null && this.currentToken.type !== stopCurrent) {
      statementList.push(this.Statement());
    }

    return statementList;
  }

  Statement() {
    switch (this.currentToken?.type) {
      case ';':
        return this.EmptyStatement();
      case "{":
        return this.BlockStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  BlockStatement(): unknown {
    this.getToken('{');
    const body: unknown[] | null = this.currentToken?.type !== '}' ? this.StatementList('}') : [];
    this.getToken('}');
    return {
      type: 'BlockStatement',
      body
    }
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

  EmptyStatement() {
    this.getToken(';');
    return {
      type: 'EmptyStatement'
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

