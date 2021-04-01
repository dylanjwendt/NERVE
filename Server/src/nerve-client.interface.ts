export interface INerveClient {
    connect(endpoint: string): void;
    send(message: string): void;
    onStateChange(callback: (state: any) => void): void;
    leave(consented: boolean): void;
}
