export interface IChatAdapter {
    getChatTitle(): string | null;
    getChatUrl(): string;
    isChatOpen(): boolean;
}
