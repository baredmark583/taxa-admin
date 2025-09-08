// This file should ideally be shared between the frontend and backend,
// or generated from a single source of truth (like a Prisma schema).

export interface AdminUser {
    id: string;
    name: string;
    playMoney: number;
    realMoney: number;
    role: 'ADMIN' | 'MODERATOR' | 'PLAYER' | string;
}
