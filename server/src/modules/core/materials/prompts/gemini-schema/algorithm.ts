import {FunctionDeclarationSchema} from '@google/generative-ai';

const algorithm = {
  schema: {
    type: 'object',
    properties: {
      title: {
        type: 'string'
      },
      text: {
        type: 'string'
      },
      questions: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            question: {
              type: 'string'
            },
            options: {
              type: 'array',
              items: {
                type: 'string'
              }
            },
            answer: {
              type: 'string'
            }
          },
          required: ['question', 'options', 'answer']
        }
      }
    },
    required: ['title', 'text', 'questions']
  } as FunctionDeclarationSchema
};
export const algorithmPrompts = {
  algorithm
};
