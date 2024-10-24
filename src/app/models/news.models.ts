export interface News {
  id: number;
  thumbnail: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  status: number;
  tags: string[];
  createdAt: string;
  content: string;
}

export class NewsDTO {
  id: number = 0;
  title: string = '';
  description: string = '';
  thumbnail: string ='';
  startTime: string = '';
  endTime: string = '';
  location: string = '';
  status: number = 1;
  tags: string[] = [];
  createAt: string ='';
  content:string ='';

  constructor(data?: Partial<NewsDTO>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}
