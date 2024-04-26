import BaseDto from '../../lib/entities/baseDto';

export default class InternDto extends BaseDto {
  public firstName: string;

  public lastName: string;

  public gender: string;

  public birthday: Date;

  public school: string;

  public phone: string;

  public course: string;

  public numberOfApplications: number;

  public companies?: Array<number>; // TODO: concrete type
}
