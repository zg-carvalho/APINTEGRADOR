export class CreateNoticiaDto {
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sections?: Array<{
    id: string;
    type: string;
    content: Record<string, any>;
  }>;
}
