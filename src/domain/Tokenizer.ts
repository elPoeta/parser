import { TokenI } from '../interfaces/TokenI';

type SpecType = [RegExp, string][];
export class Tokenizer {
  private expression: string;
  private cursor: number;
  private Spec: SpecType;

  constructor() {
    this.expression = '';
    this.cursor = 0;
    this.Spec = [
      [/^\d+/, 'NUMBER'],
      [/^"[^"]*"/, 'STRING'],
      [/^'[^']*'/, 'STRING'],
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