import { Link } from "react-router-dom";
import { useTranslation } from 'react-i18next'; // Import useTranslation
import logoIcon from '/src/assets/Logo-PetMap.svg'; // Import icons

function SignIn() {
    // Initialize translation hook
    const { t } = useTranslation();

    return (
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
                <form id="sign-in-form" action="" method="">
                    <input type="text" placeholder={t('username')} />
                    <input type="password" placeholder={t('password')} />
                    <button type="submit" id="submit-btn" >
                        <Link to="/">{t('submit')}</Link>
                    </button>
                    {/*
                    <div>{t('forgotPassword')}</div>
                    <input type="email" placeholder={t('emailAddress')} />
                    <button type="button">{t('resetPassword')}</button>
                    */}

                </form>
                <div>{t('createAccountTitle')}</div>
                <form id="create-account-form" action="" method="">
                    <input type="text" placeholder={t('username')} />
                    <input type="password" placeholder={t('password')} />
                    <button type="submit">{t('create')}</button>
                </form>
            </main>
        </section>
    )
}

export default SignIn;