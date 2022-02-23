import { TestType } from "./run";

export const statementListTest = (test: TestType) => {
  test(
    `
    "hello";
    68;
  `,
    {
      type: 'Program',
      body: [
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'StringLiteral',
            value: 'hello',
          },
        },
        {
          type: 'ExpressionStatement',
          expression: {
            type: 'NumericLiteral',
            value: 68,
          },
        },
      ],
    },
  );
};