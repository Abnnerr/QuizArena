
import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import {
    FiArrowLeft,
    FiBookOpen,
    FiCheck,
    FiCheckCircle,
    FiCircle,
    FiEdit2,
    FiEye,
    FiEyeOff,
    FiHelpCircle,
    FiPlus,
    FiTrash2,
    FiX,
} from "react-icons/fi";

import { useTheme } from "../../../../../../contexts/ThemeContext";
import { useToast } from "../../../../../../contexts/ToastContext";
import { useAuth } from "../../../../../../contexts/hooks/useAuth";
import { AXIOS } from "../../../../../../service";
import Button from "../../../../../../shared/ui/Button";

/* TYPES */

interface Alternative {
    alternative_id?: number;
    text: string;
    is_correct: boolean;
}

interface AlternativeDTO {
    alternative_id?: number;
    alternative_text: string;
    is_correct: boolean;
}

interface Question {
    question_id: number;
    question_text: string;
    question_type: string;
    difficulty: string;
    active: boolean;
    isPublic?: boolean;
    is_public?: boolean;
    alternatives: AlternativeDTO[];
}

interface Category {
    category_id: number;
    title: string;
    questions: Question[];
}

interface Room {
    room_id: number;
    room_code: string;
    room_name: string;
}

interface ResponseDTO<T> {
    type: "Success" | "Error";
    message: string;
    data: T;
}

interface QuestionForm {
    question_text: string;
    question_type: string;
    difficulty: string;
    isPublic: boolean;
    alternatives: Alternative[];
}

/* CONSTANTS */

const emptyQuestion = (): QuestionForm => ({
    question_text: "",
    question_type: "MULTIPLE_CHOICE",
    difficulty: "MEDIUM",
    isPublic: false,
    alternatives: [
        { text: "", is_correct: true },
        { text: "", is_correct: false },
    ],
});

const difficultyLabels: Record<string, string> = {
    EASY: "Fácil",
    MEDIUM: "Médio",
    HARD: "Difícil",
};

const difficultyColors: Record<string, string> = {
    EASY: "#16A34A",
    MEDIUM: "#D97706",
    HARD: "#DC2626",
};

/* PAGE */

