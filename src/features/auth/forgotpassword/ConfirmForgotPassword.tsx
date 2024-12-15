import { useNavigate } from 'react-router-dom';
import ForgotPopUp from './ForgotPopUp';

const ConfirmForgotPassword = () => {
    const currentUrl = window.location.href;
    const isArgonautDomain = currentUrl.startsWith("http://localhost:3000/") || currentUrl.startsWith("http://localhost:3001/") || currentUrl.startsWith("http://localhost:3002/") || currentUrl.startsWith("https://admin.trongnp-registry.site/");
    const urlParams = new URL(currentUrl).searchParams;
    const token = urlParams.get('token');
    const navigate = useNavigate();

    if (!isArgonautDomain) {
        navigate('/server-error');
        return null;
    }

    if (!token) {
        navigate('/server-error');
        return null;
    }

    return <ForgotPopUp token={token} />;
};

export default ConfirmForgotPassword;
