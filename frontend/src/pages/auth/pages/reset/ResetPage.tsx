
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useReset } from '../../hooks/useReset';
import { PasswordRequirements } from '../../components/PasswordRequeriments';
import { useTheme } from '../../../../contexts/ThemeContext';
import ResetPasswordTopbar from './components/ResetPasswordTopbar';
import FeedbackMessage from '../../../../shared/ui/FeedBackMessage';
import ResetPasswordHeader from './components/ResetPasswordHeader';
import ResetPasswordForm from './components/ResetPasswordForm';
import LoginPrompt from './components/LoginPrompt';

const ResetPage: React.FC = () => {
    const {
        password,
        setPassword,
        confirmPassword,
        setConfirmPassword,
        showPassword,
        setShowPassword,
        showConfirmPassword,
        setShowConfirmPassword,
        hasMinLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial,
        loading,
        feedback,
        handleSubmit,
    } = useReset();

    const { colors } = useTheme();

    const passwordRequirements = [
        { label: "8+ caracteres", met: hasMinLength },
        { label: "Letra maiúscula", met: hasUpper },
        { label: "Letra minúscula", met: hasLower },
        { label: "Número (0-9)", met: hasNumber },
        { label: "Caractere especial", met: hasSpecial },
    ];


    return (
        <>
            <Helmet>
                <title>QuizArena • Redefinir Senha</title>
            </Helmet>

            <div
                className="
                    w-full max-w-xl mx-auto
                    flex flex-col items-center
                    flex-shrink-0 relative z-10
                    px-4 py-5 sm:py-6
                "
            >
                <ResetPasswordTopbar colors={colors} />

                <FeedbackMessage
                    feedBack={feedback}
                    colors={colors}
                />

                <ResetPasswordHeader colors={colors} />

                <ResetPasswordForm
                    colors={colors}
                    password={password}
                    setPassword={setPassword}
                    confirmPassword={confirmPassword}
                    setConfirmPassword={setConfirmPassword}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    showConfirmPassword={showConfirmPassword}
                    setShowConfirmPassword={setShowConfirmPassword}
                    passwordRequirements={
                        <PasswordRequirements requirements={passwordRequirements} />
                    }
                    loading={loading}
                    handleSubmit={handleSubmit}
                />

                <LoginPrompt muted={colors.muted} />
            </div>
        </>
    );
};

export default ResetPage;
