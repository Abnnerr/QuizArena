import type { Rooms } from "@prisma/client";
import { AppError } from "../../error/AppError.js";
import type { SocketService } from "../../shared/services/socket.service.js";
import type { AuthPayload } from "../../types/generic.js";
import type { PlayerService } from "../players/player.service.js";
import type { IRoomRepository } from "./contracts/room.repository.contract.js";
import type { IRoomService } from "./contracts/room.service.contract.js";
import type { RoomCreateDTO } from "./schema/roomCreate.schema.js";
import { Logger } from "../../shared/services/logger.service.js";
import { measure } from "../../observability/measure.js";
import type { IQuestionService } from "../question/contracts/question.service.contract.js";
import type { IPowerService } from "../powers/contracts/power.service.contract.js";
import type { IRoundRepository } from "../round/contracts/round.repository.contract.js";

export class RoomService implements IRoomService {
    private playerService!: PlayerService;
    constructor(
        private readonly repo: IRoomRepository,
        private readonly serviceQuestion: IQuestionService,
        private readonly servicePower: IPowerService,
        private readonly repoRound: IRoundRepository,
        private readonly socket: SocketService
    ) { }

    setPlayerService(playerService: PlayerService) {
        this.playerService = playerService;
    }

    //Cria a sala
    async createRoom(user: AuthPayload, dados: RoomCreateDTO): Promise<string> {
        return measure("RoomService.createRoom", async () => {
            try {
                Logger.info("RoomService", "createRoom.started", {
                    userId: user.id,
                    roomName: dados.name
                });

                const room = await this.repo.findByRoom(dados.name);

                if (room) {
                    Logger.warn("RoomService", "createRoom.room_already_exists", {
                        roomName: dados.name
                    });

                    throw new AppError(409, "Já existe uma sala com esse nome");
                }

                const idQuestions = await this.serviceQuestion.createQuestions(dados.questions);

                const roomcreate = await this.repo.createRoom(
                    user.id,
                    dados,
                    idQuestions
                );

                Logger.info("RoomService", "createRoom.completed", {
                    roomId: roomcreate.room_id,
                    roomCode: roomcreate.room_code,
                    questionsCount: idQuestions.length
                });

                return roomcreate.room_code;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("RoomService", "createRoom.failed", error);

                throw new AppError(500, "Erro ao criar sala");
            }
        });
    }
    // Encontra a sala
    async findRoom(code: string): Promise<Rooms> {
        return measure("RoomService.findRoom", async () => {
            try {
                Logger.info("RoomService", "findRoom.started", {
                    roomCode: code
                });
                const room = await this.repo.findByRoom(undefined, code);

                if (!room) {
                    Logger.warn("RoomService", "findRoom.not_found", {
                        roomCode: code
                    });

                    throw new AppError(404, "Sala não encontrada");
                }
                Logger.info("RoomService", "findRoom.completed", {
                    roomId: room.room_id,
                    roomCode: room.room_code
                });
                return room;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("RoomService", "findRoom.failed", error);
                throw new AppError(500, "Erro ao buscar sala");
            }
        });
    }
    // Entra em uma sala
    async joinRoom(roomCode: string, userName: string): Promise<{
        player_id: string;
        player_name: string;
    }> {
        return measure("RoomService.joinRoom", async () => {
            try {
                Logger.info("RoomService", "joinRoom.started", {
                    roomCode,
                    userName
                });

                const room = await this.repo.findByRoom(undefined, roomCode);

                if (!room) {
                    Logger.warn("RoomService", "joinRoom.room_not_found", {
                        roomCode
                    });

                    throw new AppError(404, "Sala não encontrada");
                }

                if (room.room_status !== "LOBBY") {
                    Logger.warn("RoomService", "joinRoom.room_not_open", {
                        roomId: room.room_id,
                        roomStatus: room.room_status
                    });

                    throw new AppError(400, "A sala não está aberta");
                }

                const [, countPlayer] = await Promise.all([
                    this.playerService.findPlayerRoom(userName, room.room_id),
                    this.playerService.countPlayers(room.room_id)
                ]);

                if (countPlayer >= room.max_players) {
                    Logger.warn("RoomService", "joinRoom.room_full", {
                        roomId: room.room_id,
                        countPlayer,
                        maxPlayers: room.max_players
                    });

                    throw new AppError(400, "Sala está cheia");
                }

                const player = await this.playerService.createPlayer(userName);

                await this.repo.joinRoom(player.player_id, room.room_id);

                this.socket.lobby(room.room_code);

                Logger.info("RoomService", "joinRoom.completed", {
                    roomId: room.room_id,
                    playerId: player.player_id
                });

                return {
                    player_id: player.player_id,
                    player_name: player.player_name
                };

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("RoomService", "joinRoom.failed", error, {
                    roomCode,
                    userName
                });
                throw new AppError(500, "Erro ao entrar na sala");
            }
        });
    }
    //Player sai da sala
    async leaveRoom(id: string, roomCode: string): Promise<void> {
        return measure("RoomService.leaveRoom", async () => {
            try {
                Logger.info("RoomService", "leaveRoom.started", {
                    playerId: id,
                    roomCode
                });

                const room = await this.repo.findByRoom(undefined, roomCode);

                if (!room) {
                    Logger.warn("RoomService", "leaveRoom.room_not_found", {
                        roomCode
                    });

                    throw new AppError(404, "Sala não encontrada");
                }

                await Promise.all([
                    this.repo.leaveRoom(id, room.room_id),
                    this.playerService.deletePlayer(id)
                ]);

                this.socket.leaveRoom(room.room_code);

                Logger.info("RoomService", "leaveRoom.completed", {
                    playerId: id,
                    roomId: room.room_id
                });
            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("RoomService", "leaveRoom.failed", error, {
                    playerId: id,
                    roomCode
                });
                throw new AppError(500, "Erro ao sair da sala");
            }
        });
    }
    // Começa a partida
    async start(user: AuthPayload, id: number): Promise<void> {
        return measure("RoomService.start", async () => {
            try {
                Logger.info("RoomService", "start.started", {
                    roomId: id,
                    userId: user.id
                });

                const [room, countPlayers] = await Promise.all([
                    this.repo.findByRoom(undefined, undefined, id),
                    this.playerService.countPlayers(id)
                ]);

                if (!room) {
                    Logger.warn("RoomService", "start.room_not_found", {
                        roomId: id
                    });

                    throw new AppError(404, "Sala não encontrada");
                }

                if (room.host_user_id !== user.id) {
                    Logger.warn("RoomService", "start.unauthorized", {
                        roomId: id,
                        userId: user.id
                    });

                    throw new AppError(400, "Você não é o host dessa sala");
                }

                if (countPlayers < 2) {
                    Logger.warn("RoomService", "start.insufficient_players", {
                        roomId: id,
                        countPlayers
                    });

                    throw new AppError(400, "Quantidade de jogadores necessária: 2");
                }

                const question = await this.serviceQuestion.findQuestion(room.room_id, 1);

                if (!question) {
                    throw new AppError(404, "Pergunta não encontrada");
                }

                await Promise.all([
                    this.servicePower.createPowerPlayers(room.room_id),
                    this.repoRound.createRound(room.room_id, question.question_id),
                    this.repo.roomUpdate(room.room_id, "LIVE")
                ]);

                this.socket.roundStarted(room.room_code);

                Logger.info("RoomService", "start.completed", {
                    roomId: room.room_id,
                    roomCode: room.room_code,
                    countPlayers
                });

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("RoomService", "start.failed", error, {
                    roomId: id,
                    userId: user.id
                });
                throw new AppError(500, "Erro ao iniciar partida");
            }
        });
    }
    // Faz o update da position da room
    async updateRoomPosition(roomCode: string): Promise<Rooms> {
        return measure("RoomService.updateRoomPosition", async () => {
            try {
                Logger.info("RoomService", "updateRoomPosition.started", {
                    roomCode
                });

                const room = await this.repo.findByRoom(undefined, roomCode);

                if (!room) {
                    throw new AppError(404, "Sala não encontrada");
                }

                const result = await this.repo.roomUpdate(room.room_id);

                Logger.info("RoomService", "updateRoomPosition.completed", {
                    roomId: room.room_id,
                    roomCode
                });

                return result;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("RoomService", "updateRoomPosition.failed", error, {
                    roomCode
                });

                throw new AppError(500, "Erro ao atualizar posição da sala");
            }
        });
    }
    // Encontra alternativas
    async findAlternatives(questionId: number, alternativeId?: number): Promise<{ alternative_id: number, is_correct: boolean } | null> {
        return measure("RoomService.findAlternatives", async () => {
            try {
                Logger.info("RoomService", "findAlternatives.started", {
                    questionId,
                    alternativeId
                });

                const alternatives = await this.repo.findAlternative(
                    questionId,
                    alternativeId
                );

                Logger.info("RoomService", "findAlternatives.completed", {
                    questionId
                });

                return alternatives;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("RoomService", "findAlternatives.failed", error, {
                    questionId,
                    alternativeId
                });

                throw new AppError(500, "Erro ao buscar alternativas");
            }
        });
    }

