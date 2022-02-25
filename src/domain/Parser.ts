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
      case 'if':
        return this.IfStatement();
      case "{":
        return this.BlockStatement();
      case 'let':
      case 'const':
      case 'var':
        return this.VariableStatement(this.currentToken?.type);
      case 'while':
      case 'do':
      case 'for':
        return this.IterationStatement();
      default:
        return this.ExpressionStatement();
    }
  }

  IterationStatement() {
    switch (this.currentToken!.type) {
      case 'while':
        return this.WhileStatement();
      case 'do':
        return this.DoWhileStatement();
      case 'for':
        return this.ForStatement();
    }
  }

  WhileStatement() {
    this.getToken('while');
    this.getToken('(');
    const test = this.Expression();
    this.getToken(')');
    const body: any = this.Statement();
    return {
      type: 'WhileStatement',
      test,
      body
    }
  }

  DoWhileStatement() {

  }

  ForStatement() {

  }


  IfStatement() {
    this.getToken('if');
    this.getToken('(');
    const test = this.Expression();
    this.getToken(')');
    const consequent: any = this.Statement();
    const alternate: any = this.currentToken !== null && this.currentToken!.type === 'else'
      ? this.getToken('else') && this.Statement() : null;

    return {
      type: 'IfStatement',
      test,
      consequent,
      alternate
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
    const left = this.LogicalORExpression();
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

  RelationalExpression() {
    return this.BinaryExpression('AddSubExpression', 'RELATIONAL_OPERATOR');
  }

  isAssignmentOperator(tokenType: string | null) {
    return tokenType === 'SIMPLE_ASSIGN' || tokenType === 'COMPLEX_ASSIGN';
  }


  UnaryExpression(): any {
    let operator = null;
    switch (this.currentToken!.type) {
      case 'ADD_SUB_OPERATOR':
        operator = this.getToken('ADD_SUB_OPERATOR').value;
        break;
      case 'LOGICAL_NOT':
        operator = this.getToken('LOGICAL_NOT').value;
      default:
        break;
    }
    if (operator) {
      return {
        type: 'UnaryExpression',
        operator,
        argument: this.UnaryExpression()
      }
    }
    return this.LeftHandSideExpression();
  }

  LeftHandSideExpression(): any {
    return this.PrimaryExpression();
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

  LogicalANDExpression() {
    return this.LogicalExpression('EqualityExpression', 'LOGICAL_AND');
  }

  LogicalORExpression() {
    return this.LogicalExpression('LogicalANDExpression', 'LOGICAL_OR');
  }

  EqualityExpression() {
    return this.BinaryExpression('RelationalExpression', 'EQUALITY_OPERATOR')
  }

  AddSubExpression() {
    return this.BinaryExpression('MultiDivExpression', 'ADD_SUB_OPERATOR');
  }

  MultiDivExpression() {
    return this.BinaryExpression('UnaryExpression', 'MULTI_DIV_OPERATOR');
  }

  LogicalExpression(builderName: string, operatorName: string) {
    let left: any = this.getBinaryExecutor(builderName);
    while (this.currentToken?.type === operatorName) {
      const operator = this.getToken(operatorName).value;
      const right: any = this.getBinaryExecutor(builderName);
      left = {
        type: 'LogicalExpression',
        operator,
        left,
        right
      }
    }
    return left;
  }

  BinaryExpression(builderName: string, operatorName: string) {
    let left: any = this.getBinaryExecutor(builderName);
    while (this.currentToken?.type === operatorName) {
      const operator = this.getToken(operatorName).value;
      const right: any = this.getBinaryExecutor(builderName);
      left = {
        type: 'BinaryExpression',
        operator,
        left,
        right
      }
    }
    return left;
  }

  getBinaryExecutor(builderName: string) {
    switch (builderName) {
      case 'MultiDivExpression':
        return this.MultiDivExpression();
      case 'PrimaryExpression':
        return this.PrimaryExpression();
      case 'AddSubExpression':
        return this.AddSubExpression();
      case 'RelationalExpression':
        return this.RelationalExpression();
      case 'EqualityExpression':
        return this.EqualityExpression();
      case 'LogicalANDExpression':
        return this.LogicalANDExpression();
      case 'UnaryExpression':
        return this.UnaryExpression();
    }
  }

  PrimaryExpression() {
    if (this.isLiteralExpression(this.currentToken!.type)) return this.Literal();
    switch (this.currentToken?.type) {
      case '(':
        return this.ParenthesizedExpression();
      case 'IDENTIFIER':
        return this.Identifier();
      default:
        return this.LeftHandSideExpression();
    }
  }

  isLiteralExpression(tokenType: string | null) {
    return tokenType === 'NUMBER' ||
      tokenType === 'STRING' ||
      tokenType === 'true' ||
      tokenType === 'false' ||
      tokenType === 'null';
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
      case 'true':
        return this.BooleanLiteral(true);
      case 'false':
        return this.BooleanLiteral(false);
      case 'null':
        return this.NullLiteral();
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

  BooleanLiteral(value: boolean) {
    this.getToken(value ? 'true' : 'false');
    return {
      type: "BooleanLiteral",
      value
    }
  }

  NullLiteral() {
    this.getToken('null');
    return {
      type: "NullLiteral",
      value: null
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

