
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import {
    FiBookOpen,
    FiSearch,
    FiPlus,
    FiLayers,
    FiArrowRight,
    FiFolder,
    FiX,
    FiTrash2,
} from "react-icons/fi";
import { BiLibrary } from "react-icons/bi";

import { useToast } from "../../../../contexts/ToastContext";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useAuth } from "../../../../contexts/hooks/useAuth";
import { AXIOS } from "../../../../service";
import Button from "../../../../shared/ui/Button";

interface LibraryCategory {
    category_id: number;
    title: string;
    _count?: {
        questions: number;
    };
}

interface Library {
    library_id: number;
    title: string;
    description: string | null;
    categories: LibraryCategory[];
    _count?: {
        categories: number;
    };
}

const BoardLibraryPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const { toast } = useToast();
    const { user } = useAuth();

    const isAdmin = user?.role_name === "admin";

    const [libraries, setLibraries] = useState<Library[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    const [isCreateOpen, setIsCreateOpen] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [creating, setCreating] = useState(false);

    const [deletingId, setDeletingId] = useState<number | null>(null);

    const findLibraries = async () => {
        try {
            setLoading(true);

            const { data } = await AXIOS.get("/library/findLibraries");

            if (data.type === "Success") {
                setLibraries(Array.isArray(data.data) ? data.data : []);
            } else {
                setLibraries([]);
                toast.error(data.message || "Erro ao carregar bibliotecas.");
            }
        } catch (error) {
            console.error("Erro ao buscar bibliotecas:", error);
            setLibraries([]);
            toast.error("Não foi possível carregar as bibliotecas.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        findLibraries();
    }, []);

    const filteredLibraries = useMemo(() => {
        const normalizedSearch = search.toLowerCase().trim();

        if (!normalizedSearch) return libraries;

        return libraries.filter((library) =>
            library.title.toLowerCase().includes(normalizedSearch)
        );
    }, [libraries, search]);

    const getCategoryCount = (library: Library) => {
        return library._count?.categories ?? library.categories?.length ?? 0;
    };

    const getQuestionCount = (library: Library) => {
        return (
            library.categories?.reduce(
                (total, category) =>
                    total + (category._count?.questions ?? 0),
                0
            ) ?? 0
        );
    };

    const totalCategories = libraries.reduce(
        (total, library) => total + getCategoryCount(library),
        0
    );

    const totalQuestions = libraries.reduce(
        (total, library) => total + getQuestionCount(library),
        0
    );

    const handleCreateLibrary = async () => {
        if (!isAdmin) return;

        if (!title.trim()) {
            toast.error("Informe o nome da biblioteca.");
            return;
        }

        try {
            setCreating(true);

            const { data } = await AXIOS.post("/library/create", {
                title: title.trim(),
                description: description.trim() || null,
            });

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao criar biblioteca.");
                return;
            }

            toast.success("Biblioteca criada com sucesso!");

            setTitle("");
            setDescription("");
            setIsCreateOpen(false);

            await findLibraries();
        } catch (error) {
            console.error("Erro ao criar biblioteca:", error);
            toast.error("Não foi possível criar a biblioteca.");
        } finally {
            setCreating(false);
        }
    };

    const handleDeleteLibrary = async (library: Library) => {
        if (!isAdmin || deletingId !== null) return;

        const confirmed = window.confirm(
            `Tem certeza que deseja excluir a biblioteca "${library.title}"?\n\nEssa ação não poderá ser desfeita.`
        );

        if (!confirmed) return;

        try {
            setDeletingId(library.library_id);

            const { data } = await AXIOS.delete(
                `/library/${library.library_id}/delete`
            );

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao excluir biblioteca.");
                return;
            }

            setLibraries((current) =>
                current.filter(
                    (item) => item.library_id !== library.library_id
                )
            );

            toast.success("Biblioteca excluída com sucesso!");
        } catch (error) {
            console.error("Erro ao excluir biblioteca:", error);
            toast.error("Não foi possível excluir a biblioteca.");
        } finally {
            setDeletingId(null);
        }
    };

    const openLibrary = (libraryId: number) => {
        navigate(`/dashboard/library/${libraryId}`);
    };

    return (
        <div className="min-h-screen space-y-8 pb-10">
            {/* Cabeçalho */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <BiLibrary size={24} style={{ color: colors.primary }} />

                        <span
                            className="text-sm font-bold uppercase tracking-wider"
                            style={{ color: colors.primary }}
                        >
                            Biblioteca de perguntas
                        </span>
                    </div>

                    <h1
                        className="text-2xl font-black sm:text-3xl"
                        style={{ color: colors.text }}
                    >
                        Explore as bibliotecas
                    </h1>

                    <p className="mt-2 text-sm" style={{ color: colors.muted }}>
                        Encontre perguntas e categorias para adicionar às suas salas.
                    </p>
                </div>

                {isAdmin && (
                    <Button
                        variant="primary"
                        leftIcon={<FiPlus />}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Nova biblioteca
                    </Button>
                )}
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                    {
                        label: "Bibliotecas",
                        value: libraries.length,
                        icon: <FiBookOpen size={24} />,
                        color: colors.primary,
                    },
                    {
                        label: "Categorias",
                        value: totalCategories,
                        icon: <FiFolder size={24} />,
                        color: colors.success,
                    },
                    {
                        label: "Perguntas",
                        value: totalQuestions,
                        icon: <FiLayers size={24} />,
                        color: colors.primary,
                    },
                ].map((item) => (
                    <div
                        key={item.label}
                        className="rounded-2xl border-2 p-5"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p
                                    className="text-sm font-semibold"
                                    style={{ color: colors.muted }}
                                >
                                    {item.label}
                                </p>

                                <h2
                                    className="mt-2 text-3xl font-black"
                                    style={{ color: colors.text }}
                                >
                                    {item.value}
                                </h2>
                            </div>

                            <div
                                className="rounded-xl p-3"
                                style={{
                                    backgroundColor: `${item.color}20`,
                                    color: item.color,
                                }}
                            >
                                {item.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pesquisa e listagem */}
            <div className="space-y-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2
                            className="text-xl font-black"
                            style={{ color: colors.text }}
                        >
                            Todas as bibliotecas
                        </h2>

                        <p className="mt-1 text-sm" style={{ color: colors.muted }}>
                            {filteredLibraries.length} biblioteca(s) encontrada(s)
                        </p>
                    </div>

                    <div className="relative w-full sm:max-w-xs">
                        <FiSearch
                            className="absolute left-3 top-1/2 -translate-y-1/2"
                            style={{ color: colors.muted }}
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Buscar biblioteca..."
                            className="w-full rounded-xl border-2 py-3 pl-10 pr-4 text-sm font-medium outline-none transition"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                color: colors.text,
                            }}
                        />
                    </div>
                </div>

                {loading ? (
                    <div
                        className="rounded-2xl border-2 p-10 text-center"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <p style={{ color: colors.muted }}>
                            Carregando bibliotecas...
                        </p>
                    </div>
                ) : filteredLibraries.length === 0 ? (
                    <div
                        className="rounded-2xl border-2 border-dashed p-10 text-center"
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiBookOpen size={30} />
                        </div>

                        <h3
                            className="text-lg font-black"
                            style={{ color: colors.text }}
                        >
                            {search
                                ? "Nenhuma biblioteca encontrada"
                                : "Nenhuma biblioteca cadastrada"}
                        </h3>

                        <p
                            className="mx-auto mt-2 max-w-md text-sm"
                            style={{ color: colors.muted }}
                        >
                            {search
                                ? "Tente pesquisar usando outro nome."
                                : "Ainda não existem bibliotecas disponíveis."}
                        </p>

                        {!search && isAdmin && (
                            <div className="mt-5">
                                <Button
                                    variant="primary"
                                    leftIcon={<FiPlus />}
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    Criar biblioteca
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {filteredLibraries.map((library) => {
                            const isDeleting =
                                deletingId === library.library_id;

                            return (
                                <div
                                    key={library.library_id}
                                    className="group flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition hover:-translate-y-1"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                        opacity: isDeleting ? 0.6 : 1,
                                    }}
                                    onClick={() => openLibrary(library.library_id)}
                                >
                                    <div className="mb-5 flex items-start justify-between">
                                        <div
                                            className="rounded-xl p-3"
                                            style={{
                                                backgroundColor: `${colors.primary}20`,
                                                color: colors.primary,
                                            }}
                                        >
                                            <FiBookOpen size={25} />
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <span
                                                className="rounded-lg px-3 py-1 text-xs font-bold"
                                                style={{
                                                    backgroundColor: `${colors.success}20`,
                                                    color: colors.success,
                                                }}
                                            >
                                                Disponível
                                            </span>

                                            {isAdmin && (
                                                <button
                                                    type="button"
                                                    disabled={deletingId !== null}
                                                    title="Excluir biblioteca"
                                                    aria-label={`Excluir biblioteca ${library.title}`}
                                                    onClick={(event) => {
                                                        event.stopPropagation();
                                                        handleDeleteLibrary(library);
                                                    }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-xl border-2 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                                                    style={{
                                                        borderColor: `${colors.danger}50`,
                                                        color: colors.danger,
                                                    }}
                                                >
                                                    {isDeleting ? (
                                                        <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                                                    ) : (
                                                        <FiTrash2 size={17} />
                                                    )}
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <h3
                                        className="text-lg font-black"
                                        style={{ color: colors.text }}
                                    >
                                        {library.title}
                                    </h3>

                                    <p
                                        className="mt-2 min-h-10 text-sm"
                                        style={{ color: colors.muted }}
                                    >
                                        {library.description ||
                                            "Explore as categorias e perguntas desta biblioteca."}
                                    </p>

                                    <div
                                        className="mt-5 flex flex-wrap items-center gap-4 border-t-2 pt-4"
                                        style={{ borderColor: colors.border }}
                                    >
                                        <div className="flex items-center gap-2">
                                            <FiFolder
                                                size={16}
                                                style={{ color: colors.muted }}
                                            />

                                            <span
                                                className="text-sm font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                {getCategoryCount(library)} categorias
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <FiLayers
                                                size={16}
                                                style={{ color: colors.muted }}
                                            />

                                            <span
                                                className="text-sm font-bold"
                                                style={{ color: colors.text }}
                                            >
                                                {getQuestionCount(library)} perguntas
                                            </span>
                                        </div>
                                    </div>

                                    <div
                                        className="mt-5 flex items-center justify-between text-sm font-bold"
                                        style={{ color: colors.primary }}
                                    >
                                        <span>Explorar biblioteca</span>

                                        <FiArrowRight
                                            className="transition-transform group-hover:translate-x-1"
                                            size={18}
                                        />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Drawer de criação */}
            {isCreateOpen && isAdmin && (
                <div className="fixed inset-0 z-50 flex justify-end">
                    <div
                        className="absolute inset-0 bg-black/50"
                        onClick={() => {
                            if (!creating) setIsCreateOpen(false);
                        }}
                    />

                    <div
                        className="relative flex h-full w-full max-w-md flex-col shadow-2xl"
                        style={{ backgroundColor: colors.background }}
                    >
                        <div
                            className="flex items-center justify-between border-b-2 p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <div>
                                <h2
                                    className="text-xl font-black"
                                    style={{ color: colors.text }}
                                >
                                    Nova biblioteca
                                </h2>

                                <p
                                    className="mt-1 text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Cadastre uma nova biblioteca de perguntas.
                                </p>
                            </div>

                            <Button
                                variant="secondary"
                                size="icon"
                                disabled={creating}
                                onClick={() => setIsCreateOpen(false)}
                                leftIcon={<FiX />}
                                aria-label="Fechar"
                            />
                        </div>

                        <div className="flex-1 space-y-5 overflow-y-auto p-5">
                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Nome da biblioteca
                                </label>

                                <input
                                    type="text"
                                    value={title}
                                    onChange={(event) =>
                                        setTitle(event.target.value)
                                    }
                                    placeholder="Ex: Conhecimentos gerais"
                                    maxLength={100}
                                    className="w-full rounded-xl border-2 p-3 text-sm outline-none"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    }}
                                />
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Descrição
                                    <span
                                        className="ml-2 font-normal"
                                        style={{ color: colors.muted }}
                                    >
                                        (opcional)
                                    </span>
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(event) =>
                                        setDescription(event.target.value)
                                    }
                                    placeholder="Descreva o conteúdo desta biblioteca..."
                                    rows={5}
                                    maxLength={500}
                                    className="w-full resize-none rounded-xl border-2 p-3 text-sm outline-none"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    }}
                                />

                                <p
                                    className="mt-1 text-right text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    {description.length}/500
                                </p>
                            </div>
                        </div>

                        <div
                            className="flex gap-3 border-t-2 p-5"
                            style={{ borderColor: colors.border }}
                        >
                            <Button
                                variant="secondary"
                                fullWidth
                                disabled={creating}
                                onClick={() => setIsCreateOpen(false)}
                            >
                                Cancelar
                            </Button>

                            <Button
                                variant="primary"
                                fullWidth
                                isLoading={creating}
                                disabled={!title.trim() || creating}
                                onClick={handleCreateLibrary}
                            >
                                Criar biblioteca
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardLibraryPage;
