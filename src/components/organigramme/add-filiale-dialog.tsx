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
import type { Filiale } from "@/@types"

// Schéma de validation pour le formulaire d'ajout de filiale
const filialeFormSchema = z.object({
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

type FilialeFormValues = z.infer<typeof filialeFormSchema>

interface AddFilialeDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSubmit: (filiale: Omit<Filiale, "id" | "departements" | "createdAt" | "updatedAt">) => void
}

export function AddFilialeDialog({ open, onOpenChange, onSubmit }: AddFilialeDialogProps) {
    const form = useForm<FilialeFormValues>({
        resolver: zodResolver(filialeFormSchema),
        defaultValues: {
            libelle: "",
            acronyme: "",
        },
    })

    const handleSubmit = (values: FilialeFormValues) => {
        onSubmit(values)
        form.reset()
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>Ajouter une filiale</DialogTitle>
                    <DialogDescription>Créez une nouvelle filiale dans l&apos;organigramme.</DialogDescription>
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
                                        <Input placeholder="Nom de la filiale" {...field} />
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

