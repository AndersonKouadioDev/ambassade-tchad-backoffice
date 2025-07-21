
"use client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icon } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useUserProfile, useSignOut } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

const ProfileInfo = () => {
  const { data: userProfile, isLoading } = useUserProfile();
  const signOutMutation = useSignOut();

  const handleSignOut = () => {
    signOutMutation.mutate();
  };

  // Pendant le chargement
  if (isLoading) {
    return (
      <div className="flex items-center gap-2">
        <Skeleton className="h-9 w-9 rounded-full" />
      </div>
    );
  }

  // Si pas d'utilisateur connecté
  if (!userProfile) {
    return null;
  }

  const getDisplayName = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName} ${userProfile.lastName}`;
    }
    return userProfile.email.split('@')[0];
  };

  const getInitials = () => {
    if (userProfile.firstName && userProfile.lastName) {
      return `${userProfile.firstName[0]}${userProfile.lastName[0]}`.toUpperCase();
    }
    return userProfile.email[0].toUpperCase();
  };

  const getRoleBadgeColor = () => {
    switch (userProfile.role) {
      case 'ADMIN':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      case 'CONSUL':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'CHEF_SERVICE':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'AGENT':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getRoleLabel = () => {
    switch (userProfile.role) {
      case 'ADMIN':
        return 'Administrateur';
      case 'CONSUL':
        return 'Consul';
      case 'CHEF_SERVICE':
        return 'Chef de Service';
      case 'AGENT':
        return 'Agent';
      default:
        return userProfile.type === 'PERSONNEL' ? 'Personnel' : 'Demandeur';
    }
  };

  return (
    <div className="md:block hidden">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex items-center gap-3 text-embassy-blue-800 hover:bg-embassy-blue-50 bg-embassy-blue-50 rounded-lg px-2 py-1 transition-all duration-200 dark:text-embassy-blue-200 dark:hover:bg-embassy-blue-800/30 h-auto"
          >
            <Avatar className="h-9 w-9 border-2 border-embassy-blue-200 dark:border-embassy-blue-600">
              <AvatarImage src={"/images/all-img/user3.png"} alt={getDisplayName()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="text-sm font-semibold capitalize lg:block hidden">
              {getDisplayName()}
            </div>
            <span className="text-base me-2.5 lg:inline-block hidden text-white dark:text-embassy-blue-400">
              <Icon icon="heroicons-outline:chevron-down" />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64 p-0 bg-white/95 backdrop-blur-sm border border-embassy-blue-200 shadow-xl dark:bg-slate-800/95 dark:border-embassy-blue-400/30" align="end">
          <DropdownMenuLabel className="flex gap-3 items-center mb-1 p-4 border-b border-embassy-blue-100 dark:border-embassy-blue-700/30">
            <Avatar className="h-10 w-10 border-2 border-embassy-blue-200 dark:border-embassy-blue-600">
              <AvatarImage src={"/images/all-img/user3.png"} alt={getDisplayName()} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="text-sm font-semibold text-embassy-blue-800 capitalize dark:text-embassy-blue-200">
                {getDisplayName()}
              </div>
              <div className="text-xs text-embassy-blue-600 mb-1 dark:text-embassy-blue-400">
                {userProfile.email}
              </div>
              <div className="flex gap-1">
                {userProfile.role && (
                  <Badge 
                    variant="secondary" 
                    className={`text-xs px-2 py-0.5 ${getRoleBadgeColor()}`}
                  >
                    {getRoleLabel()}
                  </Badge>
                )}
                <Badge 
                  variant={userProfile.status === 'ACTIVE' ? 'default' : 'secondary'}
                  className="text-xs px-2 py-0.5"
                >
                  {userProfile.status === 'ACTIVE' ? 'Actif' : 'Inactif'}
                </Badge>
              </div>
            </div>
          </DropdownMenuLabel>
          
          <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-embassy-blue-700 capitalize px-3 py-2 cursor-pointer hover:bg-embassy-blue-50 rounded-lg mx-2 transition-colors duration-200 dark:text-embassy-blue-300 dark:hover:bg-embassy-blue-800/50">
            <Icon icon="heroicons:user" className="w-4 h-4 text-embassy-blue-600 dark:text-embassy-blue-400" />
            Mon Profil
          </DropdownMenuItem>
          
          <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-embassy-blue-700 capitalize px-3 py-2 cursor-pointer hover:bg-embassy-blue-50 rounded-lg mx-2 transition-colors duration-200 dark:text-embassy-blue-300 dark:hover:bg-embassy-blue-800/50">
            <Icon icon="heroicons:cog-8-tooth" className="w-4 h-4 text-embassy-blue-600 dark:text-embassy-blue-400" />
            Paramètres
          </DropdownMenuItem>
          
          {userProfile.type === 'PERSONNEL' && (
            <DropdownMenuItem className="flex items-center gap-2 text-sm font-medium text-embassy-blue-700 capitalize px-3 py-2 cursor-pointer hover:bg-embassy-blue-50 rounded-lg mx-2 transition-colors duration-200 dark:text-embassy-blue-300 dark:hover:bg-embassy-blue-800/50">
              <Icon icon="heroicons:chart-bar" className="w-4 h-4 text-embassy-blue-600 dark:text-embassy-blue-400" />
              Statistiques
            </DropdownMenuItem>
          )}
          
          <DropdownMenuSeparator className="mb-0 bg-embassy-blue-100 dark:bg-embassy-blue-700/30" />
          
          <DropdownMenuItem 
            className="flex items-center gap-2 text-sm font-medium text-embassy-red-600 capitalize my-2 px-3 cursor-pointer hover:bg-embassy-red-50 rounded-lg mx-2 transition-colors duration-200 dark:text-embassy-red-400 dark:hover:bg-embassy-red-900/30"
            onClick={handleSignOut}
            disabled={signOutMutation.isPending}
          >
            <Icon icon="heroicons:power" className="w-4 h-4" />
            {signOutMutation.isPending ? 'Déconnexion...' : 'Déconnexion'}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
export default ProfileInfo;
