import { useTranslation } from 'react-i18next'; // Import useTranslation

const Error = () => {
    // Initialize translation hook inside the component
    const { t } = useTranslation();

    // Use the t() function to render the translated string
    return <h2>{t('error404')}</h2>;
};

export default Error;