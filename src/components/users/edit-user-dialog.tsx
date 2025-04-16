import type React from "react"

import { useState, useEffect } from "react"
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
import fonctionServices from '@/services/FonctionServices'
import roleServices from '@/services/RoleServices'

// Schéma de validation simplifié
const editUserFormSchema = z.object({
    prenom: z.string().min(2, { message: "Le prénom doit contenir au moins 2 caractères." }),
    nom: z.string().min(2, { message: "Le nom doit contenir au moins 2 caractères." }),
    email: z.string().email({ message: "Veuillez entrer une adresse email valide." }),
    password: z.string().optional(),
    fonctionId: z.number({ required_error: "Veuillez sélectionner une fonction." }),
    roles: z.array(z.string()).min(1, { message: "Veuillez sélectionner au moins un rôle." }),
})

type EditUserFormValues = z.infer<typeof editUserFormSchema>

interface EditUserDialogProps {
    user: AddUser
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (user: AddUser) => void
}

export function EditUserDialog({ user, open, onOpenChange, onSubmit }: EditUserDialogProps) {
    const [photoPreview, setPhotoPreview] = useState<string | null>(user.photo || null)
    const [availableRoles, setAvailableRoles] = useState<{id: string, label: string}[]>([])
    const [availableFonction, setAvailableFonction] = useState<{value: number, label: string}[]>([])

    const form = useForm<EditUserFormValues>({
        resolver: zodResolver(editUserFormSchema),
        defaultValues: {
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            password: "",
            fonctionId: user.fonctionId,
            roles: user.roles,
        },
    })

    // Mettre à jour le formulaire si l'utilisateur change
    useEffect(() => {
        form.reset({
            prenom: user.prenom,
            nom: user.nom,
            email: user.email,
            password: "",
            fonctionId: user.fonctionId,
            roles: user.roles,
        })
        setPhotoPreview(user.photo || null)
    }, [user, form])

    useEffect(() => {
        const fetchInitData = async () => {
            const resultFonction = await fonctionServices.getAll()
            const resultRole = await roleServices.getAll()
            if (resultFonction.status == 'OK'){
                const fonctions = resultFonction.data.map(fonction => ({value: parseInt(fonction.id!), label: fonction.libelle!}))
                setAvailableFonction(fonctions)
            }
            if (resultRole.status == 'OK'){
                const roles = resultRole.data.map(role => ({id: role.libelle!, label: role.libelle!}))
                setAvailableRoles(roles)
            }
        }
        fetchInitData();
    }, [])

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

    const handleSubmit = (values: EditUserFormValues) => {
        const updatedUser: AddUser = {
            ...user,
            ...values,
            photo: photoPreview || user.photo,
            password: values.password ? values.password : user.password,
        }

        onSubmit(updatedUser)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Modifier l&apos;utilisateur</DialogTitle>
                    <DialogDescription>Modifiez les informations de l&apos;utilisateur.</DialogDescription>
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

                            {/*<FormField*/}
                            {/*    control={form.control}*/}
                            {/*    name="password"*/}
                            {/*    render={({ field }) => (*/}
                            {/*        <FormItem>*/}
                            {/*            <FormLabel>Mot de passe</FormLabel>*/}
                            {/*            <FormControl>*/}
                            {/*                <Input type="password" placeholder="Laisser vide pour conserver l'ancien" {...field} />*/}
                            {/*            </FormControl>*/}
                            {/*            <FormMessage />*/}
                            {/*        </FormItem>*/}
                            {/*    )}*/}
                            {/*/>*/}

                            <FormField
                                control={form.control}
                                name="fonctionId"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Fonction *</FormLabel>
                                        <FonctionCombobox fonctions={availableFonction} value={field.value} onChange={field.onChange} />
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
                            <Button type="submit">Enregistrer</Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

