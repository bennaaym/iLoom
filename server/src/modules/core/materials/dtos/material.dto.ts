import {Expose} from 'class-transformer';
import {EMaterialActivity, EMaterialScope, EMaterialSubject} from '../types';
import {ExplicityAny} from '@common/types';

export class MaterialDto {
  @Expose()
  id: string;

  @Expose()
  user: string;

  @Expose()
  classroom: string;

  @Expose()
  scope: EMaterialScope;

  @Expose()
  subject: EMaterialSubject;

  @Expose()
  activity: EMaterialActivity;

  @Expose()
  content: Record<string, ExplicityAny>;

  @Expose()
  contentPdf: string;

  @Expose()
  createdAt: string;

  @Expose()
  updatedAt: string;
  
  @Expose()
  imageUrl: string;
}
