
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import {
    FiBookOpen,
    FiSearch,
    FiPlus,
    FiLayers,
    FiArrowRight,
    FiFolder,
    FiX,
    FiArrowLeft,
} from "react-icons/fi";

import { useAuth } from "../../../../../../contexts/hooks/useAuth";
import { useToast } from "../../../../../../contexts/hooks/useToast";
import { useTheme } from "../../../../../../contexts/hooks/useTheme";
import { AXIOS } from "../../../../../../service";
import Button from "../../../../../../shared/ui/Button";

interface Category {
    category_id: number;
    title: string;
    _count?: {
        questions: number;
    };
}

interface Library {
    library_id: number;
    title: string;
    description?: string | null;
    categories: Category[];
}

interface ResponseDTO<T> {
    type: "Success" | "Error";
    message: string;
    data: T;
}

const BoardLibraryDetailsPage = () => {
    const navigate = useNavigate();
    const { libraryId } = useParams();

    const { colors } = useTheme();
    const { toast } = useToast();
    const { user } = useAuth();

    const isAdmin = user?.role_name === "admin";

    const [library, setLibrary] = useState<Library | null>(null);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");

    const [isCreateOpen, setIsCreateOpen] = useState(false);
    const [categoryTitle, setCategoryTitle] = useState("");
    const [creating, setCreating] = useState(false);

    const findLibrary = async () => {
        if (!libraryId) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);

            const { data } = await AXIOS.get<ResponseDTO<Library>>(
                `/library/${libraryId}/findLibraryId`
            );

            if (data.type !== "Success" || !data.data) {
                setLibrary(null);
                toast.error(data.message || "Erro ao carregar biblioteca.");
                return;
            }

            setLibrary(data.data);
        } catch (error: any) {
            setLibrary(null);

            toast.error(
                error?.response?.data?.message ??
                "Não foi possível carregar a biblioteca."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        findLibrary();
    }, [libraryId]);

    const categories = (library?.categories ?? []).filter((category) =>
        category.title.toLowerCase().includes(search.toLowerCase().trim())
    );

    const totalCategories = library?.categories.length ?? 0;

    const totalQuestions = (library?.categories ?? []).reduce(
        (total, category) => total + (category._count?.questions ?? 0),
        0
    );

    const handleCreateCategory = async () => {
        const title = categoryTitle.trim();

        if (!title || !libraryId || !isAdmin) return;

        try {
            setCreating(true);

            const { data } = await AXIOS.post<ResponseDTO<Category>>(
                `/category/${libraryId}/create`,
                { name: title }
            );

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao criar categoria.");
                return;
            }

            toast.success("Categoria criada com sucesso!");

            setCategoryTitle("");
            setIsCreateOpen(false);

            await findLibrary();
        } catch (error: any) {
            toast.error(
                error?.response?.data?.message ??
                "Erro ao criar categoria."
            );
        } finally {
            setCreating(false);
        }
    };

    const openCategory = (categoryId: number) => {
        navigate(`/dashboard/library/${libraryId}/category/${categoryId}`);
    };

    const goBack = () => {
        navigate("/dashboard/library");
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <p
                    className="text-sm font-semibold"
                    style={{ color: colors.muted }}
                >
                    Carregando biblioteca...
                </p>
            </div>
        );
    }

    if (!library) {
        return (
            <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
                <FiBookOpen size={40} style={{ color: colors.muted }} />

                <h2
                    className="text-xl font-black"
                    style={{ color: colors.text }}
                >
                    Biblioteca não encontrada
                </h2>

                <Button
                    variant="primary"
                    leftIcon={<FiArrowLeft />}
                    onClick={goBack}
                >
                    Voltar para bibliotecas
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen space-y-8 pb-10">
            <button
                type="button"
                onClick={goBack}
                className="flex items-center gap-2 text-sm font-bold transition hover:opacity-70"
                style={{ color: colors.muted }}
            >
                <FiArrowLeft size={18} />
                Todas as bibliotecas
            </button>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <FiBookOpen
                            size={23}
                            style={{ color: colors.primary }}
                        />

                        <span
                            className="text-sm font-bold uppercase tracking-wider"
                            style={{ color: colors.primary }}
                        >
                            Biblioteca
                        </span>
                    </div>

                    <h1
                        className="text-2xl font-black sm:text-3xl"
                        style={{ color: colors.text }}
                    >
                        {library.title}
                    </h1>

                    <p
                        className="mt-2 max-w-2xl text-sm"
                        style={{ color: colors.muted }}
                    >
                        {library.description ||
                            "Explore as categorias e encontre perguntas para suas salas."}
                    </p>
                </div>

                {isAdmin && (
                    <Button
                        variant="primary"
                        leftIcon={<FiPlus />}
                        onClick={() => setIsCreateOpen(true)}
                    >
                        Nova categoria
                    </Button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div
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
                                Categorias
                            </p>

                            <h2
                                className="mt-2 text-3xl font-black"
                                style={{ color: colors.text }}
                            >
                                {totalCategories}
                            </h2>
                        </div>

                        <div
                            className="rounded-xl p-3"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiFolder size={24} />
                        </div>
                    </div>
                </div>

                <div
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
                                Perguntas públicas
                            </p>

                            <h2
                                className="mt-2 text-3xl font-black"
                                style={{ color: colors.text }}
                            >
                                {totalQuestions}
                            </h2>
                        </div>

                        <div
                            className="rounded-xl p-3"
                            style={{
                                backgroundColor: `${colors.success}20`,
                                color: colors.success,
                            }}
                        >
                            <FiLayers size={24} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2
                            className="text-xl font-black"
                            style={{ color: colors.text }}
                        >
                            Categorias
                        </h2>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Selecione uma categoria para visualizar suas perguntas.
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
                            placeholder="Buscar categoria..."
                            className="w-full rounded-xl border-2 py-3 pl-10 pr-4 text-sm font-medium outline-none"
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                color: colors.text,
                            }}
                        />
                    </div>
                </div>

                {categories.length === 0 ? (
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
                            <FiFolder size={30} />
                        </div>

                        <h3
                            className="text-lg font-black"
                            style={{ color: colors.text }}
                        >
                            {search
                                ? "Nenhuma categoria encontrada"
                                : "Nenhuma categoria cadastrada"}
                        </h3>

                        <p
                            className="mx-auto mt-2 max-w-md text-sm"
                            style={{ color: colors.muted }}
                        >
                            {search
                                ? "Tente pesquisar usando outro nome."
                                : "Esta biblioteca ainda não possui categorias."}
                        </p>

                        {!search && isAdmin && (
                            <div className="mt-5">
                                <Button
                                    variant="primary"
                                    leftIcon={<FiPlus />}
                                    onClick={() => setIsCreateOpen(true)}
                                >
                                    Criar primeira categoria
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {categories.map((category) => (
                            <div
                                key={category.category_id}
                                role="button"
                                tabIndex={0}
                                onClick={() => openCategory(category.category_id)}
                                onKeyDown={(event) => {
                                    if (event.key === "Enter" || event.key === " ") {
                                        event.preventDefault();
                                        openCategory(category.category_id);
                                    }
                                }}
                                className="group flex cursor-pointer flex-col rounded-2xl border-2 p-5 transition hover:-translate-y-1"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                }}
                            >
                                <div className="mb-5 flex items-start justify-between">
                                    <div
                                        className="rounded-xl p-3"
                                        style={{
                                            backgroundColor: `${colors.primary}20`,
                                            color: colors.primary,
                                        }}
                                    >
                                        <FiFolder size={25} />
                                    </div>

                                    <FiArrowRight
                                        size={20}
                                        className="transition-transform group-hover:translate-x-1"
                                        style={{ color: colors.primary }}
                                    />
                                </div>

                                <h3
                                    className="text-lg font-black"
                                    style={{ color: colors.text }}
                                >
                                    {category.title}
                                </h3>

                                <p
                                    className="mt-2 text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Confira as perguntas desta categoria.
                                </p>

                                <div
                                    className="mt-5 flex items-center gap-2 border-t-2 pt-4"
                                    style={{ borderColor: colors.border }}
                                >
                                    <FiLayers
                                        size={16}
                                        style={{ color: colors.muted }}
                                    />

                                    <span
                                        className="text-sm font-bold"
                                        style={{ color: colors.text }}
                                    >
                                        {category._count?.questions ?? 0} perguntas públicas
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

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
                                    Nova categoria
                                </h2>

                                <p
                                    className="mt-1 text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Adicione uma categoria à biblioteca.
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
                            <div
                                className="rounded-xl border-2 p-4"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.border,
                                }}
                            >
                                <p
                                    className="text-xs font-bold uppercase"
                                    style={{ color: colors.muted }}
                                >
                                    Biblioteca selecionada
                                </p>

                                <div className="mt-2 flex items-center gap-2">
                                    <FiBookOpen style={{ color: colors.primary }} />

                                    <span
                                        className="font-bold"
                                        style={{ color: colors.text }}
                                    >
                                        {library.title}
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label
                                    className="mb-2 block text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Nome da categoria
                                </label>

                                <input
                                    type="text"
                                    value={categoryTitle}
                                    onChange={(event) => setCategoryTitle(event.target.value)}
                                    onKeyDown={(event) => {
                                        if (event.key === "Enter") {
                                            handleCreateCategory();
                                        }
                                    }}
                                    placeholder="Ex: História"
                                    maxLength={100}
                                    autoFocus
                                    className="w-full rounded-xl border-2 p-3 text-sm outline-none"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                        color: colors.text,
                                    }}
                                />

                                <p
                                    className="mt-2 text-right text-xs"
                                    style={{ color: colors.muted }}
                                >
                                    {categoryTitle.length}/100
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
                                disabled={!categoryTitle.trim() || creating}
                                onClick={handleCreateCategory}
                            >
                                Criar categoria
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardLibraryDetailsPage;
