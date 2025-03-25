"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/shadcn-ui/card"
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js'
import { Bar } from "react-chartjs-2"

// Enregistrer les composants Chart.js nécessaires
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface DocumentsChartProps {
    showLegend?: boolean
    height?: number
}

export function DocumentsChart({ showLegend = false, height = 250 }: DocumentsChartProps) {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Données simulées pour le graphique
    const labels = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil"]

    const data = {
        labels,
        datasets: [
            {
                label: "Documents signés",
                data: [65, 59, 80, 81, 56, 55, 40],
                backgroundColor: "rgba(53, 162, 235, 0.8)",
                borderRadius: 4,
            },
            {
                label: "Documents en attente",
                data: [28, 32, 27, 30, 23, 34, 29],
                backgroundColor: "rgba(255, 159, 64, 0.8)",
                borderRadius: 4,
            },
            {
                label: "Documents en retard",
                data: [5, 8, 6, 4, 3, 7, 10],
                backgroundColor: "rgba(255, 99, 132, 0.8)",
                borderRadius: 4,
            },
        ],
    }

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: showLegend,
                position: "top" as const,
            },
            tooltip: {
                backgroundColor: "hsl(var(--background))",
                titleColor: "hsl(var(--foreground))",
                bodyColor: "hsl(var(--foreground))",
                borderColor: "hsl(var(--border))",
                borderWidth: 1,
                padding: 10,
                cornerRadius: 6,
                boxPadding: 3,
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
            },
            y: {
                grid: {
                    tickBorderDash: [3, 3],
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
        <div style={{ height: `${height}px`, width: "100%" }}>
            <Bar data={data} options={options} />
        </div>
    )
}

