"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import type { PdfDownloadButton } from '@/components/pdf-download-button'

interface PdfButtonProps {
    nombre: string
    votos: Record<string, string>
}

export function PdfButton({ nombre, votos }: PdfButtonProps) {
    const [PDFDownload, setPDFDownload] = useState<typeof PdfDownloadButton | null>(null)

    useEffect(() => {
        import('@/components/pdf-download-button').then((module) => {
            setPDFDownload(() => module.PdfDownloadButton)
        })
    }, [])

    if (!PDFDownload) {
        return (
            <Button disabled>
                Cargando PDF...
            </Button>
        )
    }

    const PdfComponent = PDFDownload
    return <PdfComponent nombre={nombre} votos={votos} />
} 