
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router";
import {
    FiArrowLeft,
    FiBookOpen,
    FiCheck,
    FiCheckCircle,
    FiCircle,
    FiClock,
    FiCopy,
    FiEdit2,
    FiEye,
    FiEyeOff,
    FiPlay,
    FiPlus,
    FiSettings,
    FiTrash2,
    FiUsers,
    FiX,
} from "react-icons/fi";
import { QRCodeSVG } from "qrcode.react";

import { useTheme } from "../../../../../../contexts/ThemeContext";
import { useToast } from "../../../../../../contexts/ToastContext";
import { useAuth } from "../../../../../../contexts/hooks/useAuth";
import { AXIOS } from "../../../../../../service";
import { socket } from "../../../../../../service/socket";
import Button from "../../../../../../shared/ui/Button";

/* TYPES */

type Difficulty = "EASY" | "MEDIUM" | "HARD";
type QuestionType = "MULTIPLE_CHOICE" | "TRUE_FALSE";

interface Category {
    category_id: number;
    title: string;
}

interface Alternative {
    alternative_id: number | string;
    text: string;
    is_correct: boolean;
}

interface Question {
    question_id: number | null;
    user_id: number | string;
    category_id: number;
    category_title: string;
    title: string;
    difficulty: Difficulty;
    question_type: QuestionType;
    isPublic: boolean;
    alternatives: Alternative[];
}

interface Room {
    room_id: number;
    room_code: string;
    room_name: string;
    max_players: number;
    time_limit: number;
    room_mode: string;
    roomPlayers: {
        ready: boolean;
    }[];
    roomQuestions: {
        position: number;
        questions: {
            question_id: number;
            user_id: number | string;
            category_id: number;
            question_text: string;
            difficulty: Difficulty;
            question_type: QuestionType;
            isPublic: boolean;
            category: {
                title: string;
            };
            alternatives: {
                alternative_id: number;
                alternative_text: string;
                is_correct: boolean;
            }[];
        };
    }[];
}

interface ResponseDTO<T> {
    type: "Success" | "Error";
    message: string;
    data: T;
}


const API = {
    room: (code: string) => `/room/${code}`,
    categories: "/category/categories",
    create: "/question/create",
    update: (id: number) => `/question/${id}/update`,
    remove: (roomId: number, questionId: number) => `/question/${roomId}/${questionId}/delete`,
};

const difficultyInfo: Record<Difficulty, { label: string; color: string }> = {
    EASY: { label: "Fácil", color: "#16A36A" },
    MEDIUM: { label: "Médio", color: "#E5A000" },
    HARD: { label: "Difícil", color: "#EF4444" },
};

const newAlternative = (
    text = "",
    is_correct = false
): Alternative => ({
    alternative_id: crypto.randomUUID(),
    text,
    is_correct,
});

const emptyQuestion = (): Question => ({
    question_id: null,
    user_id: "",
    category_id: 0,
    category_title: "",
    title: "",
    difficulty: "MEDIUM",
    question_type: "MULTIPLE_CHOICE",
    isPublic: false,
    alternatives: [
        newAlternative("", true),
        newAlternative(),
    ],
});

