import { UtilisateurRole } from "../types/utilisateur.type";


export function getUtilisateurRole(role: UtilisateurRole) {
    switch (role) {
        case UtilisateurRole.AGENT:
            return "Agent";
        case UtilisateurRole.CHEF_SERVICE:
            return "Chef de service";
        case UtilisateurRole.CONSUL:
            return "Consultat";
        case UtilisateurRole.ADMIN:
            return "Administrateur";
    }
}