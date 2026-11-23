
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    FiArrowLeft,
    FiBookOpen,
    FiHelpCircle,
    FiLayers,
    FiChevronRight,
} from "react-icons/fi";

import { useTheme } from "../../../../../../contexts/ThemeContext";
import { useToast } from "../../../../../../contexts/ToastContext";
import { AXIOS } from "../../../../../../service";
import Button from "../../../../../../shared/ui/Button";

interface Category {
    category_id: number;
    library_id: number;
    title: string;
    _count: {
        questions: number;
    };
}

const BoardCategoriesPage = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const { toast } = useToast();

    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    async function findCategories() {
        try {
            const { data } = await AXIOS.get("/category/findCategories");

            if (data.type !== "Success") {
                toast.error(data.message || "Erro ao carregar categorias.");
                return;
            }

            setCategories(data.data ?? []);
        } catch {
            toast.error("Não foi possível carregar suas categorias.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        void findCategories();
    }, []);

    function openCategory(category: Category) {
        navigate(
            `/dashboard/library/${category.library_id}/category/${category.category_id}?onlyMine=true`
        );
    }

    const totalQuestions = categories.reduce(
        (total, category) => total + (category._count?.questions ?? 0),
        0
    );

    if (loading) {
        return (
            <div
                className="flex min-h-[400px] items-center justify-center"
                style={{ color: colors.muted }}
            >
                <div className="flex flex-col items-center gap-3">
                    <div
                        className="h-9 w-9 animate-spin rounded-full border-4 border-t-transparent"
                        style={{
                            borderColor: colors.primary,
                            borderTopColor: "transparent",
                        }}
                    />
                    <span className="text-sm font-semibold">
                        Carregando suas categorias...
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 pb-10">

            {/* Cabeçalho */}
            <div>
                <button
                    onClick={() => navigate(-1)}
                    className="mb-4 flex items-center gap-2 text-sm font-semibold hover:opacity-70"
                    style={{ color: colors.muted }}
                >
                    <FiArrowLeft />
                    Voltar
                </button>

                <div
                    className="mb-2 flex items-center gap-2 text-sm font-semibold"
                    style={{ color: colors.primary }}
                >
                    <FiBookOpen />
                    Minha biblioteca
                </div>

                <h1
                    className="text-2xl font-extrabold md:text-3xl"
                    style={{ color: colors.text }}
                >
                    Minhas perguntas
                </h1>

                <p className="mt-1 text-sm" style={{ color: colors.muted }}>
                    Veja suas categorias e perguntas cadastradas.
                </p>
            </div>

            {/* Estatísticas */}
            <div className="grid grid-cols-2 gap-3">
                <div
                    className="flex items-center gap-3 rounded-xl border-2 p-4"
                    style={{
                        background: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <FiLayers size={22} style={{ color: colors.primary }} />

                    <div>
                        <p className="text-xs" style={{ color: colors.muted }}>
                            Categorias
                        </p>
                        <p className="text-xl font-extrabold">
                            {categories.length}
                        </p>
                    </div>
                </div>

                <div
                    className="flex items-center gap-3 rounded-xl border-2 p-4"
                    style={{
                        background: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <FiHelpCircle size={22} style={{ color: "#1CB0F6" }} />

                    <div>
                        <p className="text-xs" style={{ color: colors.muted }}>
                            Perguntas
                        </p>
                        <p className="text-xl font-extrabold">
                            {totalQuestions}
                        </p>
                    </div>
                </div>
            </div>

            {/* Categorias */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-bold">
                        Minhas categorias
                    </h2>

                    <span className="text-xs" style={{ color: colors.muted }}>
                        {categories.length} categoria(s)
                    </span>
                </div>

                {categories.length === 0 ? (
                    <div
                        className="rounded-2xl border-2 border-dashed px-5 py-14 text-center"
                        style={{ borderColor: colors.border }}
                    >
                        <FiBookOpen
                            size={38}
                            className="mx-auto"
                            style={{ color: colors.muted }}
                        />

                        <h3 className="mt-3 font-bold">
                            Você ainda não possui perguntas
                        </h3>

                        <p
                            className="mt-2 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Suas categorias aparecerão aqui quando você cadastrar perguntas.
                        </p>
                    </div>
                ) : (
                    <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                        {categories.map(category => (
                            <div
                                key={category.category_id}
                                className="rounded-xl border-2 p-4 transition hover:-translate-y-0.5"
                                style={{
                                    background: colors.card,
                                    borderColor: colors.border,
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                                        style={{
                                            background: `${colors.primary}18`,
                                            color: colors.primary,
                                        }}
                                    >
                                        <FiBookOpen size={20} />
                                    </div>

                                    <div className="min-w-0 flex-1">
                                        <h3 className="truncate font-bold">
                                            {category.title}
                                        </h3>

                                        <p
                                            className="text-xs"
                                            style={{ color: colors.muted }}
                                        >
                                            {category._count?.questions ?? 0} pergunta(s)
                                        </p>
                                    </div>
                                </div>

                                <Button
                                    variant="secondary"
                                    fullWidth
                                    rightIcon={<FiChevronRight />}
                                    className="mt-4"
                                    onClick={() => openCategory(category)}
                                >
                                    Ver minhas perguntas
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BoardCategoriesPage;
