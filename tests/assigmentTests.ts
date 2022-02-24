import { TestType } from "./run";

export const assignmentTests = (test: TestType) => {
  // Simple assignment:
  test(`x = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'NumericLiteral',
            value: 42,
          },
        },
      },
    ],
  });

  // Chained assignment:
  test(`x = y = 42;`, {
    type: 'Program',
    body: [
      {
        type: 'ExpressionStatement',
        expression: {
          type: 'AssignmentExpression',
          operator: '=',
          left: {
            type: 'Identifier',
            name: 'x',
          },
          right: {
            type: 'AssignmentExpression',
            operator: '=',
            left: {
              type: 'Identifier',
              name: 'y',
            },
            right: {
              type: 'NumericLiteral',
              value: 42,
            },
          },
        },
      },
    ],
  });
};