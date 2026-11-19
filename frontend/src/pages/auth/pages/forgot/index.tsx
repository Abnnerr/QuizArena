
import { Helmet } from "react-helmet-async";
import { useTheme } from "../../../../contexts/ThemeContext";
import { useForgot } from "../../hooks/useForgot";
import { BiMailSend } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import LoginPrompt from "./components/LoginPrompt";
import Button from "../../../../shared/ui/Button";
import Input from "../../../../shared/ui/Input";
import ForgotPasswordHeader from "./components/ForgotPasswordHeader";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import ForgotPasswordTopbar from "./components/ForgotPasswordTopbar";

const ForgotPage: React.FC = () => {
    const {
        email,
        loading,
        feedback,
        setEmail,
        handleSubmit
    } = useForgot();

    const { colors } = useTheme();

    const feedbackColors = {
        Success: {
            background: `${colors.success}20`,
            border: colors.success,
            text: colors.success,
        },
        Warning: {
            background: `${colors.primary}20`,
            border: colors.primary,
            text: colors.primary,
        },
        Error: {
            background: `${colors.danger}20`,
            border: colors.danger,
            text: colors.danger,
        },
    };


    return (
        <>
            <Helmet>
                <title>Recuperar Senha | QuizArena</title>
            </Helmet>

            <div
                className="
                    w-full max-w-xl mx-auto
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    px-4 py-5 sm:py-6
                "
            >
                <ForgotPasswordTopbar colors={colors} />

                <FeedbackMessage
                    feedBack={feedback}
                    colors={colors}
                />

                <ForgotPasswordHeader colors={colors} />

                <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-4"
                >
                    <div
                        className="
                            border-2 border-b-8 rounded-3xl
                            shadow-sm space-y-4
                            p-5 sm:p-8
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
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
                            icon={<BiMailSend className="w-7 h-7" />}
                            color={colors.surface}
                            border={colors.border}
                            className="
                                py-4 text-center
                                text-lg sm:text-xl
                            "
                        />
                    </div>

                    <Button
                        type="submit"
                        variant={
                            !email || loading
                                ? "secondary"
                                : "success"
                        }
                        size="lg"
                        fullWidth
                        disabled={!email || loading}
                        rightIcon={
                            !loading ? (
                                <BsArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                            ) : undefined
                        }
                        className="
                                     h-14 rounded-2xl
                                     text-xs sm:text-sm
                                     tracking-wider shadow-md
                                 "
                    >
                        {loading ? "Enviando..." : "Enviar Instruções"}
                    </Button>
                </form>

                <LoginPrompt muted={colors.muted} />
            </div>
        </>
    );
};

export default ForgotPage;
