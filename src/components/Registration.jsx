import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useForm } from "react-hook-form";
import { register as registerUser } from "../services/authService";
import logoIcon from '/src/assets/Logo-PetMap.svg';

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
        <div  className="white-container flex-column">
            <header>
                <div>
                    <Link className="home-btn" to="/">
                        <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                    </Link>
                </div>
            </header>
            <div className="jost-700">Registration Form</div>

            <form id="create-account-form"  onSubmit={handleSubmit(onSubmit)}>
                <input className="signin-input"
                    type="text"
                    {...register("name", { required: true })}
                    placeholder={t('username')}
                />
                {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}

                <input   className="signin-input"
                    type="email"
                    {...register("email", { required: true })}
                    placeholder={t('email')}
                />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <input  className="signin-input"
                    type="password"
                    {...register("password", { required: true })}
                    placeholder={t('password')}
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                {serverError && (
                    <div style={{ color: "red" }}>{serverError}</div>
                )}

                <button  className="submit-btn nav-sections" type="submit" disabled={isLoading}>
                    {isLoading ? 'Creating…' : t('create')}
                </button>
            </form>
            <div>
                <div className="libre-franklin-700 flex-column">Already have an account?</div><br />
                <Link  className="submit-btn nav-sections" to="/components/signin">
                    {t('signIn') || 'Already have an account? Sign in'}
                </Link>
            </div>
            
        </div>
    );
}

export default Register;
