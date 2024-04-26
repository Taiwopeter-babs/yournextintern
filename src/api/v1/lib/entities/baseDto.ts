export default class BaseDto {
  public id: number;

  public email: string;

  public password?: string;

  public createdAt: Date;

  public updatedAt: Date;

  public profileImageUrl?: string;
}
