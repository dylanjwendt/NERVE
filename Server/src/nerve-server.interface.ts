export interface INerveServer {
    init(): void;
    connect(endpoint: string): void;
    send(messageType: string, message: string): void;
    onStateChange(callback: (state: any) => void): void;
    onMessage(messageType: string, callback: (message: any) => void): void;
    leave(consented: boolean): void;
}
