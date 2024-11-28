import { makeAutoObservable, runInAction } from 'mobx';
import { store } from './store';
import { HubConnection, HubConnectionBuilder, LogLevel } from '@microsoft/signalr';

export default class SignalRStore {
  hubConnection: HubConnection | null = null;
  constructor() {
    makeAutoObservable(this);
  }

  createConnection = async () => {
    this.hubConnection = new HubConnectionBuilder()
      .withUrl(import.meta.env.VITE_SIGNALR_HUB_URL, {
        withCredentials: true,
      })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();
    return this.hubConnection
      .start()
      .catch((err) => console.log('Error establishing the connection', err));
  };

  joinCourtClusterConnection = async (courtClusterId: number) => {
    if (this.hubConnection) {
      await this.hubConnection.invoke('JoinClusterGroup', `admin${courtClusterId}`).then(() => {
        console.log(`Join group admin${courtClusterId} success`);
      });
      this.hubConnection.on('UpdateBooking', (booking) => {
        runInAction(() => store.bookingClusterStore.updateBookingSignalr(booking));
      });

      this.hubConnection.on('CreateBooking', (booking) => {
        runInAction(() => store.bookingClusterStore.createBookingSignalr(booking));
      });
    }
  };

  leaveCourtCLusterGroup = async (courtClusterId: number) => {
    await this.hubConnection?.invoke('LeaveClusterGroup', `admin${courtClusterId}`);
  };

  stopHubConnection = () => {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      this.hubConnection
        .stop()
        .then(() => {
          console.log('SignalR connection stopped successfully');
        })
        .catch((err) => console.log('Error stopping the connection', err));
    } else {
      console.log('SignalR connection is not in connected state, skipping stop');
    }
  };
}
