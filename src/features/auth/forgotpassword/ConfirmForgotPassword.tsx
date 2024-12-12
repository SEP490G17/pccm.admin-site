import { useNavigate } from 'react-router-dom';
import ForgotPopUp from './ForgotPopUp';

const ConfirmForgotPassword = () => {
    const currentUrl = window.location.href;
    const isArgonautDomain = currentUrl.startsWith("http://localhost:3000/") || currentUrl.startsWith("http://localhost:3001/") || currentUrl.startsWith("http://localhost:3002/") || currentUrl.startsWith("https://argonaut.asia/");
    const urlParams = new URL(currentUrl).searchParams;
    const token = urlParams.get('token');
    const navigate = useNavigate();

    if (!isArgonautDomain) {
        console.error("Truy cập từ domain không hợp lệ:", currentUrl);
        navigate('/404');
        return null;
    }

    if (!token) {
        console.error("Không tìm thấy token trong URL.");
        navigate('/404');
        return null;
    }

    return <ForgotPopUp token={token} />;
};

export default ConfirmForgotPassword;
