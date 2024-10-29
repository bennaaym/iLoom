import {FunctionDeclarationSchema} from '@google/generative-ai';
import {EnglishLevel} from '../types';

const reading = {
  prompt: (ctx: {level: EnglishLevel}) =>
    `generate a reading comprehension activity for ${ctx.level}. The activity should include at least 3 questions. text length should be at least 100 words`,
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

export const englishPrompts = {
  reading
};
