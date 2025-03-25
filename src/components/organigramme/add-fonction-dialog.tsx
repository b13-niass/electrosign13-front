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
import type { Departement, Fonction } from "@/@types"

// Schéma de validation pour le formulaire d'ajout de fonction
const fonctionFormSchema = z.object({
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

type FonctionFormValues = z.infer<typeof fonctionFormSchema>

interface AddFonctionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (fonction: Omit<Fonction, "id" | "createdAt" | "updatedAt">) => void
    departement: Departement
}

export function AddFonctionDialog({ open, onOpenChange, onSubmit, departement }: AddFonctionDialogProps) {
    const form = useForm<FonctionFormValues>({
        resolver: zodResolver(fonctionFormSchema),
        defaultValues: {
            libelle: "",
            acronyme: "",
        },
    })

    const handleSubmit = (values: FonctionFormValues) => {
        onSubmit(values)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une fonction</DialogTitle>
                    <DialogDescription>Ajoutez une nouvelle fonction au département {departement.libelle}.</DialogDescription>
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
                                        <Input placeholder="Nom de la fonction" {...field} />
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

