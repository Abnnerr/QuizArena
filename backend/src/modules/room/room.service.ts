import type { Rooms, Round } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { PlayerService } from "../players/player.service.js";
import type { QuestionRepository } from "../question/question.repository.js";
import type { RoundRepository } from "../round/round.repository.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import type { AnswerRepository } from "../answers/answers.repository.js";
import type { QuestionService } from "../question/question.service.js";

export class RoomService implements IRoomService {

    private playerService!: PlayerService;

    constructor(
        private readonly repo: IRoomRepository,
        private readonly serviceQuestion: QuestionService,
        private readonly repoRound: RoundRepository,
        private readonly repoAnswer: AnswerRepository,
        private readonly socket: SocketService
    ) { }


    setPlayerService(playerService: PlayerService) {
        this.playerService = playerService;
    }

    //Cria a sala
    async createRoom(user: AuthPayload, dados: RoomCreateDTO): Promise<string> {
        try {
            const room = await this.repo.findByRoom(dados.name)
            if (room) {
                throw new AppError(409, 'Já existe uma sala com esse nome')
            }
            const idQuestions = await this.serviceQuestion.createQuestions(dados.questions)
            const roomcreate = await this.repo.createRoom(user.id, dados, idQuestions)
            console.log(idQuestions);
            console.log(roomcreate);
            return roomcreate.room_code
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar sala')
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
            const countPLayer = await this.playerService.countPlayers(room?.room_id!)
            if (countPLayer >= room?.max_players) {
                throw new AppError(400, 'sala esta cheia')
            }
            const player = await this.playerService.createPlayer(userName)
            await this.playerService.findPlayerRoom(player.player_id, room?.room_id!)
            await this.repo.joinRoom(player.player_id, room.room_id)
            this.socket.lobby(room.room_code, player.player_id, player.player_name)
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
            await this.repo.leaveRoom(id, room?.room_id!)
            await this.playerService.deletePlayer(id)
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
            await this.repoRound.createRound(room.room_id, question?.question_id!)
            await this.repo.roomUpdate(room.room_id, "LIVE")
            this.socket.roundStarted(room.room_code)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
}