"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import dynamic from 'next/dynamic'

interface PdfButtonProps {
    nombre: string
    votos: Record<string, string>
}

// Componente del documento PDF cargado dinámicamente
const PdfDocument = dynamic(() => import('./pdf-document'), {
    ssr: false,
    loading: () => <Button disabled>Cargando PDF...</Button>
})

export const PdfButton = ({ nombre, votos }: PdfButtonProps) => {
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    if (!isClient) {
        return <Button disabled>Cargando PDF...</Button>
    }

    return <PdfDocument nombre={nombre} votos={votos} />
} 