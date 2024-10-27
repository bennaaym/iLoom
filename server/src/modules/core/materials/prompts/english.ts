import {FunctionDeclarationSchema} from '@google/generative-ai';
import {EnglishLevel} from '../types';

const reading = {
  prompt: (ctx: {level: EnglishLevel}) =>
    `generate a reading comprehension activity for ${ctx.level}. The activity should include at least 3 questions`,
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
          type: 'string'
        }
      },
      answers: {
        type: 'array',
        items: {
          type: 'string'
        }
      }
    },
    required: ['title', 'text', 'questions', 'answers']
  } as FunctionDeclarationSchema
};

export const englishPrompts = {
  reading
};
