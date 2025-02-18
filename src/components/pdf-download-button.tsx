"use client"

import { PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from "@/components/ui/button"
import { PdfDocument } from '@/components/pdf-document'
import globosData from "@/data/globos.json"

interface PdfDownloadButtonProps {
    nombre: string
    votos: Record<string, string>
}

export function PdfDownloadButton({ nombre, votos }: PdfDownloadButtonProps) {
    const handleBeforeDownload = () => {
        const totalCategorias = [
            ...Object.keys(globosData.television),
            ...Object.keys(globosData.cine)
        ]
        
        const categoriasSinVotar = totalCategorias.filter(
            categoria => !votos[categoria]
        )

        if (categoriasSinVotar.length > 0) {
            const mensaje = `Hay ${categoriasSinVotar.length} categorías sin votar:\n\n${
                categoriasSinVotar.map(cat => cat.replace(/_/g, " ")).join("\n")
            }\n\n¿Deseas continuar con la generación del PDF?`

            return window.confirm(mensaje)
        }

        return true
    }

    return (
        <PDFDownloadLink
            document={<PdfDocument nombre={nombre} votos={votos} />}
            fileName={`globos-de-oro-2025-${nombre.toLowerCase().replace(/\s+/g, '-')}.pdf`}
            onClick={(event) => {
                if (!handleBeforeDownload()) {
                    event.preventDefault()
                }
            }}
        >
            <Button>
                Exportar PDF
            </Button>
        </PDFDownloadLink>
    )
}