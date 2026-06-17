import { useTranslation } from 'react-i18next'; // Import useTranslation
import { useForm } from "react-hook-form";

function Register() {
    // Initialize translation hook
    const { t } = useTranslation();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    const onSubmit = (data) => {
        const existingUser = JSON.parse(localStorage.getItem(data.email));
        if (existingUser) {
            console.log("Email is already registered!");
        } else {
            const userData = {
                name: data.name,
                email: data.email,
                password: data.password,
            };
            localStorage.setItem(data.email, JSON.stringify(userData));
            console.log(data.name + " has been successfully registered");
        }
    };

    return (
        <>
            <h2>Registration Form</h2>

            <form id="create-account-form" onSubmit={handleSubmit(onSubmit)}>
                <input type="text" 
                {...register("name", { required: true })}
                placeholder={t('username')} />
                {errors.name && <span style={{ color: "red" }}>*Name* is mandatory</span>}

                <input
                    type="email"
                    {...register("email", { required: true })}
                     placeholder={t('Email')}
                />
                {errors.email && <span style={{ color: "red" }}>*Email* is mandatory</span>}

                <input
                    type="password"
                    {...register("password", { required: true })}
                    placeholder={t('password')}
                />
                {errors.password && <span style={{ color: "red" }}>*Password* is mandatory</span>}

                <button type="submit">{t('create')}</button>
            </form>
        </>
    );
}

export default Register;
   
   
   
   
