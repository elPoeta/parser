import * as assert from 'assert'
import { Parser } from '../src/domain/Parser';
import { literaltest, ProgramType } from './literalTests';

const tests = [literaltest];

export type TestType = (program: string, expected: ProgramType) => void


const parser: Parser = new Parser();
const exec = () => {
  const program: string = `"79"`;
  const ast = parser.parse(program).Program();

  console.log(JSON.stringify(ast, null, 2));
}

exec();

const test: TestType = (program: string, expected: ProgramType) => {
  const ast = parser.parse(program).Program();
  assert.deepEqual(ast, expected);
}
tests.forEach(testRun => testRun(test));

console.log("All ASSERTION PASSED!!")

