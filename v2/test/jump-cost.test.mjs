import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

test("direct jumps execute a fixed number of arithmetic operators", () => {
  const source = readFileSync(new URL("../src/chronology.ts", import.meta.url), "utf8");
  const operators = new Set([
    ts.SyntaxKind.PlusToken, ts.SyntaxKind.MinusToken, ts.SyntaxKind.AsteriskToken,
    ts.SyntaxKind.SlashToken, ts.SyntaxKind.PercentToken
  ]);
  // Count executed arithmetic in a test-only compilation, including callees.
  const instrument = context => {
    const visit = node => {
      const expr = ts.visitEachChild(node, visit, context);
      if (!ts.isBinaryExpression(expr) || !operators.has(expr.operatorToken.kind)) return expr;
      return ts.factory.createCallExpression(ts.factory.createIdentifier("count"), undefined, [expr]);
    };
    return file => ts.visitNode(file, visit);
  };
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
    transformers: { before: [instrument] }
  });
  let operations = 0;
  const core = {};
  runInNewContext(outputText, { exports: core, count(value) { operations++; return value; } });
  for (const index of [1n, 0n, -1n, BigInt("9".repeat(4096))]) {
    operations = 0;
    const day = core.dayOf(index);
    assert.equal(operations, 3);
    operations = 0;
    assert.equal(core.addWeeks(day, 1n - index), core.ANCHOR);
    assert.equal(operations, 2);
  }
});
