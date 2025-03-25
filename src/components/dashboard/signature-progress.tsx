"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/shadcn-ui/card"
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js"
import { Doughnut } from "react-chartjs-2"

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(ArcElement, Tooltip, Legend)

interface SignatureProgressProps {
    stats: {
        signedPercentage: number
        pendingPercentage: number
        latePercentage: number
    }
}

export function SignatureProgress({ stats }: SignatureProgressProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    const data = {
        labels: ["Documents signés", "Documents en attente", "Documents en retard"],
        datasets: [
            {
                data: [stats.signedPercentage, stats.pendingPercentage, stats.latePercentage],
                backgroundColor: ["rgba(53, 162, 235, 0.8)", "rgba(255, 159, 64, 0.8)", "rgba(255, 99, 132, 0.8)"],
                borderColor: ["rgba(53, 162, 235, 1)", "rgba(255, 159, 64, 1)", "rgba(255, 99, 132, 1)"],
                borderWidth: 1,
            },
        ],
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "60%",
        plugins: {
            legend: {
                position: "bottom" as const,
                labels: {
                    padding: 20,
                    usePointStyle: true,
                    pointStyle: "circle",
                    font: {
                        size: 12,
                    },
                    generateLabels: (chart: any) => {
                        const data = chart.data
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label: string, i: number) => {
                                const meta = chart.getDatasetMeta(0)
                                const style = meta.controller.getStyle(i)

                                return {
                                    text: `${label}: ${data.datasets[0].data[i]}%`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    strokeStyle: data.datasets[0].borderColor[i],
                                    lineWidth: style.borderWidth,
                                    hidden: false,
                                    index: i,
                                }
                            })
                        }
                        return []
                    },
                },
            },
            tooltip: {
                backgroundColor: "hsl(var(--background))",
                titleColor: "hsl(var(--foreground))",
                bodyColor: "hsl(var(--foreground))",
                borderColor: "hsl(var(--border))",
                borderWidth: 1,
                padding: 10,
                borderRadius: 6,
                boxPadding: 3,
                callbacks: {
                    label: (context: any) => `${context.label}: ${context.raw}%`,
                },
            },
        },
    }

    if (!mounted) {
        return (
            <Card className="w-full h-[250px] flex items-center justify-center">
                <div className="text-muted-foreground">Chargement du graphique...</div>
            </Card>
        )
    }

    return (
        <div className="h-[250px] w-full">
            <Doughnut data={data} options={options} />
        </div>
    )
}

