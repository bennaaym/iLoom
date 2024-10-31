import {FunctionDeclarationSchema} from '@google/generative-ai';
import {EnglishLevel} from '../types';

const reading = {
  prompt: (ctx: {level: EnglishLevel; ageGroup: string; description: string}) =>
    `Generate a reading comprehension activity for ${ctx.level} English learners.
     Age group: ${ctx.ageGroup}.
     Topic: ${ctx.description}.
     Include a passage and at least 3 comprehension questions with answers.`,
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

const story = {
  prompt: (ctx: {
    level: EnglishLevel;
    ageGroup: string;
    description: string;
    imageUrl: string;
  }) =>
    `Generate a creative story for ${ctx.level} level students in the age group of ${ctx.ageGroup}. The story should be based on the following description and image. Description: "${ctx.description}". Image URL: "${ctx.imageUrl}". Include at least 3 comprehension questions.`,
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
  reading,
  story
};