export default function BoardRoomPage() {
    const { roomCode } = useParams<{ roomCode: string }>();
    const navigate = useNavigate();

    const { colors } = useTheme();
    const { toast } = useToast();
    const { user } = useAuth();

    const [room, setRoom] = useState<Room | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);

    const [loading, setLoading] = useState(true);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [saving, setSaving] = useState(false);
    const [starting, setStarting] = useState(false);

    const [sidebar, setSidebar] = useState(false);
    const [editing, setEditing] = useState<Question | null>(null);
    const [form, setForm] = useState<Question>(emptyQuestion());

    const fieldStyle: CSSProperties = {
        width: "100%",
        minHeight: 48,
        padding: "12px 14px",
        borderRadius: 12,
        border: `2px solid ${colors.border}`,
        background: colors.surface,
        color: colors.text,
        outline: "none",
        fontSize: 14,
        fontWeight: 600,
        boxSizing: "border-box",
    };

    const questions: Question[] = (room?.roomQuestions ?? [])
        .slice()
        .sort((a, b) => a.position - b.position)
        .map(({ questions: question }) => ({
            question_id: question.question_id,
            user_id: question.user_id,
            category_id: question.category_id,
            category_title: question.category.title,
            title: question.question_text,
            difficulty: question.difficulty,
            question_type: question.question_type,
            isPublic: question.isPublic ?? false,
            alternatives: question.alternatives.map(alternative => ({
                alternative_id: alternative.alternative_id,
                text: alternative.alternative_text,
                is_correct: alternative.is_correct,
            })),
        }));

    const totalPlayers = room?.roomPlayers.length ?? 0;
    const readyPlayers = room?.roomPlayers.filter(player => player.ready).length ?? 0;
    const readyPercentage = totalPlayers ? (readyPlayers / totalPlayers) * 100 : 0;

    const canEditQuestion = (question: Question) =>
        String(question.user_id) === String(user?.user_id);


    async function findRoom() {
        if (!roomCode) return;

        try {
            const { data } = await AXIOS.get<ResponseDTO<Room>>(API.room(roomCode));

            if (data.type !== "Success") {
                toast.error(data.message || "Sala não encontrada.");
                navigate("/board/rooms");
                return;
            }

            setRoom(data.data);
        } catch (error: any) {
            toast.error(error.response.data.message ?? "Não foi possível carregar a sala.");
            navigate("/board/rooms");
        } finally {
            setLoading(false);
        }
    }

    async function findCategories() {
        try {
            setLoadingCategories(true);

            const { data } = await AXIOS.get<ResponseDTO<Category[]>>(API.categories);

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao carregar categorias.");
                return;
            }

            setCategories(data.data ?? []);
        } catch(error: any){
            toast.error(error.response.data.message ?? "Não foi possível carregar as categorias.");
        } finally {
            setLoadingCategories(false);
        }
    }

    useEffect(() => {
        if (!roomCode) return;

        const joinRoom = () => socket.emit("room:join", roomCode);
        const updatePage = () => void findRoom();
        const handleStartRoom = () => navigate(`/room/${roomCode}/live`);

        void findRoom();
        void findCategories();

        socket.on("connect", joinRoom);
        socket.on("room:join", updatePage);
        socket.on("room:leave", updatePage);
        socket.on("room:update", updatePage);
        socket.on("player:ready", updatePage);
        socket.on("room:start", handleStartRoom);

        if (!socket.connected) {
            socket.connect();
        } else {
            joinRoom();
        }

        return () => {
            socket.emit("room:leave", roomCode);

            socket.off("connect", joinRoom);
            socket.off("room:join", updatePage);
            socket.off("room:leave", updatePage);
            socket.off("room:update", updatePage);
            socket.off("player:ready", updatePage);
            socket.off("room:start", handleStartRoom);
        };
    }, [roomCode]);

    /* FORM */

    function openSidebar(question?: Question) {
        setEditing(question ?? null);

        if (question) {
            setForm({
                ...question,
                alternatives: question.alternatives.map(item => ({ ...item })),
            });
        } else {
            setForm({
                ...emptyQuestion(),
                category_id: categories[0]?.category_id ?? 0,
                category_title: categories[0]?.title ?? "",
            });
        }

        setSidebar(true);
    }

    function closeSidebar() {
        if (saving) return;

        setSidebar(false);
        setEditing(null);
        setForm(emptyQuestion());
    }

    function updateForm(changes: Partial<Question>) {
        setForm(current => ({ ...current, ...changes }));
    }

    function changeCategory(categoryId: number) {
        const category = categories.find(item => item.category_id === categoryId);

        updateForm({
            category_id: categoryId,
            category_title: category?.title ?? "",
        });
    }

    function changeType(type: QuestionType) {
        updateForm({
            question_type: type,
            alternatives: type === "TRUE_FALSE"
                ? [
                    newAlternative("Verdadeiro", true),
                    newAlternative("Falso"),
                ]
                : [
                    newAlternative("", true),
                    newAlternative(),
                ],
        });
    }

    function updateAlternative(
        id: number | string,
        changes: Partial<Alternative>
    ) {
        updateForm({
            alternatives: form.alternatives.map(item =>
                item.alternative_id === id ? { ...item, ...changes } : item
            ),
        });
    }

    function selectCorrect(id: number | string) {
        updateForm({
            alternatives: form.alternatives.map(item => ({
                ...item,
                is_correct: item.alternative_id === id,
            })),
        });
    }

    function addAlternative() {
        if (form.alternatives.length >= 4) return;

        updateForm({
            alternatives: [...form.alternatives, newAlternative()],
        });
    }

    function removeAlternative(id: number | string) {
        if (form.alternatives.length <= 2) return;

        const alternatives = form.alternatives.filter(
            item => item.alternative_id !== id
        );

        if (!alternatives.some(item => item.is_correct)) {
            alternatives[0].is_correct = true;
        }

        updateForm({ alternatives });
    }

    const valid =
        form.category_id > 0 &&
        !!form.title.trim() &&
        form.alternatives.length >= 2 &&
        form.alternatives.length <= 4 &&
        form.alternatives.every(item => !!item.text.trim()) &&
        form.alternatives.filter(item => item.is_correct).length === 1;

    async function saveQuestion() {
        if (!room || saving) return;

        if (!valid) {
            toast.warning("Preencha todos os campos corretamente.");
            return;
        }

        const payload = {
            room_id: room.room_id,
            category_id: form.category_id,
            question_text: form.title.trim(),
            question_type: form.question_type,
            difficulty: form.difficulty,
            is_public: form.isPublic,
            alternatives: form.alternatives.map(item => ({
                alternative_text: item.text.trim(),
                is_correct: item.is_correct,
            })),
        };

        try {
            setSaving(true);

            const { data } = editing?.question_id
                ? await AXIOS.patch(
                    API.update(editing.question_id),
                    payload
                )
                : await AXIOS.post(API.create, payload);

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao salvar pergunta.");
                return;
            }

            toast.success(editing ? "Pergunta atualizada!" : "Pergunta criada!");

            setSidebar(false);
            setEditing(null);
            setForm(emptyQuestion());

            await findRoom();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Erro ao salvar pergunta.");
        } finally {
            setSaving(false);
        }
    }


    async function removeQuestion(questionId: number | null) {
        if (!room || !questionId) return;

        try {
            const { data } = await AXIOS.delete(
                API.remove(room.room_id, questionId)
            );

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao remover pergunta.");
                return;
            }

            toast.success("Pergunta removida da partida!");
            await findRoom();
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Erro ao remover pergunta.");
        }
    }

    async function copyRoomCode() {
        if (!room) return;

        try {
            await navigator.clipboard.writeText(room.room_code);
            toast.success("Código da sala copiado!");
        } catch {
            toast.error("Não foi possível copiar o código.");
        }
    }

    async function startRoom() {
        if (!room || starting) return;

        if (!questions.length) {
            toast.warning("Adicione pelo menos uma pergunta.");
            return;
        }

        try {
            setStarting(true);

            const { data } = await AXIOS.get(`/room/${room.room_id}/start`);

            if (data.type !== "Success") {
                toast.error(data.message || "Não foi possível iniciar a partida.");
                return;
            }

            toast.success("Partida iniciada com sucesso!");
        } catch (error: any) {
            toast.error(error?.response?.data?.message ?? 'Error ao iniciar partida');
        } finally {
            setStarting(false);
        }
    }


    if (loading) {
        return (
            <div
                className="flex min-h-screen items-center justify-center font-bold"
                style={{ background: colors.background, color: colors.muted }}
            >
                Carregando sala...
            </div>
        );
    }

    if (!room) return null;

    return (
        <main
            className="min-h-screen p-4 md:p-8"
            style={{ background: colors.background, color: colors.text }}
        >
            <div className="mx-auto max-w-6xl">


                <Button
                    variant="secondary"
                    size="sm"
                    leftIcon={<FiArrowLeft />}
                    onClick={() => navigate("/board/rooms")}
                >
                    Voltar para salas
                </Button>

                <header className="mb-8 mt-6">
                    <span className="flex items-center gap-2 font-black text-[#1CB0F6]">
                        <FiBookOpen />
                        Montagem da partida
                    </span>

                    <h1 className="mt-2 text-3xl font-black">
                        {room.room_name}
                    </h1>


                    <div
                        className="mt-4 flex flex-wrap items-center gap-5 rounded-xl border-2 p-4"
                        style={{
                            background: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold" style={{ color: colors.muted }}>
                                Código de acesso
                            </p>

                            <p className="text-2xl font-black tracking-widest">
                                {room.room_code}
                            </p>

                            <Button
                                variant="secondary"
                                size="sm"
                                leftIcon={<FiCopy />}
                                onClick={copyRoomCode}
                                className="mt-3"
                            >
                                Copiar código
                            </Button>
                        </div>

                        <div className="rounded-xl bg-white p-3">
                            <QRCodeSVG
                                value={`${window.location.origin}/?room=${roomCode}`}
                                size={130}
                                level="H"
                                includeMargin
                            />
                        </div>
                    </div>

                    <div className="mt-5 grid grid-cols-2 gap-3 md:grid-cols-5">
                        <div className="rounded-xl border-2 p-4" style={{ background: colors.surface, borderColor: colors.border }}>
                            <FiBookOpen className="mb-2 text-[#1CB0F6]" />
                            <p className="text-xl font-black">{questions.length}</p>
                            <p className="text-xs font-bold" style={{ color: colors.muted }}>Perguntas</p>
                        </div>

                        <div className="rounded-xl border-2 p-4" style={{ background: colors.surface, borderColor: colors.border }}>
                            <FiUsers className="mb-2 text-[#1CB0F6]" />
                            <p className="text-xl font-black">{totalPlayers}/{room.max_players}</p>
                            <p className="text-xs font-bold" style={{ color: colors.muted }}>Jogadores</p>
                        </div>

                        <div className="rounded-xl border-2 p-4" style={{ background: colors.surface, borderColor: colors.border }}>
                            <FiCheckCircle className="mb-2 text-green-500" />
                            <p className="text-xl font-black">{readyPlayers}/{totalPlayers}</p>
                            <p className="text-xs font-bold" style={{ color: colors.muted }}>Prontos</p>

                            <div className="mt-3 h-2 overflow-hidden rounded-full" style={{ background: colors.border }}>
                                <div
                                    className="h-full rounded-full bg-green-500 transition-all"
                                    style={{ width: `${readyPercentage}%` }}
                                />
                            </div>
                        </div>

                        <div className="rounded-xl border-2 p-4" style={{ background: colors.surface, borderColor: colors.border }}>
                            <FiClock className="mb-2 text-[#1CB0F6]" />
                            <p className="text-xl font-black">{room.time_limit}s</p>
                            <p className="text-xs font-bold" style={{ color: colors.muted }}>Tempo por pergunta</p>
                        </div>

                        <div className="rounded-xl border-2 p-4" style={{ background: colors.surface, borderColor: colors.border }}>
                            <FiSettings className="mb-2 text-[#1CB0F6]" />
                            <p className="text-xl font-black">
                                {room.room_mode === "NORMAL" ? "Normal" : "Hardcore"}
                            </p>
                            <p className="text-xs font-bold" style={{ color: colors.muted }}>Modo</p>
                        </div>
                    </div>
                </header>

                <section>
                    <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                        <div>
                            <h2 className="text-2xl font-black">Perguntas da partida</h2>
                            <p className="text-sm" style={{ color: colors.muted }}>
                                {questions.length} pergunta(s) adicionada(s)
                            </p>
                        </div>

                        <Button
                            variant="primary"
                            leftIcon={<FiPlus />}
                            onClick={() => openSidebar()}
                            disabled={loadingCategories || !categories.length}
                        >
                            Criar pergunta
                        </Button>
                    </div>

                    {!questions.length ? (
                        <div
                            className="rounded-2xl border-2 border-dashed p-12 text-center"
                            style={{ background: colors.card, borderColor: colors.border }}
                        >
                            <FiBookOpen className="mx-auto mb-3 text-4xl text-[#1CB0F6]" />

                            <h3 className="text-xl font-black">Nenhuma pergunta ainda</h3>

                            <p className="my-3" style={{ color: colors.muted }}>
                                Crie sua primeira pergunta para montar a partida.
                            </p>

                            <Button
                                variant="primary"
                                leftIcon={<FiPlus />}
                                onClick={() => openSidebar()}
                                disabled={loadingCategories || !categories.length}
                            >
                                Criar pergunta
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {questions.map((question, index) => {
                                const difficulty = difficultyInfo[question.difficulty];

                                return (
                                    <article
                                        key={question.question_id}
                                        className="rounded-2xl border-2 p-4"
                                        style={{
                                            background: colors.card,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex min-w-0 gap-3">
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#1CB0F6]/10 font-black text-[#1CB0F6]">
                                                    {index + 1}
                                                </span>

                                                <div className="min-w-0">
                                                    <h3 className="font-black">{question.title}</h3>

                                                    <div className="mt-2 flex flex-wrap gap-2 text-xs font-bold">
                                                        <span style={{ color: difficulty.color }}>
                                                            {difficulty.label}
                                                        </span>

                                                        <span className="text-[#1CB0F6]">
                                                            {question.question_type === "TRUE_FALSE"
                                                                ? "Verdadeiro ou falso"
                                                                : "Múltipla escolha"}
                                                        </span>

                                                        <span style={{ color: colors.muted }}>
                                                            {question.category_title}
                                                        </span>

                                                        <span
                                                            className="flex items-center gap-1"
                                                            style={{ color: question.isPublic ? "#16A36A" : colors.muted }}
                                                        >
                                                            {question.isPublic ? <FiEye /> : <FiEyeOff />}
                                                            {question.isPublic ? "Pública" : "Privada"}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex shrink-0 gap-2">
                                                {/* Só mostra editar para o dono da pergunta. */}
                                                {canEditQuestion(question) && (
                                                    <Button
                                                        variant="secondary"
                                                        size="sm"
                                                        onClick={() => openSidebar(question)}
                                                        title="Editar pergunta"
                                                    >
                                                        <FiEdit2 />
                                                    </Button>
                                                )}

                                                <Button
                                                    variant="danger"
                                                    size="sm"
                                                    onClick={() => removeQuestion(question.question_id)}
                                                    title="Remover da sala"
                                                >
                                                    <FiTrash2 />
                                                </Button>
                                            </div>
                                        </div>

                                        <div className="mt-4 grid gap-2 sm:grid-cols-2">
                                            {question.alternatives.map((alternative, i) => (
                                                <div
                                                    key={alternative.alternative_id}
                                                    className="flex items-center gap-3 rounded-xl border-2 p-3"
                                                    style={{
                                                        background: alternative.is_correct
                                                            ? "rgba(22,163,106,.08)"
                                                            : colors.surface,
                                                        borderColor: alternative.is_correct
                                                            ? "#16A36A"
                                                            : colors.border,
                                                    }}
                                                >
                                                    <span className="font-black">
                                                        {String.fromCharCode(65 + i)}
                                                    </span>

                                                    <span className="flex-1 text-sm font-bold">
                                                        {alternative.text}
                                                    </span>

                                                    {alternative.is_correct && (
                                                        <FiCheckCircle color="#16A36A" />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>

                <footer
                    className="mt-8 flex flex-wrap items-center justify-between gap-3 rounded-2xl border-2 p-5"
                    style={{
                        background: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div>
                        <p className="font-black">{questions.length} pergunta(s)</p>
                        <p className="text-sm" style={{ color: colors.muted }}>
                            Perguntas vinculadas à sala.
                        </p>
                    </div>

                    <Button
                        variant="primary"
                        leftIcon={<FiPlay />}
                        disabled={!questions.length || starting}
                        isLoading={starting}
                        onClick={startRoom}
                    >
                        Iniciar partida
                    </Button>
                </footer>
            </div>


            {sidebar && (
                <div
                    className="fixed inset-0 z-50 flex justify-end"
                    onClick={closeSidebar}
                >
                    <div className="absolute inset-0 bg-black/50" />

                    <aside
                        onClick={event => event.stopPropagation()}
                        className="relative flex h-full w-full max-w-xl flex-col border-l-2 shadow-2xl"
                        style={{
                            background: colors.background,
                            borderColor: colors.border,
                        }}
                    >
                        <header
                            className="flex items-center justify-between border-b-2 p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <div>
                                <h2 className="text-2xl font-black">
                                    {editing ? "Editar pergunta" : "Criar pergunta"}
                                </h2>

                                <p className="text-sm" style={{ color: colors.muted }}>
                                    Configure o enunciado e as alternativas.
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={closeSidebar}
                                disabled={saving}
                            >
                                <FiX />
                            </Button>
                        </header>

                        <div className="flex-1 space-y-5 overflow-y-auto p-5">

                            <label className="block space-y-2">
                                <span className="text-sm font-black">Categoria</span>

                                <select
                                    value={form.category_id || ""}
                                    disabled={loadingCategories || !categories.length}
                                    onChange={event => changeCategory(Number(event.target.value))}
                                    style={fieldStyle}
                                >
                                    <option value="">Selecione uma categoria</option>

                                    {categories.map(category => (
                                        <option
                                            key={category.category_id}
                                            value={category.category_id}
                                        >
                                            {category.title}
                                        </option>
                                    ))}
                                </select>

                                {!loadingCategories && !categories.length && (
                                    <p className="text-xs text-red-500">
                                        Nenhuma categoria disponível.
                                    </p>
                                )}
                            </label>

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-black">
                                        Visibilidade da pergunta
                                    </label>

                                    <p className="text-xs" style={{ color: colors.muted }}>
                                        Escolha quem poderá utilizar esta pergunta na biblioteca.
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    {[true, false].map(isPublic => (
                                        <button
                                            key={String(isPublic)}
                                            type="button"
                                            onClick={() => updateForm({ isPublic })}
                                            className="rounded-xl border-2 p-4 text-left transition-all"
                                            style={{
                                                borderColor: form.isPublic === isPublic
                                                    ? colors.primary
                                                    : colors.border,
                                                background: form.isPublic === isPublic
                                                    ? `${colors.primary}12`
                                                    : colors.card,
                                            }}
                                        >
                                            <div className="mb-2 flex items-center justify-between">
                                                <span className="flex items-center gap-2 font-black">
                                                    {isPublic ? <FiEye /> : <FiEyeOff />}
                                                    {isPublic ? "Pública" : "Privada"}
                                                </span>

                                                {form.isPublic === isPublic && (
                                                    <FiCheckCircle color={colors.primary} />
                                                )}
                                            </div>

                                            <p className="text-xs" style={{ color: colors.muted }}>
                                                {isPublic
                                                    ? "Outros usuários poderão utilizar esta pergunta."
                                                    : "Somente você poderá utilizar esta pergunta."}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-2">
                                <span className="text-sm font-black">Tipo de pergunta</span>

                                <div className="grid grid-cols-2 gap-2">
                                    <Button
                                        variant={form.question_type === "MULTIPLE_CHOICE" ? "primary" : "secondary"}
                                        size="sm"
                                        fullWidth
                                        onClick={() => changeType("MULTIPLE_CHOICE")}
                                    >
                                        Múltipla escolha
                                    </Button>

                                    <Button
                                        variant={form.question_type === "TRUE_FALSE" ? "primary" : "secondary"}
                                        size="sm"
                                        fullWidth
                                        onClick={() => changeType("TRUE_FALSE")}
                                    >
                                        Verdadeiro ou falso
                                    </Button>
                                </div>
                            </div>

                            <label className="block space-y-2">
                                <span className="text-sm font-black">Enunciado</span>

                                <textarea
                                    rows={3}
                                    value={form.title}
                                    onChange={event => updateForm({ title: event.target.value })}
                                    placeholder="Digite sua pergunta..."
                                    style={{
                                        ...fieldStyle,
                                        minHeight: 110,
                                        resize: "vertical",
                                    }}
                                />
                            </label>

                            <label className="block space-y-2">
                                <span className="text-sm font-black">Dificuldade</span>

                                <select
                                    value={form.difficulty}
                                    onChange={event =>
                                        updateForm({
                                            difficulty: event.target.value as Difficulty,
                                        })
                                    }
                                    style={fieldStyle}
                                >
                                    <option value="EASY">Fácil</option>
                                    <option value="MEDIUM">Médio</option>
                                    <option value="HARD">Difícil</option>
                                </select>
                            </label>

                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-black">Alternativas</span>

                                    <p className="text-xs" style={{ color: colors.muted }}>
                                        Selecione o círculo para marcar a resposta correta.
                                    </p>
                                </div>

                                {form.alternatives.map((alternative, index) => (
                                    <div
                                        key={alternative.alternative_id}
                                        className="flex items-center gap-2 rounded-xl border-2 p-2"
                                        style={{
                                            borderColor: alternative.is_correct
                                                ? "#16A36A"
                                                : colors.border,
                                            background: alternative.is_correct
                                                ? "rgba(22,163,106,.08)"
                                                : colors.card,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => selectCorrect(alternative.alternative_id)}
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                            style={{
                                                background: alternative.is_correct
                                                    ? "#16A36A"
                                                    : colors.surface,
                                                color: alternative.is_correct
                                                    ? "#FFFFFF"
                                                    : colors.muted,
                                            }}
                                            title="Marcar como correta"
                                        >
                                            {alternative.is_correct ? <FiCheck /> : <FiCircle />}
                                        </button>

                                        <input
                                            value={alternative.text}
                                            disabled={form.question_type === "TRUE_FALSE"}
                                            onChange={event =>
                                                updateAlternative(alternative.alternative_id, {
                                                    text: event.target.value,
                                                })
                                            }
                                            placeholder={`Alternativa ${index + 1}`}
                                            style={{
                                                ...fieldStyle,
                                                minWidth: 0,
                                                minHeight: 42,
                                                padding: "8px 10px",
                                                border: "none",
                                                background: "transparent",
                                                flex: 1,
                                            }}
                                        />

                                        {form.question_type === "MULTIPLE_CHOICE" && (
                                            <Button
                                                variant="danger"
                                                size="sm"
                                                disabled={form.alternatives.length <= 2}
                                                onClick={() => removeAlternative(alternative.alternative_id)}
                                                title="Remover alternativa"
                                            >
                                                <FiTrash2 />
                                            </Button>
                                        )}
                                    </div>
                                ))}

                                {form.question_type === "MULTIPLE_CHOICE" && (
                                    <Button
                                        variant="secondary"
                                        fullWidth
                                        leftIcon={<FiPlus />}
                                        onClick={addAlternative}
                                        disabled={form.alternatives.length >= 4}
                                    >
                                        Adicionar alternativa
                                    </Button>
                                )}

                                <p className="text-xs" style={{ color: colors.muted }}>
                                    {form.alternatives.length} de{" "}
                                    {form.question_type === "TRUE_FALSE" ? 2 : 4} alternativas
                                </p>
                            </div>
                        </div>

                        <footer
                            className="flex gap-3 border-t-2 p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={closeSidebar}
                                disabled={saving}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                fullWidth
                                leftIcon={<FiCheck />}
                                onClick={saveQuestion}
                                disabled={!valid || saving || loadingCategories}
                                isLoading={saving}
                            >
                                Salvar pergunta
                            </Button>
                        </footer>
                    </aside>
                </div>
            )}
        </main>
    );
}
