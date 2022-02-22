import { Parser } from '../src/domain/Parser';

const parser: Parser = new Parser();
const program: string = `79`;
parser.parse(program);
const ast = parser.Program();

console.log(JSON.stringify(ast, null, 2));


