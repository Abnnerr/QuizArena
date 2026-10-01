import { io } from "../../app/server.js";
import { AppError } from "../../error/AppError.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { QuestionRepository } from "../question/question.repository.js";
import type { RoundRepository } from "../round/round.repository.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";

export class RoomService implements IRoomService {
    constructor(
        private readonly repo: IRoomRepository,
        private readonly repoQuestion: QuestionRepository,
        private readonly repoRound: RoundRepository,
        private readonly socket: SocketService
    ) { }

    async create(user: AuthPayload, dados: RoomCreateDTO): Promise<void> {
        try {
            const room = await this.repo.findByRoom(dados.name)

            if (room) {
                throw new AppError(409, 'Já existe uma sala com esse nome')
            }

            if (dados.questions.length > 4) {
                throw new AppError(409, 'Já existe uma sala com esse nome')
            }
            const idQuestions = await this.repoQuestion.create(dados)

            const createRoom = await this.repo.create(dados, idQuestions)

            await this.repo.join(user, createRoom.room_id)

        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao criar sala')
        }
    }
    async join(user: AuthPayload, name: string): Promise<void> {
        try {
            const room = await this.repo.findByRoom(name)

            const count = await this.repo.countPlayers(room?.room_id!)

            const player = await this.repo.findPlayer(user.id, room?.room_id!)

            if (!room) {
                throw new AppError(404, 'Sala nao encontrada')
            }
            if (player) {
                throw new AppError(409, 'jogador ja esta na sala')
            }
            if (count >= room.max_players) {
                throw new AppError(409, "A sala está cheia")
            }
            if (room?.room_status !== 'LOBBY') {
                throw new AppError(409, "Não é possível entrar. A sala já começou ou foi finalizada.")
            }


            await this.repo.join(user, room.room_id)
        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao entrar na sala')
        }
    }
    async start(user: AuthPayload, id: number): Promise<void> {
        try {
            const room = await this.repo.findByRoom(undefined, id)

            if (!room) {
                throw new AppError(404, 'Sala nao encontrada')
            }

            const host = await this.repo.findPlayer(user.id, room.room_id)

            if (!host?.is_host) {
                throw new AppError(403, "Você não é o host dessa sala")

            }
            if (room.room_status !== "LOBBY") {
                throw new AppError(409, "A sala não está no lobby")
            }

            const players = await this.repo.countPlayers(room.room_id)

            if (players < 2) {
                throw new AppError(409, "É necessário ter pelo menos 2 jogadores")
            }

            const countQuestion = await this.repo.countQuestions(room.room_id)

            if (countQuestion < 2) {
                throw new AppError(409, "É necessário ter pelo menos 4 perguntas")
            }

            const question = await this.repoQuestion.findQuestion(room.room_id, 1)

            const round = await this.repoRound.createRound(room.room_id, question?.question_id!)

            await this.repo.update(room.room_id, "LIVE")

            const currentRound = await this.repoRound.findById(round.round_id)


            this.socket.roundStarted(room.room_id, {
                roundId: currentRound?.round_id,
                question: currentRound?.questions
            })


        } catch (error) {
            if (error instanceof AppError) {
                throw error
            }
            throw new AppError(500, 'Erro ao entrar na sala')
        }
    }
}