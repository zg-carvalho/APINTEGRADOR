import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service.js';

//Ele segue a arquitetura de Controlador, que é a porta de entrada da sua API 
//para receber as requisições que vêm do Postman ou do seu Front-end.

@Controller('auth')// Essa linha é um Decorator (um configurador). 
//Ela diz ao NestJS que esta classe é um Controlador responsável por todas as rotas que começam com /auth.
//Na prática: Como o seu servidor roda em localhost:3000, a base da URL para este arquivo será http://localhost:3000/auth.

export class AuthController {//Cria e exporta uma classe JavaScript/TypeScript chamada AuthController. 
  //O export serve para que o NestJS consiga enxergar esse arquivo e registrá-lo dentro dos Módulos do sistema.

  constructor(private readonly authService: AuthService) {}//Aqui acontece a Injeção de Dependência. Você está dizendo para o NestJS: "Para este controlador funcionar, eu preciso do serviço de autenticação (AuthService)".
//O NestJS cria uma instância do AuthService automaticamente e a guarda na variável interna this.authService para você usar depois.
//O readonly garante que você não vai substituir esse serviço por outra coisa sem querer.

  @Post('login')//Outro Decorator. Ele diz que o método logo abaixo vai responder a uma requisição do tipo POST na rota /login.
//Unindo com o primeiro passo: A rota completa no Postman se torna POST http://localhost:3000/auth/login.

  @HttpCode(HttpStatus.OK)//Por padrão, no NestJS, toda requisição do tipo POST responde com o status 201 Created. 

  login(@Body() body: { email: string; password: string }) {//Esta é a função que será executada quando o Postman chamar a rota de login.
    //O @Body() avisa ao NestJS para pegar os dados enviados no corpo (Body) do formato JSON lá do Postman e jogá-los dentro da variável body.
    //{ email: string; password: string } é a tipagem do TypeScript, garantindo que o objeto recebido deve conter obrigatoriamente um e-mail e uma senha do tipo texto.

    return this.authService.login(body.email, body.password);
    //Esta é a linha que faz o trabalho pesado. Ela pega o e-mail e a senha que o usuário digitou no Postman 
    //(body.email e body.password) e os envia para a sua camada de Serviço (AuthService), chamando a função login de lá.
  }
}
