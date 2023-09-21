import { IsNotEmpty } from 'class-validator';

export class ClassDto {
  name: string;

  @IsNotEmpty()
  teacher: string;

  student?: string[];

  documents?: string[];

  thesis?: string[];

  semester?: string;

  major?: string;

  // postList: Post[];
}