const BoardCategoryPage = () => {
    const navigate = useNavigate();
    const { libraryId, categoryId } = useParams();
    const [searchParams, setSearchParams] = useSearchParams();

    const { colors } = useTheme();
    const { toast } = useToast();
    const { user } = useAuth();

    const canManageQuestions =
        user?.role_name === "admin" || user?.role_name === "host";

    const onlyMine = searchParams.get("onlyMine") === "true";

    const [category, setCategory] = useState<Category | null>(null);
    const [loading, setLoading] = useState(true);

    // Drawer de pergunta
    const [sidebar, setSidebar] = useState(false);
    const [form, setForm] = useState<QuestionForm>(emptyQuestion);
    const [editingQuestionId, setEditingQuestionId] = useState<number | null>(null);
    const [saving, setSaving] = useState(false);
    const [deletingQuestionId, setDeletingQuestionId] = useState<number | null>(null);

    // Modal de salas
    const [isRoomModalOpen, setIsRoomModalOpen] = useState(false);
    const [rooms, setRooms] = useState<Room[]>([]);
    const [loadingRooms, setLoadingRooms] = useState(false);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
    const [addingQuestion, setAddingQuestion] = useState(false);

    const fieldStyle: CSSProperties = {
        width: "100%",
        minHeight: 48,
        padding: "12px 14px",
        borderRadius: 12,
        border: `2px solid ${colors.border}`,
        backgroundColor: colors.surface,
        color: colors.text,
        outline: "none",
        fontSize: 14,
        fontWeight: 600,
        boxSizing: "border-box",
    };

    /* CATEGORY */

    const findCategory = async () => {
        if (!categoryId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data } = await AXIOS.get<ResponseDTO<Category>>(
                `/category/${categoryId}/findCategoryId`,
                { params: onlyMine ? { onlyMine: true } : {} }
            );

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao carregar categoria.");
                setCategory(null);
                return;
            }

            setCategory({
                ...data.data,
                questions: data.data.questions ?? [],
            });
        } catch {
            toast.error("Erro ao carregar perguntas.");
            setCategory(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        void findCategory();
    }, [categoryId, onlyMine]);

    const handleFilterChange = (mine: boolean) => {
        setSearchParams(mine ? { onlyMine: "true" } : {});
    };

    /* QUESTION FORM */

    const updateForm = (changes: Partial<QuestionForm>) => {
        setForm(previous => ({ ...previous, ...changes }));
    };

    const changeType = (type: string) => {
        updateForm({
            question_type: type,
            alternatives: type === "TRUE_FALSE"
                ? [
                    { text: "Verdadeiro", is_correct: true },
                    { text: "Falso", is_correct: false },
                ]
                : [
                    { text: "", is_correct: true },
                    { text: "", is_correct: false },
                ],
        });
    };

    const updateAlternative = (
        index: number,
        changes: Partial<Alternative>
    ) => {
        setForm(previous => ({
            ...previous,
            alternatives: previous.alternatives.map((alternative, i) =>
                i === index ? { ...alternative, ...changes } : alternative
            ),
        }));
    };

    const selectCorrect = (index: number) => {
        setForm(previous => ({
            ...previous,
            alternatives: previous.alternatives.map((alternative, i) => ({
                ...alternative,
                is_correct: i === index,
            })),
        }));
    };

    const addAlternative = () => {
        if (form.alternatives.length >= 4) return;

        updateForm({
            alternatives: [
                ...form.alternatives,
                { text: "", is_correct: false },
            ],
        });
    };

    const removeAlternative = (index: number) => {
        if (form.alternatives.length <= 2) return;

        setForm(previous => {
            const alternatives = previous.alternatives.filter((_, i) => i !== index);

            if (!alternatives.some(item => item.is_correct)) {
                alternatives[0].is_correct = true;
            }

            return { ...previous, alternatives };
        });
    };

    const openCreate = () => {
        setEditingQuestionId(null);
        setForm(emptyQuestion());
        setSidebar(true);
    };

    const openEdit = (question: Question) => {
        setEditingQuestionId(question.question_id);

        setForm({
            question_text: question.question_text,
            question_type: question.question_type,
            difficulty: question.difficulty,
            isPublic: question.isPublic ?? question.is_public ?? false,
            alternatives: question.alternatives.map(item => ({
                alternative_id: item.alternative_id,
                text: item.alternative_text,
                is_correct: item.is_correct,
            })),
        });

        setSidebar(true);
    };

    const closeSidebar = () => {
        if (saving) return;

        setSidebar(false);
        setEditingQuestionId(null);
        setForm(emptyQuestion());
    };

    const valid =
        !!form.question_text.trim() &&
        form.alternatives.length >= 2 &&
        form.alternatives.length <= 4 &&
        form.alternatives.every(item => !!item.text.trim()) &&
        form.alternatives.filter(item => item.is_correct).length === 1;

    const handleSaveQuestion = async () => {
        if (!categoryId || saving) return;

        if (!valid) {
            toast.warning("Preencha todos os campos e selecione uma resposta correta.");
            return;
        }

        const payload = {
            question_text: form.question_text.trim(),
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

            const { data } = editingQuestionId
                ? await AXIOS.patch<ResponseDTO<Question>>(
                    `/question/${editingQuestionId}/update`,
                    {
                        ...payload,
                        category_id: Number(categoryId),
                    }
                )
                : await AXIOS.post<ResponseDTO<Question>>(
                    `/question/${categoryId}/create`,
                    payload
                );

            if (data.type !== "Success") {
                toast.error(data.message || "Não foi possível salvar a pergunta.");
                return;
            }

            toast.success(
                editingQuestionId
                    ? "Pergunta atualizada com sucesso!"
                    : "Pergunta criada com sucesso!"
            );

            setSidebar(false);
            setEditingQuestionId(null);
            setForm(emptyQuestion());

            await findCategory();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Erro ao salvar pergunta."
            );
        } finally {
            setSaving(false);
        }
    };

    /* DELETE QUESTION */

    const handleDeleteQuestion = async (question: Question) => {
        if (!window.confirm("Tem certeza que deseja excluir esta pergunta?")) return;

        try {
            setDeletingQuestionId(question.question_id);

            const { data } = await AXIOS.delete<ResponseDTO<null>>(
                `/question/${question.question_id}/delete`
            );

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao excluir pergunta.");
                return;
            }

            toast.success("Pergunta excluída com sucesso!");

            setCategory(previous => previous
                ? {
                    ...previous,
                    questions: previous.questions.filter(
                        item => item.question_id !== question.question_id
                    ),
                }
                : previous
            );
        } catch (error: any) {
            toast.error(error?.response?.data?.message || "Erro ao excluir pergunta.");
        } finally {
            setDeletingQuestionId(null);
        }
    };

    /* ROOMS */

    const findRooms = async () => {
        try {
            setLoadingRooms(true);

            const { data } = await AXIOS.get<ResponseDTO<Room[]>>("/room/findRooms");

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao buscar salas.");
                return;
            }

            setRooms(data.data ?? []);
        } catch {
            toast.error("Erro ao carregar salas.");
        } finally {
            setLoadingRooms(false);
        }
    };

    const openRoomModal = async (question: Question) => {
        setSelectedQuestion(question);
        setSelectedRoomId(null);
        setRooms([]);
        setIsRoomModalOpen(true);

        await findRooms();
    };

    const closeRoomModal = () => {
        if (addingQuestion) return;

        setIsRoomModalOpen(false);
        setSelectedQuestion(null);
        setSelectedRoomId(null);
    };

    const addQuestionToRoom = async () => {
        if (!selectedQuestion || !selectedRoomId || addingQuestion) {
            toast.warning("Selecione uma sala.");
            return;
        }

        try {
            setAddingQuestion(true);

            const { data } = await AXIOS.post<ResponseDTO<null>>(
                `/question/${selectedRoomId}/${selectedQuestion.question_id}/addToRoom`
            );

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao adicionar pergunta.");
                return;
            }

            toast.success("Pergunta adicionada à sala!");
            setIsRoomModalOpen(false);
            setSelectedQuestion(null);
            setSelectedRoomId(null);
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message || "Erro ao adicionar pergunta à sala."
            );
        } finally {
            setAddingQuestion(false);
        }
    };

    const goBack = () => navigate(`/dashboard/library/${libraryId}`);

    /* STATES */

    if (loading) {
        return (
            <div
                className="flex min-h-[400px] items-center justify-center font-bold"
                style={{ color: colors.muted }}
            >
                Carregando perguntas...
            </div>
        );
    }

    if (!category) {
        return (
            <div className="flex flex-col items-center justify-center gap-4 py-20">
                <FiHelpCircle size={42} style={{ color: colors.muted }} />

                <h2 className="text-xl font-bold" style={{ color: colors.text }}>
                    Categoria não encontrada
                </h2>

                <Button variant="secondary" onClick={goBack} leftIcon={<FiArrowLeft />}>
                    Voltar
                </Button>
            </div>
        );
    }

    const questions = category.questions ?? [];

    return (
        <div className="relative space-y-6 pb-10">

            {/* HEADER */}

            <div className="space-y-4">
                <button
                    type="button"
                    onClick={goBack}
                    className="flex w-fit items-center gap-2 text-sm font-semibold transition-opacity hover:opacity-70"
                    style={{ color: colors.muted }}
                >
                    <FiArrowLeft />
                    Voltar para categorias
                </button>

                <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                        <div
                            className="mb-2 flex items-center gap-2 text-sm font-semibold"
                            style={{ color: colors.primary }}
                        >
                            <FiBookOpen />
                            Biblioteca de perguntas
                        </div>

                        <h1
                            className="text-2xl font-extrabold md:text-3xl"
                            style={{ color: colors.text }}
                        >
                            {category.title}
                        </h1>

                        <p className="mt-1 text-sm" style={{ color: colors.muted }}>
                            {questions.length} pergunta(s){" "}
                            {onlyMine ? "criada(s) por você" : "cadastrada(s)"}
                        </p>
                    </div>

                    {canManageQuestions && (
                        <Button
                            variant="primary"
                            leftIcon={<FiPlus />}
                            onClick={openCreate}
                        >
                            Nova pergunta
                        </Button>
                    )}
                </div>

                {/* FILTER */}

                <div
                    className="flex w-fit flex-wrap gap-2 rounded-xl border-2 p-1.5"
                    style={{
                        background: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <Button
                        size="sm"
                        variant={!onlyMine ? "primary" : "secondary"}
                        onClick={() => handleFilterChange(false)}
                    >
                        Todas
                    </Button>

                    <Button
                        size="sm"
                        variant={onlyMine ? "primary" : "secondary"}
                        onClick={() => handleFilterChange(true)}
                    >
                        Minhas perguntas
                    </Button>
                </div>
            </div>

            {/* QUESTIONS */}

            {questions.length === 0 ? (
                <div
                    className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed px-5 py-16 text-center"
                    style={{ borderColor: colors.border }}
                >
                    <FiHelpCircle size={36} style={{ color: colors.muted }} />

                    <h3 className="mt-3 text-lg font-bold" style={{ color: colors.text }}>
                        {onlyMine
                            ? "Você ainda não criou perguntas nesta categoria"
                            : "Nenhuma pergunta cadastrada"}
                    </h3>

                    <p className="mt-2 text-sm" style={{ color: colors.muted }}>
                        {onlyMine
                            ? "Quando você criar perguntas, elas aparecerão aqui."
                            : "As perguntas desta categoria aparecerão aqui."}
                    </p>

                    {onlyMine && (
                        <Button
                            variant="secondary"
                            size="sm"
                            className="mt-4"
                            onClick={() => handleFilterChange(false)}
                        >
                            Ver todas as perguntas
                        </Button>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {questions.map((question, index) => {
                        const difficultyColor =
                            difficultyColors[question.difficulty] ?? colors.muted;

                        const isPublic =
                            question.isPublic ?? question.is_public ?? false;

                        return (
                            <article
                                key={question.question_id}
                                className="flex flex-col rounded-xl border-2 p-4"
                                style={{
                                    background: colors.card,
                                    borderColor: colors.border,
                                }}
                            >
                                {/* BADGES */}

                                <div className="flex flex-wrap items-center gap-2">
                                    <span
                                        className="rounded-md px-2 py-1 text-[11px] font-bold"
                                        style={{
                                            color: difficultyColor,
                                            background: `${difficultyColor}18`,
                                        }}
                                    >
                                        {difficultyLabels[question.difficulty] ?? question.difficulty}
                                    </span>

                                    <span
                                        className="flex items-center gap-1 rounded-md px-2 py-1 text-[11px] font-bold"
                                        style={{
                                            color: isPublic ? "#16A34A" : colors.muted,
                                            background: isPublic
                                                ? "#16A34A18"
                                                : `${colors.muted}15`,
                                        }}
                                    >
                                        {isPublic ? <FiEye size={12} /> : <FiEyeOff size={12} />}
                                        {isPublic ? "Pública" : "Privada"}
                                    </span>

                                    <span
                                        className="rounded-md px-2 py-1 text-[11px] font-bold"
                                        style={{
                                            color: colors.primary,
                                            background: `${colors.primary}18`,
                                        }}
                                    >
                                        {question.question_type === "MULTIPLE_CHOICE"
                                            ? "Múltipla escolha"
                                            : "Verdadeiro ou falso"}
                                    </span>
                                </div>

                                {/* QUESTION */}

                                <h3
                                    className="mt-4 text-sm font-bold leading-relaxed"
                                    style={{ color: colors.text }}
                                >
                                    {index + 1}. {question.question_text}
                                </h3>

                                {/* ALTERNATIVES */}

                                <div className="mt-4 flex-1 space-y-2">
                                    <p
                                        className="text-[10px] font-extrabold uppercase tracking-wider"
                                        style={{ color: colors.muted }}
                                    >
                                        Alternativas
                                    </p>

                                    {(question.alternatives ?? []).map((alternative, i) => (
                                        <div
                                            key={alternative.alternative_id ?? i}
                                            className="flex items-start gap-2 rounded-lg border px-3 py-2"
                                            style={{
                                                borderColor: alternative.is_correct
                                                    ? "#16A34A"
                                                    : colors.border,
                                                background: alternative.is_correct
                                                    ? "#16A34A10"
                                                    : colors.background,
                                            }}
                                        >
                                            <span
                                                className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-[10px] font-bold"
                                                style={{
                                                    background: alternative.is_correct
                                                        ? "#16A34A"
                                                        : colors.surface,
                                                    color: alternative.is_correct
                                                        ? "#FFFFFF"
                                                        : colors.muted,
                                                }}
                                            >
                                                {String.fromCharCode(65 + i)}
                                            </span>

                                            <span
                                                className="min-w-0 flex-1 break-words text-xs leading-relaxed"
                                                style={{ color: colors.text }}
                                            >
                                                {alternative.alternative_text}
                                            </span>

                                            {alternative.is_correct && (
                                                <FiCheck
                                                    size={15}
                                                    className="mt-0.5 shrink-0"
                                                    color="#16A34A"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>

                                {/* ACTIONS */}

                                <div
                                    className="mt-4 flex items-center gap-2 border-t pt-3"
                                    style={{ borderColor: colors.border }}
                                >
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        fullWidth
                                        leftIcon={<FiPlus />}
                                        onClick={() => openRoomModal(question)}
                                    >
                                        Adicionar à sala
                                    </Button>

                                    {onlyMine && canManageQuestions && (
                                        <>
                                            <Button
                                                variant="secondary"
                                                size="sm"
                                                onClick={() => openEdit(question)}
                                                title="Editar pergunta"
                                            >
                                                <FiEdit2 size={16} />
                                            </Button>

                                            <Button
                                                variant="danger"
                                                size="sm"
                                                disabled={deletingQuestionId === question.question_id}
                                                isLoading={deletingQuestionId === question.question_id}
                                                onClick={() => handleDeleteQuestion(question)}
                                                title="Excluir pergunta"
                                            >
                                                {!deletingQuestionId && <FiTrash2 size={16} />}
                                            </Button>
                                        </>
                                    )}
                                </div>
                            </article>
                        );
                    })}
                </div>
            )}

            {/* QUESTION DRAWER */}

            {sidebar && canManageQuestions && (
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
                                <h2 className="text-2xl font-black" style={{ color: colors.text }}>
                                    {editingQuestionId ? "Editar pergunta" : "Criar pergunta"}
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
                                <FiX size={18} />
                            </Button>
                        </header>

                        <div className="flex-1 space-y-5 overflow-y-auto p-5">

                            {/* CATEGORY */}

                            <div className="space-y-2">
                                <label className="text-sm font-black" style={{ color: colors.text }}>
                                    Categoria
                                </label>

                                <div
                                    className="flex min-h-12 items-center gap-2 rounded-xl border-2 px-4"
                                    style={{
                                        background: colors.surface,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    }}
                                >
                                    <FiBookOpen color={colors.primary} />
                                    <span className="text-sm font-bold">{category.title}</span>
                                </div>
                            </div>

                            {/* VISIBILITY */}

                            <div className="space-y-3">
                                <div>
                                    <label className="text-sm font-black" style={{ color: colors.text }}>
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
                                            className="rounded-xl border-2 p-4 text-left transition-colors"
                                            style={{
                                                borderColor: form.isPublic === isPublic
                                                    ? colors.primary
                                                    : colors.border,
                                                background: form.isPublic === isPublic
                                                    ? `${colors.primary}12`
                                                    : colors.card,
                                                color: colors.text,
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

                            {/* QUESTION TYPE */}

                            <div className="space-y-2">
                                <span className="text-sm font-black" style={{ color: colors.text }}>
                                    Tipo de pergunta
                                </span>

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

                            {/* QUESTION TEXT */}

                            <label className="block space-y-2">
                                <span className="text-sm font-black" style={{ color: colors.text }}>
                                    Enunciado
                                </span>

                                <textarea
                                    rows={3}
                                    value={form.question_text}
                                    onChange={event => updateForm({
                                        question_text: event.target.value,
                                    })}
                                    placeholder="Digite sua pergunta..."
                                    style={{
                                        ...fieldStyle,
                                        minHeight: 110,
                                        resize: "vertical",
                                    }}
                                />
                            </label>

                            {/* DIFFICULTY */}

                            <label className="block space-y-2">
                                <span className="text-sm font-black" style={{ color: colors.text }}>
                                    Dificuldade
                                </span>

                                <select
                                    value={form.difficulty}
                                    onChange={event => updateForm({
                                        difficulty: event.target.value,
                                    })}
                                    style={fieldStyle}
                                >
                                    <option value="EASY">Fácil</option>
                                    <option value="MEDIUM">Médio</option>
                                    <option value="HARD">Difícil</option>
                                </select>
                            </label>

                            {/* ALTERNATIVES */}

                            <div className="space-y-3">
                                <div>
                                    <span className="text-sm font-black" style={{ color: colors.text }}>
                                        Alternativas
                                    </span>

                                    <p className="text-xs" style={{ color: colors.muted }}>
                                        Selecione o círculo para marcar a resposta correta.
                                    </p>
                                </div>

                                {form.alternatives.map((alternative, index) => (
                                    <div
                                        key={alternative.alternative_id ?? index}
                                        className="flex items-center gap-2 rounded-xl border-2 p-2"
                                        style={{
                                            borderColor: alternative.is_correct
                                                ? "#16A34A"
                                                : colors.border,
                                            background: alternative.is_correct
                                                ? "#16A34A10"
                                                : colors.card,
                                        }}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => selectCorrect(index)}
                                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                            style={{
                                                background: alternative.is_correct
                                                    ? "#16A34A"
                                                    : colors.surface,
                                                color: alternative.is_correct
                                                    ? "#FFFFFF"
                                                    : colors.muted,
                                            }}
                                            title="Marcar como correta"
                                        >
                                            {alternative.is_correct
                                                ? <FiCheck />
                                                : <FiCircle />}
                                        </button>

                                        <input
                                            value={alternative.text}
                                            disabled={form.question_type === "TRUE_FALSE"}
                                            onChange={event => updateAlternative(index, {
                                                text: event.target.value,
                                            })}
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
                                                onClick={() => removeAlternative(index)}
                                                title="Remover alternativa"
                                            >
                                                <FiTrash2 size={15} />
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

                        {/* DRAWER FOOTER */}

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
                                onClick={handleSaveQuestion}
                                disabled={!valid || saving}
                                isLoading={saving}
                            >
                                Salvar pergunta
                            </Button>
                        </footer>
                    </aside>
                </div>
            )}

            {/* ROOM MODAL */}

            {isRoomModalOpen && (
                <div
                    className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 p-4"
                    onClick={closeRoomModal}
                >
                    <div
                        className="w-full max-w-lg overflow-hidden rounded-2xl border-2 shadow-2xl"
                        style={{
                            background: colors.card,
                            borderColor: colors.border,
                        }}
                        onClick={event => event.stopPropagation()}
                    >
                        <header
                            className="flex items-center justify-between border-b-2 p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <div>
                                <h2 className="text-lg font-extrabold" style={{ color: colors.text }}>
                                    Adicionar à sala
                                </h2>

                                <p className="mt-1 text-sm" style={{ color: colors.muted }}>
                                    Escolha a sala que receberá esta pergunta.
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={closeRoomModal}
                                disabled={addingQuestion}
                            >
                                <FiX size={18} />
                            </Button>
                        </header>

                        {selectedQuestion && (
                            <div
                                className="mx-5 mt-4 rounded-xl border p-3"
                                style={{
                                    background: colors.surface,
                                    borderColor: colors.border,
                                }}
                            >
                                <p
                                    className="mb-1 text-[10px] font-bold uppercase"
                                    style={{ color: colors.muted }}
                                >
                                    Pergunta selecionada
                                </p>

                                <p className="text-sm font-semibold" style={{ color: colors.text }}>
                                    {selectedQuestion.question_text}
                                </p>
                            </div>
                        )}

                        <div className="max-h-72 space-y-2 overflow-y-auto p-5">
                            {loadingRooms ? (
                                <p className="py-8 text-center text-sm" style={{ color: colors.muted }}>
                                    Carregando salas...
                                </p>
                            ) : rooms.length === 0 ? (
                                <p className="py-8 text-center text-sm" style={{ color: colors.muted }}>
                                    Nenhuma sala encontrada.
                                </p>
                            ) : (
                                rooms.map(room => {
                                    const selected = selectedRoomId === room.room_id;

                                    return (
                                        <button
                                            key={room.room_id}
                                            type="button"
                                            onClick={() => setSelectedRoomId(room.room_id)}
                                            className="flex w-full items-center justify-between rounded-xl border-2 p-3 text-left transition-colors"
                                            style={{
                                                background: selected
                                                    ? `${colors.primary}12`
                                                    : colors.background,
                                                borderColor: selected
                                                    ? colors.primary
                                                    : colors.border,
                                            }}
                                        >
                                            <div>
                                                <p className="font-bold" style={{ color: colors.text }}>
                                                    {room.room_name}
                                                </p>

                                                <p className="mt-1 text-xs" style={{ color: colors.muted }}>
                                                    Código: {room.room_code}
                                                </p>
                                            </div>

                                            {selected && <FiCheck color={colors.primary} />}
                                        </button>
                                    );
                                })
                            )}
                        </div>

                        <footer
                            className="flex gap-3 border-t-2 p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <Button
                                variant="secondary"
                                fullWidth
                                onClick={closeRoomModal}
                                disabled={addingQuestion}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                fullWidth
                                disabled={!selectedRoomId || addingQuestion || loadingRooms}
                                isLoading={addingQuestion}
                                leftIcon={<FiPlus />}
                                onClick={addQuestionToRoom}
                            >
                                Adicionar pergunta
                            </Button>
                        </footer>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardCategoryPage;
