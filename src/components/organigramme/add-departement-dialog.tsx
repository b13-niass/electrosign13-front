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
import type { Filiale, Departement } from "@/@types"

// Schéma de validation pour le formulaire d'ajout de département
const departementFormSchema = z.object({
    libelle: z.string().min(2, {
        message: "Le libellé doit contenir au moins 2 caractères.",
    }),
    acronyme: z
        .string()
        .min(1, {
            message: "L'acronyme est requis.",
        })
        .max(10, {
            message: "L'acronyme ne doit pas dépasser 10 caractères.",
        }),
})

type DepartementFormValues = z.infer<typeof departementFormSchema>

interface AddDepartementDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (departement: Omit<Departement, "id" | "fonctions" | "createdAt" | "updatedAt">) => void
    filiale: Filiale
}

export function AddDepartementDialog({ open, onOpenChange, onSubmit, filiale }: AddDepartementDialogProps) {
    const form = useForm<DepartementFormValues>({
        resolver: zodResolver(departementFormSchema),
        defaultValues: {
            libelle: "",
            acronyme: "",
        },
    })

    const handleSubmit = (values: DepartementFormValues) => {
        onSubmit(values)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter un département</DialogTitle>
                    <DialogDescription>Ajoutez un nouveau département à la filiale {filiale.libelle}.</DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="libelle"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Libellé</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Nom du département" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="acronyme"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Acronyme</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Acronyme" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
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

