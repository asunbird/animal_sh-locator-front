import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import { register as registerUser } from "../services/authService";

function Register() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [serverError, setServerError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = async (data) => {
        setServerError('');
        setIsLoading(true);
        try {
            await registerUser(data.name, data.email, data.password);
            navigate("/components/signin", { replace: true });
        } catch (error) {
            setServerError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h2>Registration Form</h2>

            <form id="create-account-form" onSubmit={handleSubmit(onSubmit)}>
                <input
                    type="text"
                    {...register("name", { required: true })}
                    placeholder={t('username')}
                />
                {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}

                <input
                    type="email"
                    {...register("email", { required: true })}
                    placeholder={t('email')}
                />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder={t('password')}
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                {serverError && (
                    <div style={{ color: "red" }}>{serverError}</div>
                )}

                <button type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating…' : t('create')}
                </button>
            </form>

            <Link to="/components/signin">
                {t('signIn') || 'Already have an account? Sign in'}
            </Link>
        </>
    );
}

export default Register;
