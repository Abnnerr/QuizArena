
import { Helmet } from "react-helmet-async";
import {BiUser } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { useLogin } from "../../hooks/useLogin";
import { useTheme } from "../../../../contexts/ThemeContext";
import { Input } from "../../../../shared/ui/Input";
import RegisterPrompt from "./components/RegisterPrompt";
import Button from "../../../../shared/ui/Button";
import PasswordField from "./components/PasswordField";
import FeedbackMessage from "../../../../shared/ui/FeedBackMessage";
import LoginTopbar from "./components/LoginTopBar";
import LoginWelcomeBanner from "./components/LoginWecomeBanner";

const LoginPage = () => {
    const {
        userName,
        password,
        showPassword,
        setUserName,
        setPassword,
        setShowPassword,
        handleSubmit,
        feedback,
        loading
    } = useLogin();

    const { colors } = useTheme();

    return (

        <>
            <Helmet>
                <title>QuizArena • Login</title>
            </Helmet>

            <div
                className="
            w-full max-w-xl mx-auto px-4
            flex flex-col items-center
            flex-shrink-0 relative z-10
            py-3 sm:py-4
        "
            >
                <LoginTopbar colors={colors} />

                <LoginWelcomeBanner colors={colors} />

                <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-3"
                >
                    <div
                        className="
                    border-2 border-b-8 rounded-3xl shadow-lg
                    p-4 sm:p-6 space-y-3
                "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <FeedbackMessage
                            feedBack={feedback}
                            colors={colors}
                        />

                        <Input
                            label="Nome de Usuário"
                            icon={<BiUser className="w-6 h-6" />}
                            type="text"
                            required
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            placeholder="Ex: Gilberto"
                        />

                        <PasswordField
                            password={password}
                            setPassword={setPassword}
                            showPassword={showPassword}
                            setShowPassword={setShowPassword}
                            colors={colors}
                        />
                    </div>

                    <Button
                        type="submit"
                        variant={
                            !userName || !password || loading
                                ? "secondary"
                                : "success"
                        }
                        size="lg"
                        fullWidth
                        disabled={!userName || !password || loading}
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
                        {loading ? "Entrando..." : "Entrar na Sala"}
                    </Button>
                </form>

                <RegisterPrompt colors={colors} />
            </div>
        </>

    );
};

export default LoginPage;
