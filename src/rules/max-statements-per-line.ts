import type { TSESTree } from '@typescript-eslint/typescript-estree'
import type { ASTNode, ASTToken } from '../types'
import { createEslintRule } from '../utils'

export const RULE_NAME = 'max-statements-per-line'
export type MessageIds = 'exceed'
export type Options = [
  {
    max?: number
  },
]

export default createEslintRule({
  name: RULE_NAME,
  meta: {
    type: 'layout',
    docs: {
      description: 'enforce a maximum number of statements allowed per line',
      recommended: 'stylistic',
    },
    fixable: 'whitespace',
    schema: [
      {
        type: 'object',
        properties: {
          max: {
            type: 'integer',
            minimum: 0,
          },
        },
      },
    ],
    messages: {
      exceed: 'This line has more than {{max}} statements.',
    },
  },
  defaultOptions: [
    {
      max: 1,
    },
  ],
  create(context) {
    const sourceCode = context.sourceCode
    const options: { max?: number } = context.options[0] ?? {}
    const maxStatementsPerLine = typeof options.max !== 'undefined' ? options.max : 1

    let lastStatementLine = 0
    let numberOfStatementsOnThisLine = 0
    let firstExtraStatement: TSESTree.Node | null = null

    // --------------------------------------------------------------------------
    // Helpers
    // --------------------------------------------------------------------------

    const SINGLE_CHILD_ALLOWED = /^(?:(?:DoWhile|For|ForIn|ForOf|If|Labeled|While)Statement|Export(?:Default|Named)Declaration)$/u

    /**
     * Reports with the first extra statement, and clears it.
     * @returns {void}
     */
    function reportFirstExtraStatementAndClear(): void {
      const statement = firstExtraStatement
      if (statement) {
        context.report({
          node: statement,
          messageId: 'exceed',
          data: {
            numberOfStatementsOnThisLine,
            maxStatementsPerLine,
            statements: numberOfStatementsOnThisLine === 1 ? 'statement' : 'statements',
          },
          fix(fixer) {
            if (statement)
              return fixer.replaceTextRange([statement.range[0], statement.range[0]], '\n')

            return null
          },
        })
      }
      firstExtraStatement = null
    }

    /**
     * Gets the actual last token of a given node.
     * @param {ASTNode} node A node to get. This is a node except EmptyStatement.
     * @returns {ASTToken} The actual last token.
     */
    function getActualLastToken(node: TSESTree.Node): ASTToken | null {
      return sourceCode.getLastToken(node, (token) => {
        return token.type !== 'Punctuator' || token.value !== ';'
      })
    }

    /**
     * Addresses a given node.
     * It updates the state of this rule, then reports the node if the node violated this rule.
     */
    const enterStatement = <T extends TSESTree.Node = never>(node: T) => {
      const line = node.loc.start.line

      /*
     * Skip to allow non-block statements if this is direct child of control statements.
     * `if (a) foo();` is counted as 1.
     * But `if (a) foo(); else foo();` should be counted as 2.
     */
      if (!node.parent || (SINGLE_CHILD_ALLOWED.test(node.parent.type) && (node.parent as ASTNode).alternate !== node))
        return

      // Update state.
      if (line === lastStatementLine) {
        numberOfStatementsOnThisLine += 1
      }
      else {
        reportFirstExtraStatementAndClear()
        numberOfStatementsOnThisLine = 1
        lastStatementLine = line
      }

      // Reports if the node violated this rule.
      if (numberOfStatementsOnThisLine === maxStatementsPerLine + 1)
        firstExtraStatement = firstExtraStatement || node
    }

    /**
     * Updates the state of this rule with the end line of leaving node to check with the next statement.
     */
    const leaveStatement = <T extends TSESTree.Node = never>(node: T) => {
      const line = getActualLastToken(node)?.loc.end.line ?? 0

      // Update state.
      if (line !== lastStatementLine) {
        reportFirstExtraStatementAndClear()
        numberOfStatementsOnThisLine = 1
        lastStatementLine = line
      }
    }

    // --------------------------------------------------------------------------
    // Public API
    // --------------------------------------------------------------------------

    return {
      'BreakStatement': enterStatement,
      'ClassDeclaration': enterStatement,
      'ContinueStatement': enterStatement,
      'DebuggerStatement': enterStatement,
      'DoWhileStatement': enterStatement,
      'ExpressionStatement': enterStatement,
      'ForInStatement': enterStatement,
      'ForOfStatement': enterStatement,
      'ForStatement': enterStatement,
      'FunctionDeclaration': enterStatement,
      'IfStatement': enterStatement,
      'ImportDeclaration': enterStatement,
      'LabeledStatement': enterStatement,
      'ReturnStatement': enterStatement,
      'SwitchStatement': enterStatement,
      'ThrowStatement': enterStatement,
      'TryStatement': enterStatement,
      'VariableDeclaration': enterStatement,
      'WhileStatement': enterStatement,
      'WithStatement': enterStatement,
      'ExportNamedDeclaration': enterStatement,
      'ExportDefaultDeclaration': enterStatement,
      'ExportAllDeclaration': enterStatement,

      'BreakStatement:exit': leaveStatement,
      'ClassDeclaration:exit': leaveStatement,
      'ContinueStatement:exit': leaveStatement,
      'DebuggerStatement:exit': leaveStatement,
      'DoWhileStatement:exit': leaveStatement,
      'ExpressionStatement:exit': leaveStatement,
      'ForInStatement:exit': leaveStatement,
      'ForOfStatement:exit': leaveStatement,
      'ForStatement:exit': leaveStatement,
      'FunctionDeclaration:exit': leaveStatement,
      'IfStatement:exit': leaveStatement,
      'ImportDeclaration:exit': leaveStatement,
      'LabeledStatement:exit': leaveStatement,
      'ReturnStatement:exit': leaveStatement,
      'SwitchStatement:exit': leaveStatement,
      'ThrowStatement:exit': leaveStatement,
      'TryStatement:exit': leaveStatement,
      'VariableDeclaration:exit': leaveStatement,
      'WhileStatement:exit': leaveStatement,
      'WithStatement:exit': leaveStatement,
      'ExportNamedDeclaration:exit': leaveStatement,
      'ExportDefaultDeclaration:exit': leaveStatement,
      'ExportAllDeclaration:exit': leaveStatement,
      'Program:exit': reportFirstExtraStatementAndClear,
    }
  },
})
