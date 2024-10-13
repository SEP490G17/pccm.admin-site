import { ICourt } from "../models/court.model";

export const sampleCourtData: ICourt[] = [
  {
    id: 1,
    name: 'Sân A',
    image: 'https://file.hstatic.net/1000341630/file/1_1799610e954e47d8a0aa43d0a70fe4fa.jpg',
    manager: 'Nguyễn Văn A',
    location: '123 Đường ABC',
    status: 'Hoạt động',
    createdAt: '2024-10-08',
  },
  {
    id: 2,
    name: 'Sân B',
    image:
      'https://thethaokhoinguyen.com/wp-content/uploads/2024/07/san-Pickleball-tieu-chuan-thi-dau-quoc-te.jpg',
    manager: 'Trần Văn B',
    location: '456 Đường DEF',
    status: 'Tạm dừng',
    createdAt: '2024-10-08',
  },
  {
    id: 3,
    name: 'Sân C',
    image: 'https://www.thethaothientruong.vn/uploads/he-thong-anh-sang-san-Pickleball.jpg',
    manager: 'Lê Văn C',
    location: '789 Đường GHI',
    status: 'Hoạt động',
    createdAt: '2024-10-08',
  },
];
