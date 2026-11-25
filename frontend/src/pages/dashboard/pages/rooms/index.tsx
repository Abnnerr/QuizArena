
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    FiPlus,
    FiUsers,
    FiClock,
    FiArrowUpRight,
    FiMonitor,
    FiPlay,
    FiXCircle,
    FiX,
    FiZap,
    FiShield,
    FiCheck,
    FiLoader,
    FiTrash2,
} from "react-icons/fi";
import { AXIOS } from "../../../../service";
import Button from "../../../../shared/ui/Button";
import { useTheme } from "../../../../contexts/hooks/useTheme";
import { useToast } from "../../../../contexts/hooks/useToast";

type RoomStatus = "LOBBY" | "LIVE";
type RoomMode = "NORMAL" | "HARDCORE";

interface Room {
    room_id: number;
    room_code: string;
    room_name: string;
    max_players: number;
    time_limit: number;
    room_mode: RoomMode;
    room_status: RoomStatus;
    players_count: number;
    created_at: string;
}

const BoardRoomsPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const { toast } = useToast();

    const [rooms, setRooms] = useState<Room[]>([]);
    const [loading, setLoading] = useState(true);
    const [creating, setCreating] = useState(false);
    const [deletingRoomId, setDeletingRoomId] = useState<number | null>(null);

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [roomName, setRoomName] = useState("");
    const [maxPlayers, setMaxPlayers] = useState(5);
    const [timeLimit, setTimeLimit] = useState(15);
    const [roomMode, setRoomMode] = useState<RoomMode>("NORMAL");

    async function findRooms() {
        try {
            const { data } = await AXIOS.get("/room/findRooms");

            if (data.type === "Success") {
                setRooms(data.data ?? []);
            }
        } catch {
            toast.error("Não foi possível carregar suas salas.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void findRooms();
    }, []);

    async function handleCreateRoom(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        if (!roomName.trim() || creating) return;

        setCreating(true);

        try {
            const { data } = await AXIOS.post("/room/create", {
                name: roomName.trim(),
                maxPlayers,
                timeLimit,
                mode: roomMode,
            });

            if (data.type !== "Success") {
                toast.error(data.message ?? "Não foi possível criar a sala.");
                return;
            }

            toast.success("Sala criada com sucesso!");

            setRoomName("");
            setMaxPlayers(5);
            setTimeLimit(15);
            setRoomMode("NORMAL");
            setIsCreateOpen(false);

            await findRooms();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ?? "Erro ao criar a sala."
            );
        } finally {
            setCreating(false);
        }
    }

    async function deleteRoom(room: Room) {
        if (deletingRoomId !== null) return;

        setDeletingRoomId(room.room_id);

        try {
            const { data } = await AXIOS.delete(
                `/room/${room.room_id}/deletar`
            );

            if (data.type !== "Success") {
                toast.error(data.message ?? "Não foi possível excluir a sala.");
                return;
            }

            setRooms(current =>
                current.filter(item => item.room_id !== room.room_id)
            );

            toast.success("Sala excluída com sucesso!");
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ?? "Erro ao excluir a sala."
            );
        } finally {
            setDeletingRoomId(null);
        }
    }

    function closeCreateDrawer() {
        if (creating) return;
        setIsCreateOpen(false);
    }

    const statusInfo = {
        LOBBY: {
            label: "Aguardando",
            icon: <FiClock />,
            color: "#E5A000",
            background: "rgba(229,160,0,0.12)",
        },
        LIVE: {
            label: "Em andamento",
            icon: <FiPlay />,
            color: "#1CB0F6",
            background: "rgba(28,176,246,0.12)",
        },
    };

    return (
        <div
            className="min-h-screen p-5 md:p-8"
            style={{
                background: colors.background,
                color: colors.text,
            }}
        >
            <div className="mx-auto max-w-7xl">

                <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div className="mb-2 flex items-center gap-3">
                            <div className="rounded-xl border-b-4 border-[#0092D6] bg-[#1CB0F6] p-3 text-white">
                                <FiMonitor size={25} />
                            </div>

                            <h1 className="text-3xl font-black md:text-4xl">
                                Minhas salas
                            </h1>
                        </div>

                        <p style={{ color: colors.muted }}>
                            Gerencie suas salas e acompanhe suas partidas.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        leftIcon={<FiPlus size={20} />}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Criar sala
                    </Button>
                </div>

                <div className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
                    {[
                        {
                            label: "Total de salas",
                            value: rooms.length,
                            icon: <FiMonitor />,
                            color: "#1CB0F6",
                        },
                        {
                            label: "Aguardando",
                            value: rooms.filter(room => room.room_status === "LOBBY").length,
                            icon: <FiClock />,
                            color: "#E5A000",
                        },
                        {
                            label: "Em andamento",
                            value: rooms.filter(room => room.room_status === "LIVE").length,
                            icon: <FiPlay />,
                            color: "#1CB0F6",
                        },
                    ].map(stat => (
                        <div
                            key={stat.label}
                            className="rounded-2xl border-2 p-5"
                            style={{
                                background: colors.card,
                                borderColor: colors.border,
                            }}
                        >
                            <div className="mb-3 flex items-center justify-between">
                                <span
                                    className="text-sm font-bold"
                                    style={{ color: colors.muted }}
                                >
                                    {stat.label}
                                </span>

                                <span style={{ color: stat.color }}>
                                    {stat.icon}
                                </span>
                            </div>

                            <p className="text-3xl font-black">
                                {stat.value}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-xl font-black">
                        Suas salas
                    </h2>

                    <span
                        className="text-sm font-bold"
                        style={{ color: colors.muted }}
                    >
                        {rooms.length} sala(s)
                    </span>
                </div>

                {loading ? (
                    <div
                        className="rounded-2xl border-2 p-12 text-center"
                        style={{
                            background: colors.card,
                            borderColor: colors.border,
                            color: colors.muted,
                        }}
                    >
                        Carregando salas...
                    </div>
                ) : rooms.length === 0 ? (
                    <div
                        className="rounded-2xl border-2 border-dashed p-12 text-center"
                        style={{
                            background: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <FiXCircle
                            className="mx-auto mb-4 text-4xl"
                            style={{ color: colors.muted }}
                        />

                        <h3 className="mb-2 text-xl font-black">
                            Você ainda não possui salas
                        </h3>

                        <p className="mb-5" style={{ color: colors.muted }}>
                            Crie sua primeira sala e comece uma partida.
                        </p>

                        <Button
                            variant="primary"
                            leftIcon={<FiPlus />}
                            onClick={() => setIsCreateOpen(true)}
                        >
                            Criar minha primeira sala
                        </Button>
                    </div>
                ) : (
                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {rooms.map(room => {
                            const status = statusInfo[room.room_status];
                            const deleting = deletingRoomId === room.room_id;

                            return (
                                <div
                                    key={room.room_id}
                                    className="rounded-2xl border-2 p-5 transition hover:-translate-y-1"
                                    style={{
                                        background: colors.card,
                                        borderColor: colors.border,
                                    }}
                                >
                                    {/* Cabeçalho do card */}
                                    <div className="mb-4 flex items-start justify-between gap-3">
                                        <div className="min-w-0">
                                            <p
                                                className="mb-1 text-xs font-black uppercase tracking-wider"
                                                style={{ color: colors.muted }}
                                            >
                                                Código: {room.room_code}
                                            </p>

                                            <h3 className="break-words text-xl font-black">
                                                {room.room_name}
                                            </h3>
                                        </div>

                                        <div className="flex shrink-0 items-center gap-2">
                                            <span
                                                className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-black"
                                                style={{
                                                    background: status.background,
                                                    color: status.color,
                                                }}
                                            >
                                                {status.icon}
                                                {status.label}
                                            </span>

                                            <Button
                                                variant="danger"
                                                size="icon"
                                                leftIcon={
                                                    deleting
                                                        ? <FiLoader className="animate-spin" size={17} />
                                                        : <FiTrash2 size={17} />
                                                }
                                                onClick={() => deleteRoom(room)}
                                                disabled={deletingRoomId !== null}
                                                title="Excluir sala"
                                                aria-label={`Excluir sala ${room.room_name}`}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-5 grid grid-cols-2 gap-3">
                                        <div
                                            className="rounded-xl p-3"
                                            style={{ background: colors.surface }}
                                        >
                                            <FiUsers className="mb-2 text-[#1CB0F6]" />

                                            <p className="font-black">
                                                {room.players_count}/{room.max_players}
                                            </p>

                                            <p
                                                className="text-xs"
                                                style={{ color: colors.muted }}
                                            >
                                                Jogadores
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-xl p-3"
                                            style={{ background: colors.surface }}
                                        >
                                            <FiClock className="mb-2 text-[#1CB0F6]" />

                                            <p className="font-black">
                                                {room.time_limit}s
                                            </p>

                                            <p
                                                className="text-xs"
                                                style={{ color: colors.muted }}
                                            >
                                                Por pergunta
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex items-center justify-between text-sm">
                                        <span style={{ color: colors.muted }}>
                                            Modo de jogo
                                        </span>

                                        <span className="font-black">
                                            {room.room_mode === "NORMAL"
                                                ? "Normal"
                                                : "Hardcore"}
                                        </span>
                                    </div>

                                    <Button
                                        variant="primary"
                                        fullWidth
                                        rightIcon={<FiArrowUpRight />}
                                        onClick={() =>
                                            navigate(`/dashboard/rooms/${room.room_code}`)
                                        }
                                    >
                                        Acessar sala
                                    </Button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {isCreateOpen && (
                <div
                    className="fixed inset-0 z-50 flex justify-end"
                    onClick={closeCreateDrawer}
                >
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

                    <aside
                        onClick={e => e.stopPropagation()}
                        className="relative z-10 flex h-full w-full max-w-lg flex-col border-l-2 shadow-2xl"
                        style={{
                            background: colors.background,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="flex items-center justify-between border-b-2 p-6"
                            style={{ borderColor: colors.border }}
                        >
                            <div>
                                <div className="mb-1 flex items-center gap-2">
                                    <div className="rounded-lg bg-[#1CB0F6] p-2 text-white">
                                        <FiPlus size={20} />
                                    </div>

                                    <h2 className="text-2xl font-black">
                                        Nova sala
                                    </h2>
                                </div>

                                <p className="text-sm" style={{ color: colors.muted }}>
                                    Configure sua próxima partida.
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                size="icon"
                                leftIcon={<FiX size={20} />}
                                onClick={closeCreateDrawer}
                                disabled={creating}
                                aria-label="Fechar"
                            />
                        </div>

                        <form
                            onSubmit={handleCreateRoom}
                            className="flex flex-1 flex-col overflow-y-auto"
                        >
                            <div className="flex-1 space-y-6 p-6">
                                <div>
                                    <label className="mb-2 block text-sm font-black">
                                        Nome da sala
                                    </label>

                                    <input
                                        type="text"
                                        value={roomName}
                                        onChange={e => setRoomName(e.target.value)}
                                        placeholder="Ex: Desafio de programação"
                                        maxLength={50}
                                        required
                                        className="w-full rounded-xl border-2 p-3 outline-none transition focus:border-[#1CB0F6]"
                                        style={{
                                            background: colors.card,
                                            borderColor: colors.border,
                                            color: colors.text,
                                        }}
                                    />

                                    <p
                                        className="mt-1 text-right text-xs"
                                        style={{ color: colors.muted }}
                                    >
                                        {roomName.length}/50
                                    </p>
                                </div>
                                <div>
                                    <div className="mb-3 flex items-center justify-between">
                                        <label className="flex items-center gap-2 text-sm font-black">
                                            <FiUsers className="text-[#1CB0F6]" />
                                            Máximo de jogadores
                                        </label>

                                        <span className="text-lg font-black text-[#1CB0F6]">
                                            {maxPlayers}
                                        </span>
                                    </div>

                                    <input
                                        type="range"
                                        min={2}
                                        max={30}
                                        value={maxPlayers}
                                        onChange={e => setMaxPlayers(Number(e.target.value))}
                                        className="w-full accent-[#1CB0F6]"
                                    />

                                    <div
                                        className="flex justify-between text-xs"
                                        style={{ color: colors.muted }}
                                    >
                                        <span>2 jogadores</span>
                                        <span>30 jogadores</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 flex items-center gap-2 text-sm font-black">
                                        <FiClock className="text-[#1CB0F6]" />
                                        Tempo por pergunta
                                    </label>

                                    <div className="grid grid-cols-3 gap-2">
                                        {[10, 20, 30, 45, 60, 90].map(time => (
                                            <Button
                                                key={time}
                                                type="button"
                                                variant={timeLimit === time ? "primary" : "secondary"}
                                                fullWidth
                                                onClick={() => setTimeLimit(time)}
                                            >
                                                {time}s
                                            </Button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label className="mb-3 block text-sm font-black">
                                        Modo de jogo
                                    </label>

                                    <div className="space-y-3">
                                        <Button
                                            type="button"
                                            variant={roomMode === "NORMAL" ? "primary" : "secondary"}
                                            fullWidth
                                            onClick={() => setRoomMode("NORMAL")}
                                            className="h-17 justify-start whitespace-normal p-4 normal-case tracking-normal"
                                        >
                                            <FiZap size={22} />

                                            <span className="flex-1 text-left">
                                                <span className="block font-black">
                                                    Modo Normal
                                                </span>
                                                <span className="block text-xs font-medium opacity-80">
                                                    Uma partida equilibrada.
                                                </span>
                                            </span>

                                            {roomMode === "NORMAL" && <FiCheck />}
                                        </Button>

                                        <Button
                                            type="button"
                                            variant={roomMode === "HARDCORE" ? "primary" : "secondary"}
                                            fullWidth
                                            onClick={() => setRoomMode("HARDCORE")}
                                            className="h-17 justify-start whitespace-normal p-4 normal-case tracking-normal"
                                        >
                                            <FiShield size={22} />

                                            <span className="flex-1 text-left">
                                                <span className="block font-black">
                                                    Modo Hardcore
                                                </span>
                                                <span className="block text-xs font-medium opacity-80">
                                                    Uma competição mais intensa.
                                                </span>
                                            </span>

                                            {roomMode === "HARDCORE" && <FiCheck />}
                                        </Button>
                                    </div>
                                </div>

                                <div
                                    className="rounded-xl border-2 p-4"
                                    style={{
                                        background: colors.card,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <h3 className="mb-3 text-sm font-black">
                                        Resumo da sala
                                    </h3>

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div>
                                            <p className="text-xl font-black">
                                                {maxPlayers}
                                            </p>
                                            <p className="text-xs" style={{ color: colors.muted }}>
                                                Jogadores
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xl font-black">
                                                {timeLimit}s
                                            </p>
                                            <p className="text-xs" style={{ color: colors.muted }}>
                                                Tempo
                                            </p>
                                        </div>

                                        <div>
                                            <p className="text-xl font-black">
                                                {roomMode === "NORMAL" ? "Normal" : "Hardcore"}
                                            </p>
                                            <p className="text-xs" style={{ color: colors.muted }}>
                                                Modo
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div
                                className="border-t-2 p-6"
                                style={{
                                    background: colors.card,
                                    borderColor: colors.border,
                                }}
                            >
                                <div className="flex gap-3">
                                    <Button
                                        type="button"
                                        variant="secondary"
                                        fullWidth
                                        onClick={closeCreateDrawer}
                                        disabled={creating}
                                    >
                                        Cancelar
                                    </Button>

                                    <Button
                                        type="submit"
                                        variant="primary"
                                        fullWidth
                                        leftIcon={<FiPlus />}
                                        disabled={!roomName.trim() || creating}
                                        isLoading={creating}
                                    >
                                        Criar sala
                                    </Button>
                                </div>
                            </div>
                        </form>
                    </aside>
                </div>
            )}
        </div>
    );
};

export default BoardRoomsPage;
