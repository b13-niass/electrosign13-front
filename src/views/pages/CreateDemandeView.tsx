"use client"

import { useEffect, useState, useMemo, useRef } from 'react'
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Form } from "@/components/ui/Form"
import type { CommonProps } from "@/@types/common"
import useTimeOutMessage from "@/utils/hooks/useTimeOutMessage"
import DemandeService, { type DemandeCredentials, type UserDemande } from "@/services/DemandeService"
import PdfUpload, { PdfUploadRef } from '@/components/ui/PdfUpload'
import { MultiSelect } from "@/components/ui/MultiSelect"
import { Label } from "@/components/shadcn-ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/shadcn-ui/radio-group"
import { format, isBefore, startOfToday } from "date-fns"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/shadcn-ui/popover"
import { Button } from "@/components/shadcn-ui/button"
import { Button as ButtonDefault } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { CalendarIcon, File, X } from "lucide-react"
import { Calendar } from "@/components/shadcn-ui/calendar"
import { fr } from "date-fns/locale"
import { PiTrash } from "react-icons/pi"
import WebViewerPdf from "@/components/ui/WebViewerPdf"
import type { z } from "zod"
import UserService from "@/services/UserService"
import type { User } from "@/@types"
import { toast } from "sonner"
import createDemandeSchema from "@/validators/CreateDemandeSchema"
import { Input } from "@/components/shadcn-ui/input"
import { Textarea } from "@/components/shadcn-ui/textarea"
import { AttachMultipleFile } from "@/components/ui/AttachMultipleFile"
import { useSessionUser } from "@/store/authStore"

// Type inféré à partir du schéma Zod
type CreateDemandeFormSchema = z.infer<typeof createDemandeSchema>

type Option = {
    label: string
    value: string
}

type PriorityType = "FAIBLE" | "MOYENNE" | "HAUTE"

interface CreateDemandeFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

