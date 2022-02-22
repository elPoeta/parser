import { TokenI } from "../src/interfaces/TokenI";
import { TestType } from "./run";

export type ProgramType = {
  type: string,
  body: TokenI
}

export const literaltest = (test: TestType) => {
  test(`79`,
    {
      type: 'Program',
      body: {
        type: 'NumericLiteral',
        value: 79
      }
    }
  );

  test(`"Hello World!"`,
    {
      type: 'Program',
      body: {
        type: 'StringLiteral',
        value: "Hello World!"
      }
    }
  );

  test(`'Hello World!'`,
    {
      type: 'Program',
      body: {
        type: 'StringLiteral',
        value: 'Hello World!'
      }
    }
  );
}