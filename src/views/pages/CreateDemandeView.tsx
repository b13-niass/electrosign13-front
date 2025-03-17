import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z, ZodType } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod';
import { Form } from '@/components/ui/Form'
import type { CommonProps } from '@/@types/common'
import useTimeOutMessage from '@/utils/hooks/useTimeOutMessage'
import DemandeService from '@/services/DemandeService'
import { PdfUpload } from '@/components/ui/PdfUpload'
import { MultiSelect, Option } from '@/components/ui/MultiSelect'
import { Label } from '@radix-ui/react-label'
import { RadioGroup, RadioGroupItem } from '@/components/shadcn-ui/radio-group'
import { format, isBefore, startOfToday } from 'date-fns'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/shadcn-ui/popover'
import { Button } from '@/components/shadcn-ui/button'
import { Button as ButtonDefault } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { CalendarIcon } from 'lucide-react'
import { Calendar } from '@/components/shadcn-ui/calendar'
import { fr } from 'date-fns/locale'
import { PiTrash, PiTrashDuotone } from 'react-icons/pi'

interface CreateDemandeFormProps extends CommonProps {
    disableSubmit?: boolean
    setMessage?: (message: string) => void
}

type CreateDemandeFormSchema = {
    file: File,
    signataires: string[],
    approbateurs: string[],
    priorite: "faible" | "moyenne" | "urgente",
    dateLimite: Date,
}

const formSchema: ZodType<CreateDemandeFormSchema> = z.object({
    file: z.instanceof(File),
    signataires: z.array(z.string()).min(1, "Au moins un signataire est requis"),
    approbateurs: z.array(z.string()).min(1, "Au moins un approbateur est requis"),
    priorite: z.enum(["faible", "moyenne", "urgente"]),
    dateLimite: z.date({
        required_error: "Une date limite est requise",
    }),
});
const CreateDemandeView = () => {
    const [fileUpload, setFileUpload] = useState<File>()
    const [isSubmitting, setSubmitting] = useState<boolean>(false)
    const [disableSubmit, setDisableSubmit] = useState<boolean>(false)
    const [message, setMessage] = useTimeOutMessage()
    const [priority, setPriority] = useState<string>("moyenne")
    const [date, setDate] = React.useState<Date>()
    const today = startOfToday()
    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<CreateDemandeFormSchema>({
        defaultValues: {
            file: undefined as File | undefined,
            signataires: [],
            approbateurs: [],
            priorite: "moyenne",
            dateLimite: new Date(),
        },
        resolver: zodResolver(formSchema),
    })


    const onCreateDemande = async (values: CreateDemandeFormSchema) => {
        const { signataires, approbateurs, dateLimite, priorite} = values

        if (!disableSubmit) {
            setSubmitting(true)
            const result = await DemandeService.create({ file: fileUpload!, signataires, approbateurs, priorite, dateLimite })
            if (result?.status === 'KO') {
                setMessage?.(result.message)
            }
        }
        setSubmitting(false)
    }

    const onUploadFile = (file: File) => {
        setFileUpload(file);
        console.log(file);
    }

    const options: Option[] = [
        { label: "Frequent Shoppers", value: "frequent-shoppers" },
        { label: "Inactive", value: "inactive" },
        { label: "New Customers", value: "new-customers" },
        { label: "VIP", value: "vip" },
        { label: "Subscribers", value: "subscribers" },
        { label: "High Spenders", value: "high-spenders" },
    ]

    const [selected, setSelected] = useState<string[]>(["frequent-shoppers", "inactive"])

    return (
        <div className="w-full">
            {/*<div>*/}
            {/*    <h1 className="text-2xl font-bold text-gray-800 dark:text-white">*/}
            {/*        Création d'une demande*/}
            {/*    </h1>*/}
            {/*</div>*/}
            <Form className="w-full"
                  onSubmit={handleSubmit(onCreateDemande)}>
                <h3 className="font-bold mb-4">
                    Création de Demande
                </h3>
                <div className="w-full flex flex-col md:flex-row gap-4">
                    <div className="border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                     gap-4 flex flex-col flex-auto bg-[#FFFFFF] px-4 py-7">
                        <PdfUpload onUploadFile={onUploadFile} />

                        <MultiSelect options={options} selected={selected} titre="Choisir un des signataire"
                                     onChange={setSelected} />
                        <MultiSelect options={options} selected={selected} titre="Choisir un des Approbateur"
                                     onChange={setSelected} />
                        <div className="space-x-2">
                            <h5 className="text-base">
                                Priorité
                            </h5>
                            <RadioGroup
                                id="priority"
                                value={priority}
                                onValueChange={setPriority}
                                className="flex flex-row pt-3 space-x-1"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="faible" id="faible" />
                                    <Label htmlFor="faible" className="font-normal">
                                        Faible
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="moyenne" id="moyenne" />
                                    <Label htmlFor="moyenne" className="font-normal">
                                        Moyenne
                                    </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="haute" id="haute" />
                                    <Label htmlFor="haute" className="font-normal">
                                        Haute
                                    </Label>
                                </div>
                            </RadioGroup>
                        </div>
                        <div className="space-y-2">
                            <h5 className="text-base mb-3">
                                Date d'échéance
                            </h5>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        id="deadline"
                                        variant={"outline"}
                                        className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {date ? format(date, "dd MMMM yyyy", { locale: fr }) :
                                            <span>Sélectionner une date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                    <Calendar
                                        mode="single"
                                        selected={date}
                                        onSelect={setDate}
                                        initialFocus
                                        locale={fr}
                                        fromDate={today}
                                        disabled={(date) => isBefore(date, today)}
                                    />
                                </PopoverContent>
                            </Popover>
                            {date && (
                                <p className="text-sm text-muted-foreground">
                                    Vous avez sélectionné: {format(date, "EEEE dd MMMM yyyy", { locale: fr })}
                                </p>
                            )}
                        </div>
                    </div>
                    <div className="border rounded-2xl border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800
                     md:w-2/4 gap-4 flex flex-col bg-[#FFFFFF]">
                        La
                    </div>
                </div>
                <div
                    className="fixed bottom-0 left-0 right-0 z-3 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 py-4">

                        <div className="flex justify-end gap-3 px-8">
                            <span></span>
                            <ButtonDefault icon={<PiTrash/>} className="border-2 border-red-500 text-red-500 hover:bg-red-50 hover:text-red-500 hover:border-red-500 hover:ring-0">Annuler</ButtonDefault>
                            <ButtonDefault className="bg-blue-500 text-white hover:bg-blue-400 hover:text-white hover:border-none hover:ring-0">Envoyer</ButtonDefault>
                        </div>
                    </div>
            </Form>
        </div>
    );
}

export default CreateDemandeView