const CreateDemandeView = () => {
    const [fileUpload, setFileUpload] = useState<File | undefined>(undefined)
    const [attachments, setAttachments] = useState<File[]>([])
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
    const [message, setMessage] = useTimeOutMessage()
    const [allUsers, setAllUsers] = useState<Option[]>([])
    const [selectedSignataire, setSelectedSignataire] = useState<string[]>([])
    const [selectedApprobateur, setSelectedApprobateur] = useState<string[]>([])
    const [selectedAmpliateurs, setSelectedAmpliateurs] = useState<string[]>([])
    const { user , tokenValidity, setTokenValidity} = useSessionUser()
    const today = startOfToday()
    const pdfUploadRef = useRef<PdfUploadRef>(null);

    const {
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        watch,
        reset,
        formState,
    } = useForm<CreateDemandeFormSchema>({
        defaultValues: {
            file: undefined,
            signataires: [],
            approbateurs: [],
            priority: "MOYENNE",
            dateLimite: undefined,
            ampliateurs: [],
            description: "",
            titre: "",
            fileAttachment: [],
        },
        resolver: zodResolver(createDemandeSchema),
    })

    // Observer les valeurs du formulaire pour le débogage
    const formValues = watch()

    // Filtrer les options disponibles pour chaque liste
    const signatairesOptions = useMemo(() => {
        return allUsers.filter(
            (user) => !selectedApprobateur.includes(user.value) && !selectedAmpliateurs.includes(user.value),
        )
    }, [allUsers, selectedApprobateur, selectedAmpliateurs])

    const approbateursOptions = useMemo(() => {
        return allUsers.filter(
            (user) => !selectedSignataire.includes(user.value) && !selectedAmpliateurs.includes(user.value),
        )
    }, [allUsers, selectedSignataire, selectedAmpliateurs])

    const ampliateurOptions = useMemo(() => {
        return allUsers.filter(
            (user) => !selectedSignataire.includes(user.value) && !selectedApprobateur.includes(user.value),
        )
    }, [allUsers, selectedSignataire, selectedApprobateur])

    useEffect(() => {
        console.log("now", tokenValidity)
        if (!tokenValidity) return

        const fetchUsers = async () => {
            try {
                const fetchSignataires = await UserService.getAll("SIGNATAIRES")
                const fetchApprobateurs = await UserService.getAll("APPROVATEUR")
                const fetchAmpliateurs = await UserService.getAll("AMPLIATEUR")

                // Combiner tous les utilisateurs dans une seule liste
                const signatairesOptions = transformUsersToOptions(fetchSignataires.data as User[])
                const approbateursOptions = transformUsersToOptions(fetchApprobateurs.data as User[])
                const ampliateurOptions = transformUsersToOptions(fetchAmpliateurs.data as User[])

                // Fusionner les listes et éliminer les doublons par valeur (id)
                const allUsersMap = new Map()
                ;[...signatairesOptions, ...approbateursOptions, ...ampliateurOptions].forEach((option) => {
                    if (option.value!= user.id) {
                        allUsersMap.set(option.value, option)
                    }
                })

                setAllUsers(Array.from(allUsersMap.values()))
            } catch (error) {
                toast("Erreur lors du chargement des utilisateurs", {
                    description: "Veuillez réessayer plus tard",
                })
            }
        }
        fetchUsers()
    }, [tokenValidity])

    // Afficher les erreurs de validation dans l'UI
    useEffect(() => {
        if (Object.keys(errors).length > 0) {
            // Afficher les erreurs dans la console pour le débogage
            console.error("Form errors:", errors)

            // Afficher un toast pour chaque erreur
            Object.entries(errors).forEach(([field, error]) => {
                if (error?.message) {
                    toast(`Erreur: ${field}`, {
                        description: error.message,
                    })
                }
            })
        }
    }, [errors])

    const transformUsersToOptions = (users: User[]): Option[] => {
        return users.map((user) => {
            const acronyme = user.fonctionObject?.acronyme || ""
            const prenom = user.prenom || ""
            const nom = user.nom || ""

            const label = `${acronyme} ${prenom} ${nom}`
            const value = user.id || ""

            return { label, value }
        })
    }

    const onCreateDemande = async (values: CreateDemandeFormSchema) => {
        try {
            setSubmitting(true)
            console.log("Form values submitted:", values)

            // Vérifier que toutes les données requises sont présentes
            if (
                !values.file ||
                values.signataires.length === 0 ||
                values.titre?.length === 0 ||
                values.description?.length === 0 ||
                !values.dateLimite
            ) {
                toast("Formulaire incomplet", {
                    description: "Veuillez remplir tous les champs obligatoires",
                })
                return
            }

            const result = await DemandeService.create(values as DemandeCredentials)

            if (result?.status === "OK") {
                toast("Demande créée avec succès", {
                    description: "Votre demande a été envoyée aux signataires",
                })
                // Réinitialiser le formulaire après succès
                reset()
                setFileUpload(undefined)
                setAttachments([])
                setSelectedSignataire([])
                setSelectedApprobateur([])
                setSelectedAmpliateurs([])
                if (pdfUploadRef.current) {
                    console.log("ICI clear")
                    pdfUploadRef.current.clearFile();
                }
            } else {
                toast("Erreur lors de la création de la demande", {
                    description: result?.message || "Une erreur est survenue",
                })
            }
        } catch (error) {
            console.error("Error submitting form:", error)
            toast("Erreur lors de la soumission", {
                description: "Une erreur inattendue s'est produite",
            })
        } finally {
            setSubmitting(false)
        }
    }

    const onUploadFile = (file: File) => {
        setFileUpload(file)
        setValue("file", file, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const handleAttachmentsChange = (files: File[]) => {
        setAttachments(files)
        setValue("fileAttachment", files, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const onChangeSignataires = (values: string[]) => {
        const result: UserDemande[] = values.map((v) => ({ id: v! + "", action: "SIGNER" }))
        setValue("signataires", result, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
        setSelectedSignataire(values)
    }

    const onChangeApprobateur = (values: string[]) => {
        const result: UserDemande[] = values.map((v) => ({ id: v + "", action: "APPROUVER" }))
        setValue("approbateurs", result, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
        })
        setSelectedApprobateur(values)
    }

    const onChangeAmpliateurs = (values: string[]) => {
        const result: UserDemande[] = values.map((v) => ({ id: v + "", action: "AMPLIER" }))
        setValue("ampliateurs", result, {
            shouldValidate: false,
            shouldDirty: false,
            shouldTouch: false,
        })
        setSelectedAmpliateurs(values)
    }

    const onPriorityChange = (value: PriorityType) => {
        setValue("priority", value, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    const onDateLimiteChange = (date: Date | undefined) => {
        if (date) {
            console.log(format(date, "dd-MM-yyyy"))
            setValue("dateLimite", date, {
                shouldValidate: true,
                shouldDirty: true,
                shouldTouch: true,
            })
        }
    }

    const handleReset = () => {
        reset()
        setFileUpload(undefined)
        setAttachments([])
        setSelectedSignataire([])
        setSelectedApprobateur([])
        setSelectedAmpliateurs([])
    }

    // Supprimer une pièce jointe
    const removeAttachment = (index: number) => {
        const newAttachments = [...attachments]
        newAttachments.splice(index, 1)
        setAttachments(newAttachments)
        setValue("fileAttachment", newAttachments, {
            shouldValidate: true,
            shouldDirty: true,
            shouldTouch: true,
        })
    }

    return (
        <div className="w-full">
            <Form className="w-full" onSubmit={handleSubmit(onCreateDemande)}>
                <h3 className="font-bold mb-4">Création de Demande</h3>
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <div className="border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 gap-4 flex flex-col flex-auto bg-[#FFFFFF] px-4 py-7">
                        <PdfUpload ref={pdfUploadRef} onUploadFile={onUploadFile} />
                        {errors.file && <p className="text-sm text-red-500">{errors.file.message}</p>}
                        <h6 className="text-base">Titre</h6>
                        <Controller
                            name="titre"
                            control={control}
                            render={({ field }) => <Input type="text" placeholder="Saisir le texte" autoComplete="off" {...field} />}
                        />
                        {errors.titre && <p className="text-sm text-red-500">{errors.titre.message}</p>}
                        <h6 className="text-base">Description</h6>
                        <Controller
                            name="description"
                            control={control}
                            render={({ field }) => <Textarea placeholder="Saisir la description" autoComplete="off" {...field} />}
                        />
                        {/*{errors.description && <p className="text-sm text-red-500">{errors.description.message}</p>}*/}

                        {/* Ajout du composant de pièces jointes */}
                        <h6 className="text-base">Pièces jointes</h6>
                        <AttachMultipleFile onChange={handleAttachmentsChange} value={attachments} />

                        {/* Affichage des pièces jointes sélectionnées */}
                        {attachments.length > 0 && (
                            <div className="mt-2 space-y-2">
                                <div className="rounded-md border">
                                    {attachments.map((file, index) => (
                                        <div
                                            key={`${file.name}-${index}`}
                                            className="flex items-center justify-between p-2 border-b last:border-b-0"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <File className="h-4 w-4 text-muted-foreground" />
                                                <span className="text-sm truncate max-w-[300px]">{file.name}</span>
                                                <span className="text-xs text-muted-foreground">
                          ({(file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                                            </div>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => removeAttachment(index)}>
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <MultiSelect
                            options={signatairesOptions}
                            selected={selectedSignataire}
                            titre="Choisir un ou plusieurs signataires"
                            onChange={onChangeSignataires}
                        />
                        {errors.signataires && <p className="text-sm text-red-500">{errors.signataires.message}</p>}

                        <MultiSelect
                            options={approbateursOptions}
                            selected={selectedApprobateur}
                            titre="Choisir un ou plusieurs approbateurs"
                            onChange={onChangeApprobateur}
                        />
                        {errors.approbateurs && <p className="text-sm text-red-500">{errors.approbateurs.message}</p>}

                        <MultiSelect
                            options={ampliateurOptions}
                            selected={selectedAmpliateurs}
                            titre="Choisir un ou plusieurs ampliateurs"
                            onChange={onChangeAmpliateurs}
                        />
                        {errors.ampliateurs && <p className="text-sm text-red-500">{errors.ampliateurs.message}</p>}

                        <div className="space-x-2">
                            <h6 className="text-base">Priorité</h6>
                            <RadioGroup
                                id="priority"
                                value={formValues.priority}
                                onValueChange={onPriorityChange}
                                className="flex flex-row pt-3 space-x-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="FAIBLE" id="faible" />
                                    <Label htmlFor="faible" className="font-normal">
                                        Faible
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="MOYENNE" id="moyenne" />
                                    <Label htmlFor="moyenne" className="font-normal">
                                        Moyenne
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="HAUTE" id="haute" />
                                    <Label htmlFor="haute" className="font-normal">
                                        Haute
                                    </Label>
                                </div>
                            </RadioGroup>
                            {errors.priority && <p className="text-sm text-red-500">{errors.priority.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <h6 className="text-base mb-3">Date d&apos;échéance</h6>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="deadline"
                                        variant={"outline"}
                                        className={cn(
                                            "w-full justify-start text-left font-normal",
                                            !formValues.dateLimite && "text-muted-foreground",
                                        )}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {formValues.dateLimite ? (
                                            format(formValues.dateLimite, "dd MMMM yyyy", { locale: fr })
                                        ) : (
                                            <span>Sélectionner une date</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={formValues.dateLimite}
                                        onSelect={onDateLimiteChange}
                                        initialFocus
                                        locale={fr}
                                        fromDate={today}
                                        disabled={(date) => isBefore(date, today)}
                                    />
                                </PopoverContent>
                            </Popover>
                            {formValues.dateLimite && (
                                <p className="text-sm text-muted-foreground">
                                    Vous avez sélectionné: {format(formValues.dateLimite, "EEEE dd MMMM yyyy", { locale: fr })}
                                </p>
                            )}
                            {errors.dateLimite && <p className="text-sm text-red-500">{errors.dateLimite.message}</p>}
                        </div>
                    </div>
                    <div className="border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 md:w-2/4 gap-4 flex flex-col bg-[#FFFFFF]">
                        <WebViewerPdf file={fileUpload} />
                    </div>
                </div>
                <div className="fixed bottom-0 left-0 right-0 z-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4">
                    <div className="flex justify-end gap-3 px-8">
                        <span></span>
                        <ButtonDefault
                            type="button"
                            onClick={handleReset}
                            icon={<PiTrash />}
                            className="border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500 hover:border-red-500 hover:ring-0"
                        >
                            Annuler
                        </ButtonDefault>
                        <ButtonDefault
                            loading={isSubmitting}
                            variant="solid"
                            type="submit"
                            disabled={isSubmitting || !formState.isDirty}
                            className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white hover:border-none hover:ring-0"
                        >
                            Envoyer
                        </ButtonDefault>
                    </div>
                </div>
            </Form>
        </div>
    )
}

export default CreateDemandeView

