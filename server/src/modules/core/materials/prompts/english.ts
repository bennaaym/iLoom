import {FunctionDeclarationSchema} from '@google/generative-ai';
import {EnglishLevel} from '../types';

const reading = {
  prompt: (ctx: {level: EnglishLevel}) =>
    `generate a reading comprehension activity for ${ctx.level}. The activity should include at least 3 questions`,
  schema: {
    type: 'object',
    properties: {
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
    required: ['text', 'questions', 'answers']
  } as FunctionDeclarationSchema
};

export const englishPrompts = {
  reading
};
