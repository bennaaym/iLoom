import {FunctionDeclarationSchema} from '@google/generative-ai';
import {AlgorithmLevel} from '../types';

const algorithm = {
  prompt: (ctx: {level: AlgorithmLevel; topic: string; description: string}) =>
    `Generate a set of critical thinking questions on the topic of ${ctx.topic} at a ${ctx.level} level. The questions should be designed to challenge the learner's understanding of ${ctx.topic} and cover concepts related to ${ctx.description}. Provide multiple-choice options for each question, and include the correct answer.Each question should include several answer choices (options) without any prefixes (such as A, B, C)`,
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
