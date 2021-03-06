import { TokenI } from '../interfaces/TokenI';

type SpecType = [RegExp, string | null][];
export class Tokenizer {
  private expression: string;
  private cursor: number;
  private Spec: SpecType;

  constructor() {
    this.expression = '';
    this.cursor = 0;
    this.Spec = [
      [/^\s+/, null], //Whitespace

      [/^\/\/.*/, null], // skip single line comment
      [/^\/\*[\s\S]*?\*\\/, null], // skip Multiline comments 

      [/^;/, ';'], // comma delimiter
      [/^\{/, '{'], //  open curly delimiter
      [/^\}/, '}'], // close curly delimiter
      [/^\(/, '('], //  open parenthesis delimiter
      [/^\)/, ')'], // close parenthesis delimiter
      [/^\,/, ','], // comma delimiter

      [/^\blet\b/, 'let'], // keywords variable
      [/^\bconst\b/, 'const'], // keywords variable
      [/^\bvar\b/, 'var'], // keywords variable
      [/^\bif\b/, 'if'],  // keywords statement
      [/^\belse\b/, 'else'],   // keywords statement
      [/^\btrue\b/, 'true'],   // keywords statement
      [/^\bfalse\b/, 'false'],   // keywords statement
      [/^\bnull\b/, 'null'],   // keywords statement
      [/^\bwhile\b/, 'while'],   // keywords iteration
      [/^\bdo\b/, 'do'],   // keywords iteration
      [/^\bfor\b/, 'for'],   // keywords iteration

      [/^\d+/, 'NUMBER'], //Number

      [/^[=!]=/, 'EQUALITY_OPERATOR'],  // Equality operator
      [/^\w+/, 'IDENTIFIER'], // identifier
      [/^=/, 'SIMPLE_ASSIGN'],  // Simple assign
      [/^[\*\/\+\-]=/, 'COMPLEX_ASSIGN'],  // Complex assign

      [/^[+\-]/, 'ADD_SUB_OPERATOR'],  //Math operators + -
      [/^[*\/]/, 'MULTI_DIV_OPERATOR'], // Math operators * /
      [/^[><]=?/, 'RELATIONAL_OPERATOR'], // relational operator
      [/^&&/, 'LOGICAL_AND'], // relational operator logical &&
      [/^\|\|/, 'LOGICAL_OR'], // relational operator logical ||
      [/^!/, 'LOGICAL_NOT'], // relational operator logical !


      [/^"[^"]*"/, 'STRING'], // String double quotes 
      [/^'[^']*'/, 'STRING'], // String single quotes
    ]
  }

  init(expression: string) {
    this.expression = expression;
    this.cursor = 0;
  }

  hasMoreTokens(): boolean {
    return this.cursor < this.expression.length;
  }

  isEOF(): boolean {
    return this.cursor === this.expression.length;
  }

  getNextToken(): TokenI | null {
    if (!this.hasMoreTokens()) {
      return null;
    }

    const expr = this.expression.slice(this.cursor);

    for (const [regExp, tokenType] of this.Spec) {
      const tokenValue = this.match(regExp, expr);
      if (!tokenValue) continue;
      if (!tokenType) return this.getNextToken();
      return {
        type: tokenType,
        value: tokenValue
      }
    }
    // if (!Number.isNaN(Number(expr[0]))) {
    //   let num = '';
    //   while (!Number.isNaN(Number(expr[this.cursor]))) {
    //     num += expr[this.cursor++];
    //   }
    //   return {
    //     type: 'NUMBER',
    //     value: num
    //   }
    // }

    // if (expr[0] === '"') {
    //   let str = '';
    //   do {
    //     str += expr[this.cursor++];
    //   } while (expr[this.cursor] !== '"' && !this.isEOF());
    //   str += this.cursor++;
    //   return {
    //     type: 'STRING',
    //     value: str
    //   }
    // }
    return null;
  }

  match(regExp: RegExp, tokenType: string): string | null {
    const matched = regExp.exec(tokenType);
    if (!matched) return null;
    this.cursor += matched[0].length;
    return matched[0];
  }
}