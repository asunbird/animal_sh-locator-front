import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useForm } from "react-hook-form"; // Import useForm
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons

import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignIn = () => {
    // Initialize translation hook
    const { t } = useTranslation();

    const { setToken } = useAuth();
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const handleSignin = () => {
        setToken("this is a test token");
        navigate("/", { replace: true });
    };

    setTimeout(() => {
        handleSignin();
    }, 3 * 1000);

    const onSubmit = (data) => {
    localStorage.setItem(data.email, JSON.stringify({ 
        name: data.name, password: data.password 
    }));
    console.log(JSON.parse(localStorage.getItem(data.email)));
  };

    return (
        <>SignIn Page
            <section id="sign-in-container">
                <header>
                    <div>
                        <Link className="home-btn" to="/">
                            <img className="logo-icon" src={logoIcon} alt="Pet Map Logo" />
                        </Link> 
                    </div> 
                </header>
                <main className="white-container">
                    <div>{t('signInTitle')}</div>
                    <form id="signinForm" onSubmit={handleSubmit(onSubmit)}>
                        
                        <div className="form-group">
                            <label htmlFor="email">{t('email')}</label>
                            <input
                                type="email"
                                {...register("email", { required: true })}
                                id="email" 
                                name="email" 
                                placeholder={t('email')} 
                                required  
                                autoComplete="email"
                            />
                            {errors.email && <span className="error-msg" id="emailError" style={{ color: "red" }}>*Email* is mandatory</span>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input
                                type="password" 
                                {...register("password", { required: true })}
                                placeholder={t('password')} 
                                id="password" 
                                required 
                                autoComplete="current-password"
                            />
                            {errors.password && <span className="error-msg" id="passwordError" style={{ color: "red" }}>*Password* is mandatory</span>}
                        </div>
                        
                        <button type="submit" id="submit-btn">
                            <Link to="/">{t('signIn')}</Link>
                        </button>
                        <div id="formMessage" className="form-message"></div>
                        {/*
                        <div>{t('forgotPassword')}</div>
                        <input type="email" placeholder={t('emailAddress')} />
                        <button type="button">{t('resetPassword')}</button>
                        */}

                    </form>
                    <div>{t('createAccountTitle')}</div>
                    <Link to="/components/registration">{t('registration')}</Link>
                </main>
            </section>
        </>
    )
};

export default SignIn;