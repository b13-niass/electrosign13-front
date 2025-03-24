import { z, ZodType } from 'zod';
import { CreateDemandeFormSchema } from '@/@types/formSchema';

const createDemandeSchema: ZodType<CreateDemandeFormSchema> = z.object({
    file: z.instanceof(File),
    signataires: z.array(
        z.object({
            id: z.string().optional(),
            action: z.string().optional(),
        })
    ).min(1, "Au moins un signataire est requis"),
    approbateurs: z.array(
        z.object({
            id: z.string().optional(),
            action: z.string().optional(),
        })
    ).optional(),
    ampliateurs: z.array(
        z.object({
            id: z.string().optional(),
            action: z.string().optional(),
        })
    ).optional(),
    priority: z.enum(["FAIBLE", "MOYENNE", "HAUTE"]),
    dateLimite: z.date({
        required_error: "Une date limite est requise",
    }),
    description: z.string().min(1, "La description est requise").optional(),
    titre: z.string().min(1, "Le titre est requis"),
    fileAttachment: z.array(z.instanceof(File)).optional(),
});

export default createDemandeSchema;