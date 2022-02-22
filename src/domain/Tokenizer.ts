import { TokenI } from '../interfaces/TokenI';
export class Tokenizer {
  private expression: string;
  private cursor: number;

  constructor() {
    this.expression = '';
    this.cursor = 0;
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

    if (!Number.isNaN(Number(expr[0]))) {
      let num = '';
      while (!Number.isNaN(Number(expr[this.cursor]))) {
        num += expr[this.cursor++];
      }
      return {
        type: 'NUMBER',
        value: num
      }
    }

    if (expr[0] === '"') {
      let str = '';
      do {
        str += expr[this.cursor++];
      } while (expr[this.cursor] !== '"' && !this.isEOF());
      str += this.cursor++;
      return {
        type: 'STRING',
        value: str
      }
    }
    return null;
  }
}