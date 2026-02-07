import { supabase } from './supabase';

export type UserRole = 'user' | 'admin';

/**
 * Récupère le rôle d'un utilisateur
 */
export async function getUserRole(userId: string): Promise<UserRole | null> {
    const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .single();

    if (error || !data) {
        return null;
    }

    return data.role as UserRole;
}

/**
 * Vérifie si un utilisateur est administrateur
 */
export async function isAdmin(userId: string): Promise<boolean> {
    const role = await getUserRole(userId);
    return role === 'admin';
}

/**
 * Assigne un rôle à un utilisateur
 */
export async function assignRole(userId: string, role: UserRole): Promise<boolean> {
    const { error } = await supabase
        .from('user_roles')
        .upsert({
            user_id: userId,
            role: role
        });

    return !error;
}

/**
 * Hook pour obtenir le rôle de l'utilisateur courant
 */
export async function getCurrentUserRole(): Promise<UserRole | null> {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return null;
    }

    return await getUserRole(user.id);
}

/**
 * Crée un rôle par défaut pour un nouvel utilisateur
 */
export async function createDefaultUserRole(userId: string): Promise<boolean> {
    return await assignRole(userId, 'user');
}
