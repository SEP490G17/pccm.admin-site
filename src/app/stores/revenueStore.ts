import { makeAutoObservable, runInAction } from 'mobx';
import {
  CourtClusterStatisticDetails,
  ExpenseDetailsDTO,
  FilterCourtClusterStatisticDetailsDTO,
} from '../models/revenue.models';
import agent from '../api/agent';

export default class revenueStore {
  loading: boolean = false;
  cleanupInterval: number | undefined = undefined;
  loadingStatistic: boolean = true;
  dataDetail: CourtClusterStatisticDetails | undefined = undefined;

  constructor() {
    makeAutoObservable(this);
  }

  loadCourtClusterStatisticDetail = (data: FilterCourtClusterStatisticDetailsDTO) => {
    this.loadingStatistic = true;
    runInAction(async () => {
      try {
        this.dataDetail = await agent.Revenue.getrevenue(data);
      } catch (error) {
        console.error('Failed to load years:', error);
      } finally {
        this.loadingStatistic = false;
      }
    });
  };

  saveExpense = (data: ExpenseDetailsDTO) => {
    this.loadingStatistic = true;
    runInAction(async () => {
      try {
        await agent.Revenue.saveExpense(data);
      } catch (error) {
        console.error('Failed to load years:', error);
      } finally {
        this.loadingStatistic = false;
      }
    });
  };

  exportExcel = (data: FilterCourtClusterStatisticDetailsDTO) => {
    runInAction(async () => {
      try {
        const response = await agent.Revenue.exportExcel(data);
        const byteCharacters = atob(response.fileContents);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
          const slice = byteCharacters.slice(
            offset,
            Math.min(byteCharacters.length, offset + 1024),
          );
          const byteArray = new Uint8Array(slice.length);

          for (let i = 0; i < slice.length; i++) {
            byteArray[i] = slice.charCodeAt(i);
          }

          byteArrays.push(byteArray);
        }

        const blob = new Blob(byteArrays, {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;

        const date = new Date(data.date);
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        link.setAttribute('download', `Doanh_thu_${month}/${year}.xlsx`);

        document.body.appendChild(link);
        link.click();
        window.URL.revokeObjectURL(url);
      } catch (error) {
        console.error('Failed to export Excel:', error);
      }
    });
  };
}
