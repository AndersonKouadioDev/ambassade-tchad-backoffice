'use client';

import { useSession as useNextAuthSession } from 'next-auth/react';
import { useQuery } from '@tanstack/react-query';

// Hook personnalisé pour accéder aux informations de session
export function useSession() {
  const { data: session, status } = useNextAuthSession();
  
  return {
    user: session?.user,
    isAuthenticated: !!session?.user,
    isLoading: status === 'loading',
    accessToken: session?.user?.accessToken,
    refreshToken: session?.user?.refreshToken,
    userType: session?.user?.userType,
    role: session?.user?.role,
    session,
    status
  };
}

// Hook pour obtenir les informations utilisateur depuis la session
export function useUserInfo() {
  const { user, isAuthenticated, isLoading } = useSession();
  
  return useQuery({
    queryKey: ['user', 'info'],
    queryFn: () => {
      if (!user) return null;
      
      return {
        id: user.id,
        email: user.email,
        name: user.name,
        firstName: user.name?.split(' ')[0] || '',
        lastName: user.name?.split(' ').slice(1).join(' ') || '',
        type: user.userType,
        role: user.role,
      };
    },
    enabled: isAuthenticated && !isLoading,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Hook pour vérifier les permissions utilisateur
export function useUserPermissions() {
  const { role, userType } = useSession();
  
  return {
    isAdmin: role === 'ADMIN',
    isConsul: role === 'CONSUL',
    isChefService: role === 'CHEF_SERVICE',
    isAgent: role === 'AGENT',
    isPersonnel: userType === 'PERSONNEL',
    isDemandeur: userType === 'DEMANDEUR',
    canManageUsers: ['ADMIN', 'CONSUL', 'CHEF_SERVICE'].includes(role || ''),
    canManageContent: ['ADMIN', 'CONSUL', 'CHEF_SERVICE', 'AGENT'].includes(role || ''),
    canViewReports: ['ADMIN', 'CONSUL', 'CHEF_SERVICE'].includes(role || ''),
  };
}