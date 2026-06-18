import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import logoIcon from '/src/assets/Logo-PetMap.svg';
import { useAuth } from "../hooks/useAuth";
import { login } from "../services/authService";
import { syncLocalStorageFavorites } from "../services/favoritesService";

const SignIn = () => {
    const { t } = useTranslation();
    const { setToken } = useAuth();
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
            const result = await login(data.email, data.password);

            const localFavorites = localStorage.getItem('paws_favorites');
            if (localFavorites) {
                try {
                    const favorites = JSON.parse(localFavorites);
                    await syncLocalStorageFavorites(favorites, result.token);
                    localStorage.removeItem('paws_favorites');
                } catch (syncError) {
                    console.error('Failed to sync favorites:', syncError);
                }
            }

            setToken(result.token);
            navigate("/", { replace: true });
        } catch (error) {
            setServerError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <section id="sign-in-container">
            <header>
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link>
                </div>
            </header>

            <main className="white-container flex-column">
                <div className="jost-700">{t('signInTitle')}</div>
                <form id="signinForm" onSubmit={handleSubmit(onSubmit)}>

                    <div className="form-group flex-column">
                        <label htmlFor="email">{t('email')}</label>
                        <input  className="signin-input"
                            type="email"
                            {...register("email", { required: true })}
                            id="email"
                            placeholder={t('email')}
                            autoComplete="email"
                        />
                        {errors.email && (
                            <span className="error-msg" style={{ color: "red" }}>
                                *Email* is mandatory
                            </span>
                        )}
                    </div>

                    <div className="form-group flex-column">
                        <label htmlFor="password">Enter your Password</label>
                        <input className="signin-input"
                            type="password"
                            {...register("password", { required: true })}
                            id="password"
                            placeholder={t('password')}
                            autoComplete="current-password"
                        />
                        {errors.password && (
                            <span className="error-msg" style={{ color: "red" }}>
                                *Password* is mandatory
                            </span>
                        )}
                    </div>

                    {serverError && (
                        <div className="form-message error" style={{ color: "red" }}>
                            {serverError}
                        </div>
                    )}

                    <button className="submit-btn nav-sections" type="submit" id="submit-btn" disabled={isLoading}>
                        {isLoading ? t('signingIn') || 'Signing in…' : t('signIn')}
                    </button>
                </form>

                <div>
                    {t('createAccountTitle')} 
                    <br/><br/>
                    <Link className="nav-sections" to="/components/registration">{t('registration')}</Link>
                </div>
            </main>
        </section>
    );
};

export default SignIn;
