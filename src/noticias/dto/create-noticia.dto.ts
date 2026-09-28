export class CreateNoticiaDto { //Pense no DTO como uma Camada que haje como o envelope de correspondência, e na entidade como um produto no estoque
  name: string;               //
  slug: string;
  description: string;
  coverImage: string;
  sections?: Array<{
    id: string;
    type: string;
    content: Record<string, any>;
  }>;
}
