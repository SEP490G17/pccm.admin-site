import { makeAutoObservable, runInAction } from 'mobx';
import agent from '../api/agent';
import { ImageUpload } from '../models/upload.model';
import { catchErrorHandle } from '../helper/utils';

export default class UploadStore {
  loading: boolean = false;
  imageRegistry = new Map<string, ImageUpload>();
  constructor() {
    makeAutoObservable(this);
    // this.cleanupInterval = window.setInterval(this.cleanUserCache, 30000);
  }

  upImage = async (file: File, fileName: string) => {
    this.loading = true;
    const formData = new FormData();
    formData.append('file', file);
    const [err, res] = await catchErrorHandle(agent.UploadAgent.post(formData));
    runInAction(() => {
      if (res) {
        this.setImageRegistry(res, fileName);
      }
      if (err) {
        console.log(err);
      }
      this.loading = false;
      return [err, res];
    });
  };

  upImageProfile = async (file: File, fileName: string) => {
    this.loading = true;
    try {
      const formData = new FormData();
      formData.append('file', file);
      const image = await agent.UploadAgent.post(formData);
      runInAction(() => {
        this.setImageRegistry(image, fileName);
      });
      return image;
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  };

  private setImageRegistry = (image: ImageUpload, fileName: string) => {
    this.imageRegistry.set(fileName, image);
  };
}
