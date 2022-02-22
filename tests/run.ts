import { Parser } from '../src/domain/Parser';

const parser: Parser = new Parser();
const program: string = `79`;
const ast = parser.parse(program).Program();

console.log(JSON.stringify(ast, null, 2));


