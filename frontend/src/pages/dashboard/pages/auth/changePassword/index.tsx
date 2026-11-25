
import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router";
import {
    FiArrowLeft,
    FiCheck,
    FiEye,
    FiEyeOff,
    FiKey,
    FiLock,
    FiShield,
} from "react-icons/fi";


import Input from "../../../../../shared/ui/Input";
import Button from "../../../../../shared/ui/Button";
import { AXIOS } from "../../../../../service";
import { useTheme } from "../../../../../contexts/hooks/useTheme";
import { useToast } from "../../../../../contexts/hooks/useToast";

const ChangePassword = () => {
    const navigate = useNavigate();
    const { colors } = useTheme();
    const { toast } = useToast();

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const [loading, setLoading] = useState(false);

    const cardStyle = {
        backgroundColor: colors.card,
        borderColor: colors.border,
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            toast.warning("Preencha todos os campos.");
            return;
        }

        if (newPassword.length < 8) {
            toast.warning("A nova senha deve ter pelo menos 8 caracteres.");
            return;
        }

        if (currentPassword === newPassword) {
            toast.warning("A nova senha deve ser diferente da atual.");
            return;
        }

        if (newPassword !== confirmPassword) {
            toast.warning("As senhas não coincidem.");
            return;
        }

        try {
            setLoading(true);

            const { data } = await AXIOS.patch("/auth/updatePassword", {
                currentPassword,
                newPassword,
            });

            if (data.type === "Success") {
                toast.success(
                    data.message || "Senha atualizada com sucesso!"
                );

                setCurrentPassword("");
                setNewPassword("");
                setConfirmPassword("");
            } else {
                toast.warning(
                    data.message || "Não foi possível atualizar sua senha."
                );
            }
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Não foi possível atualizar sua senha."
            );
        } finally {
            setLoading(false);
        }
    };

    const passwordFields = [
        {
            label: "Senha atual",
            value: currentPassword,
            onChange: setCurrentPassword,
            visible: showCurrent,
            toggle: () => setShowCurrent(!showCurrent),
            placeholder: "Digite sua senha atual",
        },
        {
            label: "Nova senha",
            value: newPassword,
            onChange: setNewPassword,
            visible: showNew,
            toggle: () => setShowNew(!showNew),
            placeholder: "Digite sua nova senha",
        },
        {
            label: "Confirmar nova senha",
            value: confirmPassword,
            onChange: setConfirmPassword,
            visible: showConfirm,
            toggle: () => setShowConfirm(!showConfirm),
            placeholder: "Digite novamente sua nova senha",
        },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena | Alterar senha</title>
                <meta
                    name="description"
                    content="Altere a senha da sua conta QuizArena."
                />
            </Helmet>

            <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8">
                <section
                    className="flex items-center gap-4 rounded-2xl border-2 p-5 sm:p-6"
                    style={cardStyle}
                >
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-opacity hover:opacity-70"
                        style={{
                            backgroundColor: `${colors.primary}15`,
                            color: colors.primary,
                        }}
                        aria-label="Voltar"
                    >
                        <FiArrowLeft size={20} />
                    </button>

                    <div
                        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                        style={{
                            backgroundColor: `${colors.primary}20`,
                            color: colors.primary,
                        }}
                    >
                        <FiShield size={24} />
                    </div>

                    <div>
                        <h1
                            className="text-xl font-black sm:text-2xl"
                            style={{ color: colors.text }}
                        >
                            Alterar senha
                        </h1>

                        <p
                            className="mt-1 text-xs sm:text-sm"
                            style={{ color: colors.muted }}
                        >
                            Atualize sua senha para proteger sua conta.
                        </p>
                    </div>
                </section>
                <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-5 rounded-2xl border-2 p-5 sm:p-6 lg:col-span-2"
                        style={cardStyle}
                    >
                        <div>
                            <h2
                                className="text-lg font-black"
                                style={{ color: colors.text }}
                            >
                                Credenciais de acesso
                            </h2>

                            <p
                                className="mt-1 text-sm"
                                style={{ color: colors.muted }}
                            >
                                Informe sua senha atual e escolha uma nova.
                            </p>
                        </div>

                        {passwordFields.map((field, index) => (
                            <div key={field.label} className="flex flex-col gap-2">
                                <label
                                    className="text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    {field.label}
                                </label>

                                <div className="relative">
                                    <Input
                                        type={field.visible ? "text" : "password"}
                                        value={field.value}
                                        onChange={(event) =>
                                            field.onChange(event.target.value)
                                        }
                                        placeholder={field.placeholder}
                                        required
                                        icon={
                                            index === 0
                                                ? <FiLock />
                                                : <FiKey />
                                        }
                                        className="h-12 pr-12"
                                    />

                                    <button
                                        type="button"
                                        onClick={field.toggle}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 transition-opacity hover:opacity-70"
                                        style={{ color: colors.muted }}
                                        aria-label={
                                            field.visible
                                                ? "Ocultar senha"
                                                : "Mostrar senha"
                                        }
                                    >
                                        {field.visible
                                            ? <FiEyeOff size={18} />
                                            : <FiEye size={18} />}
                                    </button>
                                </div>
                            </div>
                        ))}

                        <div
                            className="rounded-xl p-4"
                            style={{
                                backgroundColor: `${colors.primary}08`,
                                border: `1px solid ${colors.primary}25`,
                            }}
                        >
                            <div className="flex items-center gap-2">
                                <FiShield
                                    size={17}
                                    style={{ color: colors.primary }}
                                />

                                <span
                                    className="text-sm font-bold"
                                    style={{ color: colors.text }}
                                >
                                    Requisitos da senha
                                </span>
                            </div>

                            <ul
                                className="mt-3 flex flex-col gap-2 text-xs"
                                style={{ color: colors.muted }}
                            >
                                <li className="flex items-center gap-2">
                                    <FiCheck size={14} />
                                    Pelo menos 8 caracteres
                                </li>
                                <li className="flex items-center gap-2">
                                    <FiCheck size={14} />
                                    Diferente da senha atual
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => navigate(-1)}
                                disabled={loading}
                            >
                                Cancelar
                            </Button>

                            <Button
                                type="submit"
                                variant="primary"
                                isLoading={loading}
                                leftIcon={<FiLock />}
                            >
                                Atualizar senha
                            </Button>
                        </div>
                    </form>

                    <aside
                        className="flex h-fit flex-col gap-4 rounded-2xl border-2 p-5 sm:p-6"
                        style={cardStyle}
                    >
                        <div
                            className="flex h-11 w-11 items-center justify-center rounded-xl"
                            style={{
                                backgroundColor: `${colors.primary}20`,
                                color: colors.primary,
                            }}
                        >
                            <FiShield size={22} />
                        </div>

                        <div>
                            <h3
                                className="font-black"
                                style={{ color: colors.text }}
                            >
                                Proteja sua conta
                            </h3>

                            <p
                                className="mt-2 text-sm leading-relaxed"
                                style={{ color: colors.muted }}
                            >
                                Uma senha forte ajuda a impedir que outras
                                pessoas acessem sua conta sem autorização.
                            </p>
                        </div>

                        <div
                            className="rounded-xl p-4"
                            style={{
                                backgroundColor: colors.background,
                            }}
                        >
                            <p
                                className="text-xs font-bold"
                                style={{ color: colors.text }}
                            >
                                Dica
                            </p>

                            <p
                                className="mt-1 text-xs leading-relaxed"
                                style={{ color: colors.muted }}
                            >
                                Evite usar informações pessoais ou senhas
                                utilizadas em outros serviços.
                            </p>
                        </div>
                    </aside>
                </section>
            </main>
        </>
    );
};

export default ChangePassword;
