import type { Rooms } from "@prisma/client";
import { io } from "../../app/server.js";
import { AppError } from "../../error/AppError.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { PlayerService } from "../players/player.service.js";
import type { QuestionRepository } from "../question/question.repository.js";
import type { RoundRepository } from "../round/round.repository.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";

export class RoomService implements IRoomService {
    constructor(
        private readonly repo: IRoomRepository,
        private readonly repoQuestion: QuestionRepository,
        private readonly playerService: PlayerService,
        private readonly repoRound: RoundRepository,
        private readonly socket: SocketService
    ) { }

    async create(user: AuthPayload, dados: RoomCreateDTO): Promise<string> {
        try {
            const room = await this.repo.findByRoom(dados.name)

            if (room) {
                throw new AppError(409, 'Já existe uma sala com esse nome')
            }

            if (dados.questions.length > 4) {
                throw new AppError(409, 'Já existe uma sala com esse nome')
            }
            const idQuestions = await this.repoQuestion.create(dados)

            const roomcreate = await this.repo.create(user.id, dados, idQuestions)

            return roomcreate.room_code
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar sala')
        }
    }
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
    async join(roomCode: string, userName: string): Promise<any> {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode)




            if (!room) {
                throw new AppError(404, 'sala nao encontrada')
            }
            if (room.room_status !== 'LOBBY') {
                throw new AppError(400, "A sala não está aberta");
            }

            const countPLayer = await this.repo.countPlayers(room?.room_id!)

            if (countPLayer >= room?.max_players) {
                throw new AppError(400, 'sala esta cheia')
            }

            const player = await this.playerService.createPlayer(userName)
            const find = await this.repo.findPlayer(player.player_id, room?.room_id!)

            if (find) {
                throw new AppError(400, 'player ja esta na sala')
            }



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
    async leave(id: string, roomCode: string): Promise<void> {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode)
            await this.repo.leaveRoom(id, room?.room_id!)
            await this.playerService.deletePlayer(id)

        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
    async ready(id: string, roomId: string, ready: boolean): Promise<void> {
        try {
            console.log(id, roomId, ready);

            const player = await this.repo.readyPlayer(id, Number(roomId), ready)

            const room = await this.repo.findByRoom(undefined, undefined, Number(roomId))

            this.socket.playerReady(room?.room_code!, player.player_id, player.ready)

        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro entrar na sala')
        }
    }
    async start(user: AuthPayload, id: number): Promise<void> {
        try {
            const room = await this.repo.findByRoom(undefined, undefined, id)
            const countPlayers = await this.repo.countPlayers(id)
            if (!room) {
                throw new AppError(404, 'sala nao encontrado')
            }
            if (room?.host_user_id !== user.id) {
                throw new AppError(400, 'voce nao é o host dessa sala')
            }
            if (countPlayers < 2) {
                throw new AppError(400, 'quantidade de jogadores nescessario 2')
            }

            const question = await this.repoQuestion.findQuestion(room.room_id, 1)

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


    async findQuestions(roomCode: string, position: number) {
        try {
            const room = await this.repo.findByRoom(undefined,roomCode,);

            if (!room) {
                throw new AppError(404, "Sala não encontrada");
            }

            const question = await this.repoQuestion.findQuestion(room.room_id,position + 1,);

            if (!question) {
                throw new AppError(404, "Pergunta não encontrada");
            }

            const existingRound = await this.repoRound.findByQuestion(room.room_id,question.question_id,);

            if (existingRound) {
                throw new AppError(409, "Round já existe");
            }
            const round = await this.repoRound.createRound(
                room.room_id,
                question.question_id,
            );

            this.socket.findQuestion(roomCode, round);

            return round;
        } catch (error) {
            if (error instanceof AppError) {
                throw error;
            }

            throw new AppError(500, "Erro ao buscar perguntas");
        }
    }

}