import { // Camada responsável pelas regras de negócio, é onde reside o valor real do sistema. Aqui é o coração da API. 
  Injectable,  
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateNoticiaDto } from './dto/create-noticia.dto.js';
import { UpdateNoticiaDto } from './dto/update-noticia.dto.js';

export interface PageSection {
  id: string;
  type: string;
  content: Record<string, any>;
}

export interface Noticia { 
  id: number;        
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  sections: PageSection[];
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()//O decorator @Injectable() é um dos conceitos mais importantes do NestJS. 
//Ele serve para avisar ao framework que aquela classe (como o seu NoticiaService) pode ser gerenciada pelo sistema de Injeção de Dependências do NestJS.

export class NoticiaService { // O seu código do NoticiaService gerencia a criação de notícias 
// em memória (ou seja, os dados ficam salvos em um array temporário enquanto a aplicação estiver rodando, 
// sem um banco de dados persistente como PostgreSQL ou MySQL).
  private noticias: Noticia[] = []; //Cria um array vazio para armazenar as notícias criadas.
  private nextId = 1; //Define um contador que começa em 1 para gerar os IDs únicos de cada notícia automaticamente.

  create(dto: CreateNoticiaDto): Noticia {//O código busca no array de notícias se já existe algum item com o mesmo slug enviado no DTO:
    const slugInUse = this.noticias.some((p) => p.slug === dto.slug);
    if (slugInUse) {//Se o slug já existir, ele interrompe a execução e lança um erro HTTP 409 Conflict,
      throw new ConflictException( //impedindo a criação de notícias duplicadas com a mensagem:
        `Já existe uma noticia com o slug "${dto.slug}".`,
      );
    }

    const noticia: Noticia = { //Se o slug estiver disponível, ele constrói um novo objeto do tipo Noticia mesclando as informações 
      //recebidas com dados gerados pelo próprio servidor:
      id: this.nextId++, //Atribui o ID atual à notícia e adiciona +1 no contador para a próxima requisição.
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      coverImage: dto.coverImage,
      sections: dto.sections ?? [],//Garante que se nenhuma seção for enviada no formulário, a propriedade seja salva como um array vazio [] (evitando valores undefined).
      createdAt: new Date(),//Registra automaticamente a data e hora exatas da criação utilizando o new Date().
      updatedAt: new Date(),
    };
    this.noticias.push(noticia); //Adiciona o objeto finalizado dentro do array em memória.

    return noticia;//Devolve a notícia recém-criada (já com o ID e datas inclusos) como resposta 
    //para quem chamou o método (geralmente o seu NoticiaController).
  }

  findAll(): Noticia[] {//O método findAll() é responsável por listar todas as notícias que foram cadastradas no sistema até o momento.

    return this.noticias;//Retorna diretamente o array privado noticias (aquele banco de dados temporário em memória 
    //que vimos no método anterior com todos os itens que estão salvos nele.
  }

  findOne(id: number): Noticia {//Ele usa a função .find() do JavaScript para percorrer o array em memória (this.noticias). 
                    
    const noticia = this.noticias.find((p) => p.id === id); //Ele procura o primeiro item (p) cujo id seja exatamente igual ao id passado como parâmetro na função.

    if (!noticia) {//Se a função .find() não encontrar nada, a variável noticia ficará vazia (undefined). 
      throw new NotFoundException(`Noticia com ID ${id} não encontrado.`);
    }
    return noticia; //Se a notícia for encontrada com sucesso, ele pula o bloco do if e devolve o objeto completo da notícia 
  }                //para quem fez a requisição (geralmente a rota GET /noticias/:id).


  //O método findBySlug(slug: string) funciona de forma quase idêntica ao findOne, mas com uma diferença crucial:
  // ele busca uma notícia específica usando o slug em vez do ID.
  findBySlug(slug: string): Noticia {//Ele percorre o seu array em memória buscando a primeira notícia 
    const noticia = this.noticias.find((p) => p.slug === slug);//cujo campo slug seja exatamente igual ao texto (slug) recebido como parâmetro.
    if (!noticia) { // se nenhum item com esse slug seja localizado no array, ele interrompe a requisição na hora 
      throw new NotFoundException(`Noticia com slug "${slug}" não encontrado.`); //e dispara um erro HTTP 404 Not Found avisando que a notícia não existe.
    }
    return noticia; //Se encontrar, o objeto completo da notícia é enviado de volta. Isso é perfeito para alimentar 
    //a página de detalhes da notícia no seu frontend de forma mais profissional e otimizada.
  }

  update(id: number, dto: UpdateNoticiaDto): Noticia {
    const noticia = this.findOne(id);

    if (dto.slug && dto.slug !== noticia.slug) {
      const slugInUse = this.noticias.some(
        (p) => p.slug === dto.slug && p.id !== id,
      );
      if (slugInUse) {
        throw new ConflictException(
          `Já existe uma noticia com o slug "${dto.slug}".`,
        );
      }
    }

    Object.assign(noticia, { ...dto, updatedAt: new Date() });
    return noticia;
  }


  //Este é o método remove(id: number), responsável por deletar uma notícia do seu banco de dados em memória.
  remove(id: number): void {

    this.findOne(id);//Antes de apagar qualquer coisa, ele chama o método this.findOne(id) que você acabou de ver. 
    //Se a notícia não existir, o findOne vai disparar automaticamente aquele erro 404 Not Found e interromper a execução aqui mesmo. 
     //Isso garante que você só tente deletar algo que realmente existe.

    this.noticias = this.noticias.filter((p) => p.id !== id); //Se a notícia existir, o código usa a função .filter() do JavaScript 
    //para atualizar o array. Ele percorre a lista e mantém apenas as notícias cujo ID seja diferente (!==) do ID que você quer deletar.
    //O item com o ID correspondente é deixado de fora, sendo efetivamente removido do "banco de dados". 
  }
} //O método está marcado com : void, o que significa que ele executa a ação de limpeza no array, 
//mas não devolve nenhum dado de resposta (como um objeto) para quem o chamou. 
//Na API, isso costuma resultar em um status HTTP 200 OK (sem corpo) ou 204 No Content.
