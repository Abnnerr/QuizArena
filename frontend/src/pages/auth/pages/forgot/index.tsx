
import { Helmet } from "react-helmet-async";
import { BiMailSend } from "react-icons/bi";
import { BsArrowRight, BsShieldLock } from "react-icons/bs";

import { useForgot } from "../../hooks/useForgot";

import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import ForgotPasswordTopbar from "./components/ForgotPasswordTopbar";
import LoginPrompt from "./components/LoginPrompt";

import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import { useTheme } from "../../../../contexts/hooks/useTheme";

const ForgotPage: React.FC = () => {
    const {
        email,
        loading,
        setEmail,
        handleSubmit,
    } = useForgot();

    const { colors } = useTheme();

    return (
        <>
            <Helmet>
                <title>Recuperar Senha | QuizArena</title>
            </Helmet>

            <main
                data-cy="forgot-page"
                className="
                    w-full max-w-7xl mx-auto
                    flex flex-col gap-5
                    px-4 py-6
                "
                style={{ color: colors.text }}
            >
                <ForgotPasswordTopbar colors={colors} />

                <ForgotPasswordHeader colors={colors} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

                    <section
                        className="
                            rounded-2xl border-2 border-b-4
                            p-5 sm:p-6
                            flex flex-col gap-4
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div
                            className="
                                w-12 h-12 rounded-xl
                                flex items-center justify-center
                            "
                            style={{
                                backgroundColor: colors.surface,
                                color: colors.text,
                            }}
                        >
                            <BsShieldLock className="w-6 h-6" />
                        </div>

                        <div className="space-y-2">
                            <h2 className="text-lg font-bold">
                                Segurança da sua conta
                            </h2>

                            <p
                                className="text-sm leading-relaxed"
                                style={{ color: colors.muted }}
                            >
                                Não se preocupe! Você pode recuperar
                                o acesso à sua conta seguindo as
                                instruções enviadas para seu e-mail.
                            </p>
                        </div>
                    </section>
                    <section
                        className="
                            lg:col-span-2
                            rounded-2xl border-2 border-b-4
                            p-5 sm:p-8
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <form
                            onSubmit={handleSubmit}
                            data-cy="forgot-form"
                            className="flex flex-col gap-6"
                        >
                            <div className="space-y-2">
                                <h2 className="text-xl font-bold">
                                    Recuperar senha
                                </h2>

                                <p
                                    className="text-sm"
                                    style={{ color: colors.muted }}
                                >
                                    Informe o e-mail cadastrado na sua
                                    conta para receber as instruções.
                                </p>
                            </div>

                            <div data-cy="forgot-email">
                                <Input
                                    type="email"
                                    label="E-mail da Conta"
                                    required
                                    disabled={loading}
                                    value={email}
                                    onChange={(event) =>
                                        setEmail(event.target.value)
                                    }
                                    placeholder="seu@email.com"
                                    icon={
                                        <BiMailSend className="w-6 h-6" />
                                    }
                                    color={colors.surface}
                                    border={colors.border}
                                    className="py-4"
                                />
                            </div>

                            <div
                                data-cy="forgot-submit-container"
                                className="flex flex-col gap-4"
                            >
                                <Button
                                    type="submit"
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    isLoading={loading}
                                    disabled={!email.trim() || loading}
                                    rightIcon={
                                        !loading ? (
                                            <BsArrowRight className="w-5 h-5" />
                                        ) : undefined
                                    }
                                    className="
                                        h-13 rounded-xl
                                        text-sm tracking-wide
                                    "
                                >
                                    Enviar instruções
                                </Button>

                                <div className="text-center">
                                    <LoginPrompt muted={colors.muted} />
                                </div>
                            </div>
                        </form>
                    </section>
                </div>
            </main>
        </>
    );
};

export default ForgotPage;
