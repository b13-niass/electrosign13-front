import type React from "react"

import { useState } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/shadcn-ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/shadcn-ui/form"
import { Input } from "@/components/shadcn-ui/input"
import { Button } from "@/components/shadcn-ui/button"
import { Checkbox } from "@/components/shadcn-ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/shadcn-ui/avatar"
import type { AddUser } from "@/@types"
import { FonctionCombobox } from "./fonction-combobox"

// Schéma de validation simplifié
const userFormSchema = z.object({
    prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
    password: z.string().min(8, { message: "Le mot de passe doit contenir au moins 8 caractères." }),
    fonctionId: z.number({ required_error: "Veuillez sélectionner une fonction." }),
    roles: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un rôle." }),
})

type UserFormValues = z.infer<typeof userFormSchema>

// Liste des rôles disponibles
const availableRoles = [
    { id: "ADMIN", label: "Administrateur" },
    { id: "USER", label: "Utilisateur" },
    { id: "MANAGER", label: "Gestionnaire" },
    { id: "VIEWER", label: "Lecteur" },
]

interface AddUserDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (user: AddUser) => void
}

export function AddUserDialog({ open, onOpenChange, onSubmit }: AddUserDialogProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(null)

    const form = useForm<UserFormValues>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            prenom: "",
            nom: "",
            email: "",
            password: "",
            roles: ["USER"],
        },
    })

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result as string)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (values: UserFormValues) => {
        // Créer un nouvel utilisateur avec les valeurs du formulaire
        const newUser: AddUser = {
            id: Date.now().toString(),
            ...values,
            telephone: "",
            cni: "",
            photo: photoPreview || "/placeholder.svg?height=40&width=40",
            fonctionNom: "Fonction", // Sera remplacé par le nom réel de la fonction
            active: true,
        }

        onSubmit(newUser)
        form.reset()
        setPhotoPreview(null)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un utilisateur</DialogTitle>
                    <DialogDescription>Remplissez le formulaire pour ajouter un nouvel utilisateur.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <div className="flex flex-col items-center mb-4">
                            <Avatar className="w-20 h-20 mb-2">
                                <AvatarImage src={photoPreview || "/placeholder.svg?height=80&width=80"} />
                                <AvatarFallback>
                                    {form.watch("prenom")?.charAt(0) || ""}
                                    {form.watch("nom")?.charAt(0) || ""}
                                </AvatarFallback>
                            </Avatar>
                            <Input type="file" accept="image/*" onChange={handlePhotoChange} className="max-w-[250px]" />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="prenom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Prénom *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Prénom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="nom"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Nom *</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Nom" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email *</FormLabel>
                                        <FormControl>
                                            <Input type="email" placeholder="Email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mot de passe *</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Mot de passe" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="fonctionId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fonction *</FormLabel>
                                        <FonctionCombobox value={field.value} onChange={field.onChange} />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <FormField
                            control={form.control}
                            name="roles"
                            render={() => (
                                <FormItem>
                                    <FormLabel>Rôles *</FormLabel>
                                    <div className="grid grid-cols-2 gap-2 mt-2">
                                        {availableRoles.map((role) => (
                                            <FormField
                                                key={role.id}
                                                control={form.control}
                                                name="roles"
                                                render={({ field }) => (
                                                    <FormItem key={role.id} className="flex flex-row items-start space-x-3 space-y-0">
                                                        <FormControl>
                                                            <Checkbox
                                                                checked={field.value?.includes(role.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, role.id])
                                                                        : field.onChange(field.value?.filter((value) => value !== role.id))
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="font-normal">{role.label}</FormLabel>
                                                    </FormItem>
                                                )}
                                            />
                                        ))}
                                    </div>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter className="mt-6">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Annuler
                            </Button>
                            <Button type="submit">Ajouter</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

