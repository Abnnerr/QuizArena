
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useRegister } from '../../hooks/useRegister';
import { BiMailSend, BiUser } from 'react-icons/bi';
import { BsArrowRight } from 'react-icons/bs';
import { PasswordRequirements } from '../../components/PasswordRequeriments';
import { Input } from '../../../../shared/ui/Input';
import { useTheme } from '../../../../contexts/ThemeContext';
import LoginPrompt from './components/LoginPrompt';
import Button from '../../../../shared/ui/Button';
import PasswordField from './components/PasswordField';
import FeedbackMessage from '../../../../shared/ui/FeedBackMessage';
import RegisterTopbar from './components/RegisterTopBar';
import WelcomeBanner from './components/WelcomeBanner';

const RegisterPage: React.FC = () => {
    const {
        userName,
        setUserName,
        email,
        setEmail,
        password,
        setPassword,
        showPassword,
        setShowPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        handleSubmit,
        loading,
        feedback
    } = useRegister();

    const { colors } = useTheme();

    const passwordRequirements = [
        { label: '8+ caracteres', met: hasMinLength },
        { label: 'Letra maiúscula', met: hasUpper },
        { label: 'Letra minúscula', met: hasLower },
        { label: 'Número (0-9)', met: hasNumber },
        { label: 'Caractere especial', met: hasSpecial },
    ];

    return (
        <>
            <Helmet>
                <title>QuizArena • Registrar</title>
            </Helmet>

            <div
                data-cy="register-page"
                className="
                    w-full max-w-xl mx-auto px-4
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    py-3 sm:py-4
                "
            >
                <RegisterTopbar colors={colors} />

                <WelcomeBanner colors={colors} />

                <form
                    onSubmit={handleSubmit}
                    className="w-full space-y-3"
                    data-cy="register-form"
                >
                    <div
                        className="
                            border-2 border-b-8 rounded-3xl shadow-lg
                            p-5 sm:p-6 space-y-3
                        "
                        style={{
                            backgroundColor: colors.card,
                            borderColor: colors.border,
                        }}
                    >
                        <div data-cy="register-feedback">
                            <FeedbackMessage
                                feedBack={feedback}
                                colors={colors}
                            />
                        </div>

                        <div data-cy="register-username">
                            <Input
                                label="Nome de Usuário"
                                icon={<BiUser className="w-6 h-6" />}
                                type="text"
                                required
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                placeholder="Ex: Gilberto"
                            />
                        </div>

                        <div data-cy="register-email">
                            <Input
                                label="E-mail"
                                icon={<BiMailSend className="w-6 h-6" />}
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="seu@email.com"
                            />
                        </div>

                        <div data-cy="register-password">
                            <PasswordField
                                password={password}
                                setPassword={setPassword}
                                showPassword={showPassword}
                                setShowPassword={setShowPassword}
                                colors={colors}
                            >
                                <div data-cy="register-password-requirements">
                                    <PasswordRequirements
                                        requirements={passwordRequirements}
                                    />
                                </div>
                            </PasswordField>
                        </div>
                    </div>

                    <div data-cy="register-submit-container">
                        <Button
                            type="submit"
                            variant={
                                !userName || !password || loading
                                    ? "secondary"
                                    : "success"
                            }
                            size="lg"
                            fullWidth
                            disabled={!userName || !password || loading || !email}
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
                            {loading ? "Criando conta..." : "Criar Conta"}
                        </Button>
                    </div>
                </form>

                <div data-cy="register-login-prompt">
                    <LoginPrompt colors={colors} />
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
