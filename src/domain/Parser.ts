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
      case 'let':
      case 'const':
      case 'var':
        return this.VariableStatement(this.currentToken?.type);
      default:
        return this.ExpressionStatement();
    }
  }

  VariableStatement(tokenType: string) {
    this.getToken(tokenType);
    const declarations = this.VariableDeclarationList();
    this.getToken(';');
    return {
      type: 'VariableStatement',
      declarations
    }
  }

  VariableDeclarationList() {
    const declarations = [];
    do {
      declarations.push(this.VariableDeclaration());
    } while (this.currentToken!.type === ',' && this.getToken(','));
    return declarations;
  }

  VariableDeclaration() {
    const id = this.Identifier();
    const init = this.currentToken!.type !== ';' && this.currentToken!.type !== ','
      ? this.VariableInitializer() : null;
    return {
      type: 'VariableDeclaration',
      id,
      init
    }
  }

  VariableInitializer() {
    this.getToken('SIMPLE_ASSIGN');
    return this.AssignmentExpression();
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
    return this.AssignmentExpression();
  }

  AssignmentExpression(): any {
    const left = this.AddSubExpression();
    if (!this.isAssignmentOperator(this.currentToken!.type)) {
      return left;
    }
    return {
      type: 'AssignmentExpression',
      operator: this.AssignmentOperator().value,
      left: this.checkValidAssignmentTarget(left),
      rigth: this.AssignmentExpression()
    }
  }

  isAssignmentOperator(tokenType: string | null) {
    return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
  }

  LeftHandSideExpression() {
    return this.Identifier();
  }

  Identifier() {
    const name = this.getToken('IDENTIFIER').value;
    return {
      type: 'Identifier',
      name,

    }
  }

  checkValidAssignmentTarget(node: any) {
    if (node.type === 'Identifier') return node;
    new SyntaxError(`Invalid left-hand side in assignment expression`);
  }

  AssignmentOperator() {
    if (this.currentToken!.type === 'SIMPLE_ASSIGN') return this.getToken('SIMPLE_ASSIGN');
    return this.getToken('COMPLEX_ASSIGN');
  }

  AddSubExpression() {
    return this.BinaryExpression('MultiDivExpression', 'ADD_SUB_OPERATOR');
  }

  MultiDivExpression() {
    return this.BinaryExpression('PrimaryExpression', 'MULTI_DIV_OPERATOR');
  }

  BinaryExpression(builderName: string, operatorName: string) {
    let left: any = builderName === 'MultiDivExpression' ? this.MultiDivExpression() : this.PrimaryExpression();
    while (this.currentToken?.type === operatorName) {
      const operator = this.getToken(operatorName).value;
      const right: any = builderName === 'MultiDivExpression' ? this.MultiDivExpression() : this.PrimaryExpression();
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      }
    }
    return left;
  }

  PrimaryExpression() {
    if (this.isLiteralExpression(this.currentToken!.type)) return this.Literal();
    switch (this.currentToken?.type) {
      case '(':
        return this.ParenthesizedExpression();
      default:
        return this.LeftHandSideExpression();
    }
  }

  isLiteralExpression(tokenType: string | null) {
    return tokenType === 'NUMBER' || tokenType === 'STRING';
  }

  ParenthesizedExpression() {
    this.getToken('(');
    const expression = this.Expression();
    this.getToken(')');
    return expression;
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

  NumericLiteral() {
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

