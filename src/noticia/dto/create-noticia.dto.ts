

export class SectionDto {

  id?: string;
  type?: string;
  content?: Record<string, any>;

}

export class CreateNoticiaDto {

  name?: string;
  slug?: string;
  sections?: SectionDto[];

}