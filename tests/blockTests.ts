import { TestType } from "./run";

export const blockTests = (test: TestType) => {
  test(
    `
    {
      27;
      "hello";
    }
  `,
    {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 27,
              },
            },

            {
              type: 'ExpressionStatement',
              expression: {
                type: 'StringLiteral',
                value: 'hello',
              },
            },
          ],
        },
      ],
    },
  );

  // Empty block:

  test(
    `
    {
    }
  `,
    {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [],
        },
      ],
    },
  );

  // Nested blocks:

  test(
    `
    {
      27;
      {
        "hello";
      }
    }
  `,
    {
      type: 'Program',
      body: [
        {
          type: 'BlockStatement',
          body: [
            {
              type: 'ExpressionStatement',
              expression: {
                type: 'NumericLiteral',
                value: 27,
              },
            },
            {
              type: 'BlockStatement',
              body: [
                {
                  type: 'ExpressionStatement',
                  expression: {
                    type: 'StringLiteral',
                    value: 'hello',
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  );
};