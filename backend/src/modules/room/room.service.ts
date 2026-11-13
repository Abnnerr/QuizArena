import type { Rooms } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { PlayerService } from "../players/player.service.js";
import type { RoundRepository } from "../round/round.repository.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { QuestionService } from "../question/question.service.js";
import type { PowerService } from "../powers/powers.service.js";
import { logger } from "../../shared/utils/logger.js";

export class RoomService implements IRoomService {
    private playerService!: PlayerService;
    constructor(
        private readonly repo: IRoomRepository,
        private readonly serviceQuestion: QuestionService,
        private readonly servicePower: PowerService,
        private readonly repoRound: RoundRepository,
        private readonly socket: SocketService
    ) { }

    setPlayerService(playerService: PlayerService) {
        this.playerService = playerService;
    }

    //Cria a sala
    async createRoom(user: AuthPayload, dados: RoomCreateDTO ): Promise<string> {
        try {
            logger.info(
                { userId: user.id },
                "Iniciando criação de sala"
            );

            const room = await this.repo.findByRoom(dados.name);

            if (room) {
                logger.warn(
                    { userId: user.id },
                    "Tentativa de criar sala com nome já existente"
                );
                throw new AppError(409, "Já existe uma sala com esse nome");
            }
            const idQuestions = await this.serviceQuestion.createQuestions(dados.questions);

            logger.info(
                { questionsCount: idQuestions.length },
                "Perguntas criadas com sucesso"
            );

            const roomcreate = await this.repo.createRoom(user.id, dados, idQuestions);
            logger.info(
                { roomId: roomcreate.room_id },
                "Sala criada com sucesso"
            );

            return roomcreate.room_code;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            logger.error(
                { err: error, userId: user.id },
                "Erro inesperado ao criar sala"
            );
            throw new AppError(500, "Erro ao criar sala");
        }
    }
    //encontra a sala
    async findRoom(code: string): Promise<Rooms> {
        try {
            const room = await this.repo.findByRoom(undefined, code)
            if (!room) {
                throw new AppError(404, 'Sala nao encontrada')
            }
            return room
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar sala')
        }
    }
    //player entra
    async joinRoom(roomCode: string, userName: string): Promise<any> {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode)



            if (!room) {
                throw new AppError(404, 'sala nao encontrada')
            }
            if (room.room_status !== 'LOBBY') {
                throw new AppError(400, "A sala não está aberta");
            }

            const [, countPlayer] = await Promise.all([
                this.playerService.findPlayerRoom(userName, room?.room_id!),
                this.playerService.countPlayers(room?.room_id!)
            ])


            if (countPlayer >= room?.max_players) {
                throw new AppError(400, 'sala esta cheia')
            }



            //cria o player
            const player = await this.playerService.createPlayer(userName)

            //verifica se ele ja existe na sala

            await this.repo.joinRoom(player.player_id, room.room_id)


            this.socket.lobby(room.room_code)

            return {
                player_id: player.player_id,
                player_name: player.player_name
            }
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
    //Player sai da sala
    async leaveRoom(id: string, roomCode: string): Promise<void> {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode)

            await Promise.all([
                this.repo.leaveRoom(id, room?.room_id!),
                this.playerService.deletePlayer(id)
            ])

            this.socket.leaveRoom(room?.room_code!)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
    //começa a partida
    async start(user: AuthPayload, id: number): Promise<void> {
        try {

            const room = await this.repo.findByRoom(undefined, undefined, id)
            const countPlayers = await this.playerService.countPlayers(id)
            if (!room) {
                throw new AppError(404, 'sala nao encontrado')
            }
            if (room?.host_user_id !== user.id) {
                throw new AppError(400, 'voce nao é o host dessa sala')
            }
            if (countPlayers < 2) {
                throw new AppError(400, 'quantidade de jogadores nescessario 2')
            }
            const question = await this.serviceQuestion.findQuestion(room.room_id, 1)

            await Promise.all([
                this.servicePower.createPowerPlayers(room.room_id),
                this.repoRound.createRound(room.room_id, question?.question_id!),
                this.repo.roomUpdate(room.room_id, "LIVE")
            ])

            this.socket.roundStarted(room.room_code)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
    //faz o update da position da room
    async updateRoomPosition(roomCode: string) {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode)

            return await this.repo.roomUpdate(room?.room_id!)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
    //encontra alternativas
    async findAlternatives(questionId: number, alternativeId: number) {
        try {
            const alternatives = await this.repo.findAlternative(questionId, alternativeId)
            return alternatives
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao buscar alternatives')
        }
    }
    //encontrar alternativas erradas
    async findAlternativesIncorret(questionId: number) {
        try {
            const alternatives = await this.repo.findAlternativeIncorret(questionId)

            if (!alternatives) {
                throw new AppError(404, 'alternativas nao encontradas')
            }
            return alternatives
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao buscar alternatives incorretas')
        }
    }
    //terminou a room e limpa tudo
    async limparRoom(roomCode: string, roundId: number): Promise<void> {
        try {
            console.log(roomCode, roundId);
            const room = await this.repo.findByRoom(undefined, roomCode)
            console.log(room);
            await this.repo.limparRoom(room?.room_id!, roundId)
            this.socket.roomFinished(roomCode)
        } catch (error) {
            console.log(error);

            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao limpar room')
        }
    }
}