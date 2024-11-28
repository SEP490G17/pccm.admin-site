import { observer } from "mobx-react-lite";
import { store } from "../stores/store";
import StatisticPage from "@/features/statistic/StatisticPage";
import CourtClusterPage from "@/features/court-cluster/List/CourtsClusterPage";

export const RoleBasedRedirect = observer(() => {
    // Giả sử bạn lấy `roles` từ props hoặc global store (ví dụ MobX hoặc Redux)
    if (store.commonStore.getRoles().includes('Owner')) {
      return <StatisticPage />;
    }
    return <CourtClusterPage />;
  });