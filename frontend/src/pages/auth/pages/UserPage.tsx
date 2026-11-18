
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
import {
    BiArrowBack,
    BiLock,
    BiUser,
    BiCopy,
    BiCheck,
    BiGroup,
} from "react-icons/bi";
import {
    BsEye,
    BsEyeSlash,
    BsShieldLock,
    BsKey,
} from "react-icons/bs";
import { useTheme } from "../../../contexts/ThemeContext";
import { Input } from "../../../shared/ui/Input";
import { useAuth } from "../../../contexts/hooks/useAuth";

interface Room {
    room_id: number;
    room_code: string;
    room_name: string;
    max_players: number;
    room_mode: "HARDCORE" | "NORMAL";
    room_status: "LOBBY" | "LIVE";
}

const UserPage = () => {
    const { colors } = useTheme();
    const { profile } = useAuth()
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [rooms, setRooms] = useState<Room[]>([])
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [copiedCode, setCopiedCode] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<{
        type: "Success" | "Warning" | "Error";
        message: string;
    } | null>(null);

    const [loading, setLoading] = useState(false);





    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const { data } = await profile();

                if (data?.type === "Success") {
                    setRooms(data.hostedRooms ?? []);
                } else {
                    setFeedback({
                        type: "Error",
                        message: data?.message || "Não foi possível carregar suas salas.",
                    });
                }
            } catch (error) {
                console.error("Erro ao buscar perfil:", error);

                setFeedback({
                    type: "Error",
                    message: "Erro ao carregar os dados da sua conta.",
                });
            }
        };

        fetchProfile();
    }, [profile]);

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setFeedback(null);

        if (!currentPassword || !newPassword || !confirmPassword) {
            setFeedback({
                type: "Warning",
                message: "Preencha todos os campos.",
            });
            return;
        }

        if (newPassword.length < 8) {
            setFeedback({
                type: "Warning",
                message: "A nova senha precisa ter pelo menos 8 caracteres.",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            setFeedback({
                type: "Warning",
                message: "As senhas não coincidem.",
            });
            return;
        }

        setLoading(true);

        // TODO: integrar com o endpoint de alteração de senha.

        setFeedback({
            type: "Warning",
            message: "A integração com a API de alteração de senha ainda não foi configurada.",
        });

        setLoading(false);
    };

    const handleCopyCode = async (code: string) => {
        try {
            await navigator.clipboard.writeText(code);
            setCopiedCode(code);

            window.setTimeout(() => {
                setCopiedCode((current) => current === code ? null : current);
            }, 2000);
        } catch {
            setFeedback({
                type: "Error",
                message: "Não foi possível copiar o código da sala.",
            });
        }
    };

    const statusConfig = {
        LOBBY: {
            label: "Aguardando",
            color: colors.primary,
        },
        LIVE: {
            label: "Em andamento",
            color: colors.success,
        },
        FINISHED: {
            label: "Finalizada",
            color: colors.muted,
        },
    };

    return (
        <>
            <Helmet>
                <title>QuizArena • Minha Conta</title>
            </Helmet>

            <div
                className="
                    w-full max-w-5xl mx-auto px-4
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    py-3 sm:py-4
                "
            >
                {/* TOPBAR */}
                <div className="w-full flex items-center justify-between mb-5">
                    <Link
                        to="/"
                        className="
                            inline-flex h-10 items-center gap-2
                            border-2 border-b-4 px-4 py-2
                            rounded-2xl text-xs sm:text-sm
                            font-black uppercase tracking-wider
                            transition-all cursor-pointer shadow-sm
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                            color: colors.muted,
                        }}
                    >
                        <BiArrowBack className="w-5 h-5" />
                        <span>Início</span>
                    </Link>

                    <div
                        className="
                            inline-flex items-center gap-2
                            font-black px-4 py-2 rounded-2xl
                            text-xs uppercase tracking-wider
                            border-b-4 shadow-sm
                        "
                        style={{
                            backgroundColor: colors.primary,
                            color: "#7A5B00",
                            borderColor: colors.border,
                        }}
                    >
                        <BiUser className="w-4 h-4" />
                        <span>Minha Conta</span>
                    </div>
                </div>

                {/* BANNER */}
                <div className="w-full flex flex-col sm:flex-row items-center gap-3 mb-6">
                    <div
                        className="
                            rounded-3xl border-2 border-b-8
                            shadow-lg flex-shrink-0
                            flex items-center justify-center
                            w-20 h-20 sm:w-24 sm:h-24 p-3
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <BsShieldLock
                            className="w-12 h-12"
                            style={{ color: colors.primary }}
                        />
                    </div>

                    <div
                        className="
                            relative w-full border-2 border-b-4
                            rounded-2xl text-center sm:text-left
                            shadow-lg p-4 sm:p-5
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <h2
                            className="font-black tracking-tight text-xl sm:text-2xl"
                            style={{ color: colors.text }}
                        >
                            Área do administrador
                        </h2>

                        <p
                            className="font-extrabold mt-1 text-xs sm:text-sm"
                            style={{ color: colors.muted }}
                        >
                            Gerencie a segurança da sua conta e visualize suas salas.
                        </p>
                    </div>
                </div>

                {/* ALTERAÇÃO DE SENHA */}
                <section className="w-full mb-7">
                    <div className="flex items-center gap-2 mb-3">
                        <BiLock
                            className="w-6 h-6"
                            style={{ color: colors.primary }}
                        />

                        <h2
                            className="font-black text-lg sm:text-xl uppercase tracking-wide"
                            style={{ color: colors.text }}
                        >
                            Segurança da Conta
                        </h2>
                    </div>

                    <form
                        onSubmit={handlePasswordSubmit}
                        className="w-full"
                    >
                        <div
                            className="
                                border-2 border-b-8 rounded-3xl
                                shadow-lg p-5 sm:p-6 space-y-4
                            "
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <BsKey
                                    className="w-5 h-5"
                                    style={{ color: colors.primary }}
                                />

                                <p
                                    className="font-black text-sm uppercase tracking-wider"
                                    style={{ color: colors.text }}
                                >
                                    Alterar senha
                                </p>
                            </div>

                            <Input
                                label="Senha Atual"
                                icon={<BiLock className="w-6 h-6" />}
                                type={showCurrentPassword ? "text" : "password"}
                                required
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="cursor-pointer"
                                        style={{ color: colors.muted }}
                                    >
                                        {showCurrentPassword
                                            ? <BsEyeSlash className="w-6 h-6" />
                                            : <BsEye className="w-6 h-6" />
                                        }
                                    </button>
                                }
                            />

                            <Input
                                label="Nova Senha"
                                icon={<BiLock className="w-6 h-6" />}
                                type={showNewPassword ? "text" : "password"}
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="cursor-pointer"
                                        style={{ color: colors.muted }}
                                    >
                                        {showNewPassword
                                            ? <BsEyeSlash className="w-6 h-6" />
                                            : <BsEye className="w-6 h-6" />
                                        }
                                    </button>
                                }
                            />

                            <Input
                                label="Confirmar Nova Senha"
                                icon={<BiLock className="w-6 h-6" />}
                                type={showConfirmPassword ? "text" : "password"}
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                rightElement={
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="cursor-pointer"
                                        style={{ color: colors.muted }}
                                    >
                                        {showConfirmPassword
                                            ? <BsEyeSlash className="w-6 h-6" />
                                            : <BsEye className="w-6 h-6" />
                                        }
                                    </button>
                                }
                            />

                            {/* FEEDBACK */}
                            <div className="min-h-[45px] flex items-center justify-center">
                                {feedback && (
                                    <div
                                        className="
                                            w-full p-3 rounded-2xl
                                            text-xs sm:text-sm font-black
                                            text-center border-2 border-b-4
                                        "
                                        style={{
                                            backgroundColor:
                                                feedback.type === "Success"
                                                    ? `${colors.success}20`
                                                    : feedback.type === "Warning"
                                                        ? `${colors.primary}20`
                                                        : `${colors.danger}20`,
                                            borderColor:
                                                feedback.type === "Success"
                                                    ? colors.success
                                                    : feedback.type === "Warning"
                                                        ? colors.primary
                                                        : colors.danger,
                                            color:
                                                feedback.type === "Success"
                                                    ? colors.success
                                                    : feedback.type === "Warning"
                                                        ? colors.primary
                                                        : colors.danger,
                                        }}
                                    >
                                        {feedback.message}
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={
                                !currentPassword ||
                                !newPassword ||
                                !confirmPassword ||
                                loading
                            }
                            className="
                                w-full h-14 mt-3 font-black px-4
                                rounded-2xl text-xs sm:text-sm
                                uppercase tracking-wider border-b-4
                                active:border-b-0 active:translate-y-1
                                transition-all shadow-md flex items-center
                                justify-center gap-2 cursor-pointer
                                disabled:cursor-not-allowed
                            "
                            style={{
                                backgroundColor:
                                    !currentPassword || !newPassword ||
                                        !confirmPassword || loading
                                        ? colors.surface
                                        : colors.success,
                                borderColor:
                                    !currentPassword || !newPassword ||
                                        !confirmPassword || loading
                                        ? colors.border
                                        : "#46A302",
                                color:
                                    !currentPassword || !newPassword ||
                                        !confirmPassword || loading
                                        ? colors.muted
                                        : "#FFFFFF",
                            }}
                        >
                            <BsShieldLock className="w-5 h-5" />
                            {loading ? "Salvando..." : "Alterar Senha"}
                        </button>
                    </form>
                </section>

                {/* MINHAS SALAS */}
                <section className="w-full">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                        <div>
                            <h2
                                className="font-black text-lg sm:text-xl uppercase tracking-wide"
                                style={{ color: colors.text }}
                            >
                                Minhas Salas
                            </h2>

                            <p
                                className="font-extrabold text-xs sm:text-sm mt-1"
                                style={{ color: colors.muted }}
                            >
                                Visualize as salas criadas pela sua conta.
                            </p>
                        </div>

                        <div
                            className="
                                inline-flex items-center gap-2
                                px-4 py-2 rounded-xl border-2 border-b-4
                                font-black text-xs uppercase tracking-wider
                                w-fit
                            "
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                                color: colors.muted,
                            }}
                        >
                            <BiGroup className="w-5 h-5" />
                            {rooms.length} {rooms.length === 1 ? "Sala" : "Salas"}
                        </div>
                    </div>

                    {rooms.length === 0 ? (
                        <div
                            className="
                                w-full border-2 border-b-8
                                rounded-3xl shadow-lg p-8
                                text-center
                            "
                            style={{
                                backgroundColor: colors.card,
                                borderColor: colors.border,
                            }}
                        >
                            <BiGroup
                                className="w-12 h-12 mx-auto mb-3"
                                style={{ color: colors.muted }}
                            />

                            <h3
                                className="font-black text-lg"
                                style={{ color: colors.text }}
                            >
                                Nenhuma sala encontrada
                            </h3>

                            <p
                                className="font-extrabold text-sm mt-1"
                                style={{ color: colors.muted }}
                            >
                                As salas criadas por você aparecerão aqui.
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {rooms.map((room) => {
                                const status = statusConfig[room.room_status];
                                const copied = copiedCode === room.room_code;

                                return (
                                    <article
                                        key={room.room_id}
                                        className="
                                            border-2 border-b-8
                                            rounded-3xl shadow-lg
                                            p-5 transition-transform
                                            hover:-translate-y-1
                                        "
                                        style={{
                                            backgroundColor: colors.card,
                                            borderColor: colors.border,
                                        }}
                                    >
                                        {/* TÍTULO E STATUS */}
                                        <div className="flex items-start justify-between gap-3 mb-5">
                                            <div className="min-w-0">
                                                <h3
                                                    className="font-black text-base sm:text-lg break-words"
                                                    style={{ color: colors.text }}
                                                >
                                                    {room.room_name}
                                                </h3>

                                                <p
                                                    className="font-extrabold text-xs mt-1"
                                                    style={{ color: colors.muted }}
                                                >
                                                    Sala #{room.room_id}
                                                </p>
                                            </div>

                                            <span
                                                className="
                                                    flex-shrink-0 px-3 py-1.5
                                                    rounded-xl border-2 border-b-4
                                                    text-[10px] sm:text-xs
                                                    font-black uppercase tracking-wider
                                                "
                                                style={{
                                                    backgroundColor: `${status.color}20`,
                                                    borderColor: status.color,
                                                    color: status.color,
                                                }}
                                            >
                                                {status.label}
                                            </span>
                                        </div>

                                        {/* CAPACIDADE */}
                                        <div
                                            className="
                                                flex items-center gap-3
                                                p-3 rounded-2xl border-2 mb-4
                                            "
                                            style={{
                                                backgroundColor: colors.surface,
                                                borderColor: colors.border,
                                            }}
                                        >
                                            <BiGroup
                                                className="w-7 h-7"
                                                style={{ color: colors.primary }}
                                            />

                                            <div>
                                                <p
                                                    className="font-black text-[10px] uppercase tracking-wider"
                                                    style={{ color: colors.muted }}
                                                >
                                                    Capacidade máxima
                                                </p>

                                                <p
                                                    className="font-black text-sm"
                                                    style={{ color: colors.text }}
                                                >
                                                    {room.max_players} jogadores
                                                </p>
                                            </div>
                                        </div>

                                        {/* CÓDIGO */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="min-w-0">
                                                <p
                                                    className="font-black text-[10px] uppercase tracking-wider mb-1"
                                                    style={{ color: colors.muted }}
                                                >
                                                    Código da sala
                                                </p>

                                                <p
                                                    className="font-black text-lg tracking-widest"
                                                    style={{ color: colors.text }}
                                                >
                                                    {room.room_code}
                                                </p>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => handleCopyCode(room.room_code)}
                                                className="
                                                    flex-shrink-0 inline-flex
                                                    items-center gap-2
                                                    border-2 border-b-4
                                                    px-3 py-2 rounded-xl
                                                    text-[10px] sm:text-xs
                                                    font-black uppercase
                                                    tracking-wider
                                                    active:border-b-2
                                                    active:translate-y-0.5
                                                    transition-all cursor-pointer
                                                "
                                                style={{
                                                    backgroundColor: copied
                                                        ? `${colors.success}20`
                                                        : colors.primary,
                                                    borderColor: copied
                                                        ? colors.success
                                                        : colors.border,
                                                    color: copied
                                                        ? colors.success
                                                        : "#7A5B00",
                                                }}
                                            >
                                                {copied
                                                    ? <BiCheck className="w-4 h-4" />
                                                    : <BiCopy className="w-4 h-4" />
                                                }

                                                {copied ? "Copiado" : "Copiar"}
                                            </button>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                </section>
            </div>
        </>
    );
};

export default UserPage;
