import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
    FiUser,
    FiMail,
    FiShield,
    FiCalendar,
    FiLogOut,
    FiCheckCircle,
    FiHash,
} from "react-icons/fi";

import { useAuth } from "../../../../../contexts/hooks/useAuth";
import { useTheme } from "../../../../../contexts/ThemeContext";
import { useToast } from "../../../../../contexts/ToastContext";

type UserData = {
    user_id?: string;
    id?: string;
    user_username?: string;
    username?: string;
    user_email?: string;
    email?: string;
    role_name?: string;
    role?: string;
    Role?: {
        role_name?: string;
    };
    created_at?: string;
};

export default function BoardUserPage() {
    const { user, profile, logOut } = useAuth();
    const { colors } = useTheme();
    const { toast } = useToast();
    const navigate = useNavigate();

    const [profileData, setProfileData] = useState<UserData | null>(
        user ?? null
    );
    const [loading, setLoading] = useState(true);
    const [loggingOut, setLoggingOut] = useState(false);

    useEffect(() => {
        async function loadProfile() {
            setLoading(true);

            try {
                const response = await profile();

                if (response.type === "Success" && response.data) {
                    setProfileData(response.data);
                } else {
                    toast.error(
                        response.message || "Não foi possível carregar seu perfil."
                    );
                }
            } catch {
                toast.error("Erro ao carregar as informações do perfil.");
            } finally {
                setLoading(false);
            }
        }

        loadProfile();
    }, [profile, toast]);

    async function handleLogout() {
        setLoggingOut(true);

        try {
            const response = await logOut();

            if (response.type === "Success") {
                toast.success("Sessão encerrada com sucesso!");
                navigate("/auth/login");
                return;
            }

            toast.error(response.message || "Não foi possível sair da conta.");
        } catch {
            toast.error("Erro ao encerrar sua sessão.");
        } finally {
            setLoggingOut(false);
        }
    }

    const currentUser = profileData ?? user ?? {};

    const username = currentUser.user_username ?? "Usuário";
    const email = currentUser.user_email ?? "E-mail não informado";
    const userId = currentUser.user_id ?? "Não informado";
    const role = currentUser.Role?.role_name ?? "Usuário";
    const createdAt = currentUser.created_at;

    const initials = String(username)
        .trim()
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((part: string) => part[0])
        .join("")
        .toUpperCase();

    const formattedDate = createdAt
        ? new Date(createdAt).toLocaleDateString("pt-BR")
        : "Não disponível";

    const infoCards = [
        {
            title: "Nome de usuário",
            value: username,
            icon: FiUser,
        },
        {
            title: "E-mail",
            value: email,
            icon: FiMail,
        },
        {
            title: "Tipo de conta",
            value: role,
            icon: FiShield,
        },
        {
            title: "Data de cadastro",
            value: formattedDate,
            icon: FiCalendar,
        },
    ];

    return (
        <main
            className="min-h-screen w-full px-4 py-5 sm:px-6 sm:py-8"
            style={{
                backgroundColor: colors.background,
                color: colors.text,
            }}
        >
            <div className="mx-auto max-w-7xl space-y-6">
                <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className="flex h-12 w-12 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiUser size={23} />
                        </div>

                        <div>
                            <h1 className="text-xl font-extrabold sm:text-2xl">
                                Meu perfil
                            </h1>

                            <p
                                className="text-sm"
                                style={{ color: colors.muted }}
                            >
                                Gerencie as informações da sua conta.
                            </p>
                        </div>
                    </div>
                </header>

                <section
                    className="overflow-hidden rounded-2xl border-2 border-b-[5px]"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div
                        className="h-28"
                        style={{
                            background: `linear-gradient(120deg, ${colors.primary}, #0092D6)`,
                        }}
                    />

                    <div className="px-5 pb-6">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                            <div
                                className="-mt-12 flex h-24 w-24 shrink-0 items-center justify-center rounded-2xl border-4 text-3xl font-extrabold shadow-sm"
                                style={{
                                    backgroundColor: colors.card,
                                    borderColor: colors.card,
                                    color: colors.primary,
                                }}
                            >
                                {initials || <FiUser />}
                            </div>

                            <div className="min-w-0 flex-1 pb-1">
                                {loading && !profileData ? (
                                    <div className="space-y-2">
                                        <div
                                            className="h-5 w-40 animate-pulse rounded-lg"
                                            style={{
                                                backgroundColor: colors.surface,
                                            }}
                                        />
                                        <div
                                            className="h-4 w-52 animate-pulse rounded-lg"
                                            style={{
                                                backgroundColor: colors.surface,
                                            }}
                                        />
                                    </div>
                                ) : (
                                    <>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <h2 className="break-all text-xl font-extrabold">
                                                {username}
                                            </h2>

                                            <FiCheckCircle
                                                size={18}
                                                style={{ color: colors.success }}
                                            />
                                        </div>

                                        <p
                                            className="mt-1 break-all text-sm"
                                            style={{ color: colors.muted }}
                                        >
                                            {email}
                                        </p>
                                    </>
                                )}
                            </div>

                            <span
                                className="mb-1 w-fit rounded-lg px-3 py-2 text-xs font-extrabold uppercase"
                                style={{
                                    color: colors.primary,
                                    backgroundColor: `${colors.primary}20`,
                                }}
                            >
                                {role}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="space-y-4">
                    <div>
                        <h2 className="text-lg font-extrabold">
                            Informações da conta
                        </h2>

                        <p
                            className="text-sm"
                            style={{ color: colors.muted }}
                        >
                            Confira os dados cadastrados na sua conta.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {infoCards.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.title}
                                    className="rounded-2xl border-2 border-b-[5px] p-5"
                                    style={{
                                        backgroundColor: colors.card,
                                        borderColor: colors.border,
                                    }}
                                >
                                    <div className="mb-4 flex items-center gap-3">
                                        <div
                                            className="flex h-11 w-11 items-center justify-center rounded-xl"
                                            style={{
                                                backgroundColor: `${colors.primary}20`,
                                                color: colors.primary,
                                            }}
                                        >
                                            <Icon size={21} />
                                        </div>

                                        <span
                                            className="text-sm font-bold"
                                            style={{ color: colors.muted }}
                                        >
                                            {item.title}
                                        </span>
                                    </div>

                                    <p className="break-all text-base font-extrabold">
                                        {loading && !profileData
                                            ? "Carregando..."
                                            : item.value}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </section>

                <section
                    className="rounded-2xl border-2 border-b-[5px] p-5"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div className="mb-4 flex items-center gap-3">
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiHash size={21} />
                        </div>

                        <div>
                            <h2 className="font-extrabold">
                                Identificação da conta
                            </h2>

                            <p
                                className="text-xs"
                                style={{ color: colors.muted }}
                            >
                                Identificador interno do usuário.
                            </p>
                        </div>
                    </div>

                    <div
                        className="break-all rounded-xl p-3 font-mono text-sm"
                        style={{
                            backgroundColor: colors.surface,
                            color: colors.muted,
                        }}
                    >
                        {userId}
                    </div>
                </section>

                <section
                    className="flex flex-col gap-4 rounded-2xl border-2 border-b-[5px] p-5 sm:flex-row sm:items-center sm:justify-between"
                    style={{
                        backgroundColor: colors.card,
                        borderColor: colors.border,
                    }}
                >
                    <div>
                        <div className="flex items-center gap-2">
                            <FiLogOut
                                size={19}
                                style={{ color: colors.danger }}
                            />

                            <h2 className="font-extrabold">
                                Encerrar sessão
                            </h2>
                        </div>

                        <p
                            className="mt-1 text-sm"
                            style={{ color: colors.muted }}
                        >
                            Saia da sua conta neste dispositivo.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleLogout}
                        disabled={loggingOut}
                        className="flex items-center justify-center gap-2 rounded-xl border-b-4 px-5 py-3 text-sm font-extrabold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
                        style={{
                            backgroundColor: colors.danger,
                            borderColor: `${colors.danger}99`,
                        }}
                    >
                        <FiLogOut size={17} />
                        {loggingOut ? "Saindo..." : "Sair da conta"}
                    </button>
                </section>
            </div>
        </main>
    );
}