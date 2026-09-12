export class UpdateNoticiaDto {
    name?: string;
    slug?: string;
    sections?: Array<{
        id: string;
        type: string;
        content: Record<string, any>;
    }>

}