declare module "@keepklinticket/common";

declare module Express {
    export interface Request {
        currentUser: string;
        
    }
}