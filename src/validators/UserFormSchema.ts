import { z } from 'zod'

const userFormSchema = z.object({
    prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    cni: z.string().min(8, { message: "Le cni doit contenir au moins 8 caractères." }),
    telephone: z.string().min(8, { message: "Le téléphone doit contenir au moins 8 caractères." }),
    fonctionId: z.number({ required_error: "Veuillez sélectionner une fonction." }),
    roles: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un rôle." }),
})

export default userFormSchema