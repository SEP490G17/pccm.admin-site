import { router } from "@/app/router/Routes";
import { Link } from "@chakra-ui/react";

const ForbiddenPage = () => {
  return (
    <div className="relative h-screen">
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center max-w-[520px] w-full">
        <h3 className="mt-6 text-sm font-bold uppercase tracking-wider text-[#262626]">
          Oops! Bạn không có quyền truy cập vào trang này
        </h3>
        <div className="relative h-[240px]">
          <h1 className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[252px] font-black uppercase text-[#262626] tracking-[-40px] -ml-[20px]">
            <span className="text-[#262626] text-shadow-[8px_0px_0px_#fff]">4</span>
            <span className="text-[#262626] text-shadow-[8px_0px_0px_#fff]">0</span>
            <span className="text-[#262626] text-shadow-[8px_0px_0px_#fff]">3</span>
          </h1>
        </div>

        <h2 className="mt-4 text-lg font-medium uppercase text-[#000]">
          Xin lỗi! Bạn không có quyền truy cập vào trang này
          <div className="flex justify-center cursor-pointer mt-10 underline text-green-800">
            <Link onClick={() => router.navigate('/')}>Về trang chính</Link>
          </div>
        </h2>
      </div>
    </div>
  );
};

export default ForbiddenPage;
