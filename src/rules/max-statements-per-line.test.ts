import { RuleTester } from "../../vendor/rule-tester/src/RuleTester";
import rule, { RULE_NAME } from "./max-statements-per-line";

const valids = [
  `if (true){
    console.log('hello')
  }
`,
`for (let i = 0; i < 10; i++){
    console.log('hello')
  }
`
];
const invalids = [
  [`if (true){console.log('hello')}`],
  [`for (let i = 0; i < 10; i++){console.log('hello')}`]
];

const ruleTester: RuleTester = new RuleTester({
  parser: require.resolve("@typescript-eslint/parser")
});

ruleTester.run(RULE_NAME, rule as any, {
  valid: valids,
  invalid: invalids.map(i => ({
    code: i[0],
    output: i[1],
    errors: [{ messageId: "exceed" }]
  }))
});
