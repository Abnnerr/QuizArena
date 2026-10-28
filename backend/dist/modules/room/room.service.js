import { AppError } from "../../error/AppError.js";
export class RoomService {
    repo;
    serviceQuestion;
    repoRound;
    socket;
    playerService;
    constructor(repo, serviceQuestion, repoRound, socket) {
        this.repo = repo;
        this.serviceQuestion = serviceQuestion;
        this.repoRound = repoRound;
        this.socket = socket;
    }
    setPlayerService(playerService) {
        this.playerService = playerService;
    }
    //Cria a sala
    async createRoom(user, dados) {
        try {
            const room = await this.repo.findByRoom(dados.name);
            if (room) {
                throw new AppError(409, 'Já existe uma sala com esse nome');
            }
            const idQuestions = await this.serviceQuestion.createQuestions(dados.questions);
            const roomcreate = await this.repo.createRoom(user.id, dados, idQuestions);
            console.log(idQuestions);
            console.log(roomcreate);
            return roomcreate.room_code;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar sala');
        }
    }
    //encontra a sala
    async findRoom(code) {
        try {
            const room = await this.repo.findByRoom(undefined, code);
            if (!room) {
                throw new AppError(404, 'Sala nao encontrada');
            }
            return room;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao criar sala');
        }
    }
    //player entra
    async joinRoom(roomCode, userName) {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode);
            if (!room) {
                throw new AppError(404, 'sala nao encontrada');
            }
            if (room.room_status !== 'LOBBY') {
                throw new AppError(400, "A sala não está aberta");
            }
            const countPLayer = await this.playerService.countPlayers(room?.room_id);
            if (countPLayer >= room?.max_players) {
                throw new AppError(400, 'sala esta cheia');
            }
            const player = await this.playerService.createPlayer(userName);
            await this.playerService.findPlayerRoom(player.player_id, room?.room_id);
            await this.repo.joinRoom(player.player_id, room.room_id);
            this.socket.lobby(room.room_code);
            return {
                player_id: player.player_id,
                player_name: player.player_name
            };
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro entrar na sala');
        }
    }
    //Player sai da sala
    async leaveRoom(id, roomCode) {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode);
            await this.repo.leaveRoom(id, room?.room_id);
            await this.playerService.deletePlayer(id);
            this.socket.leaveRoom(room?.room_code);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro entrar na sala');
        }
    }
    //começa a partida
    async start(user, id) {
        try {
            const room = await this.repo.findByRoom(undefined, undefined, id);
            const countPlayers = await this.playerService.countPlayers(id);
            if (!room) {
                throw new AppError(404, 'sala nao encontrado');
            }
            if (room?.host_user_id !== user.id) {
                throw new AppError(400, 'voce nao é o host dessa sala');
            }
            if (countPlayers < 2) {
                throw new AppError(400, 'quantidade de jogadores nescessario 2');
            }
            const question = await this.serviceQuestion.findQuestion(room.room_id, 1);
            await this.repoRound.createRound(room.room_id, question?.question_id);
            await this.repo.roomUpdate(room.room_id, "LIVE");
            this.socket.roundStarted(room.room_code);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro entrar na sala');
        }
    }
    //faz o update da position da room
    async updateRoomPosition(roomCode) {
        try {
            const room = await this.repo.findByRoom(undefined, roomCode);
            return await this.repo.roomUpdate(room?.room_id);
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro entrar na sala');
        }
    }
    //encontra alternativas
    async findAlternatives(questionId, alternativeId) {
        try {
            const alternatives = await this.repo.findAlternative(questionId, alternativeId);
            return alternatives;
        }
        catch (error) {
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao buscar alternatives');
        }
    }
    //terminou a room limpa tudo
    async limparRoom(roomCode, roundId) {
        try {
            console.log(roomCode, roundId);
            const room = await this.repo.findByRoom(undefined, roomCode);
            console.log(room);
            await this.repo.limparRoom(room?.room_id, roundId);
            this.socket.roomFinished(roomCode);
        }
        catch (error) {
            console.log(error);
            if (error instanceof AppError) {
                throw error;
            }
            throw new AppError(500, 'Erro ao limpar room');
        }
    }
}
//# sourceMappingURL=room.service.js.map