    async getAnswerStatistics(roundId: number, questionId: number): Promise<{
        alternativeId: number;
        isCorrect: boolean;
        count: number;
    }[]> {
        return measure("RoomService.getAnswerStatistics", async () => {
            try {
                Logger.info("RoomService", "getAnswerStatistics.started", {
                    roundId,
                    questionId
                });

                const result = await this.repo.getAnswerStatistics(
                    roundId,
                    questionId
                );

                Logger.info("RoomService", "getAnswerStatistics.completed", {
                    roundId,
                    questionId
                });

                return result;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("RoomService", "getAnswerStatistics.failed", error, {
                    roundId,
                    questionId
                });

                throw new AppError(500, "Erro ao buscar estatísticas das respostas");
            }
        });
    }
    // Encontra alternativas erradas
    async findAlternativesIncorret(questionId: number): Promise<{ alternative_id: number }[]> {
        return measure("RoomService.findAlternativesIncorret", async () => {
            try {
                Logger.info("RoomService", "findAlternativesIncorret.started", {
                    questionId
                });

                const alternatives = await this.repo.findAlternativeIncorret(
                    questionId
                );

                if (!alternatives || alternatives.length === 0) {
                    throw new AppError(404, "Alternativas não encontradas");
                }

                Logger.info("RoomService", "findAlternativesIncorret.completed", {
                    questionId,
                    count: alternatives.length
                });

                return alternatives;

            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }

                Logger.error("RoomService", "findAlternativesIncorret.failed", error, {
                    questionId
                });

                throw new AppError(500, "Erro ao buscar alternativas incorretas");
            }
        });
    }
    // Termina a room e limpa tudo
    async limparRoom(roomCode: string, roundId: number): Promise<void> {
        return measure("RoomService.limparRoom", async () => {
            try {
                Logger.info("RoomService", "limparRoom.started", {
                    roomCode,
                    roundId
                });

                const room = await this.repo.findByRoom(undefined, roomCode);

                if (!room) {
                    throw new AppError(404, "Sala não encontrada");
                }

                await this.repo.limparRoom(room.room_id);

                this.socket.roomFinished(roomCode);

                Logger.info("RoomService", "limparRoom.completed", {
                    roomId: room.room_id,
                    roomCode,
                    roundId
                });
            } catch (error) {
                if (error instanceof AppError) {
                    throw error;
                }
                Logger.error("RoomService", "limparRoom.failed", error, {
                    roomCode,
                    roundId
                });
                throw new AppError(500, "Erro ao limpar sala");
            }
        });
    }
}