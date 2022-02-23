import { TestType } from "./run";

export const literaltest = (test: TestType) => {
  test(`79;`,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'NumericLiteral',
            value: 79
          }
        }
      ]
    });

  test(`"Hello World!";`,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: "Hello World!"
          }
        }
      ]
    });

  test(`'Hello World!';`,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: 'Hello World!'
          }
        }
      ]
    });
}