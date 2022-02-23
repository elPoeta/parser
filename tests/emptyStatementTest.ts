import { TestType } from "./run";

export const emptyStatementTest = (test: TestType) => {
  test(';', {
    type: 'Program',
    body: [
      {
        type: 'EmptyStatement',
      },
    ],
  });
};