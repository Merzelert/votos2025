"use client"

import { useState, useEffect } from "react"
// import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import globosData from "@/data/globos.json"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PdfButton } from '@/components/pdf-button'

interface Nominee {
    nombre: string
    imagen: string
}

const STORAGE_KEYS = {
    VOTOS: 'globos_oro_votos',
    NOMBRE: 'globos_oro_nombre'
} as const

export default function VotingSystem() {
    const [votos, setVotos] = useState<Record<string, string>>({})
    const [nombre, setNombre] = useState("")

    // Cargar datos guardados al iniciar
    useEffect(() => {
        const savedVotos = localStorage.getItem(STORAGE_KEYS.VOTOS)
        const savedNombre = localStorage.getItem(STORAGE_KEYS.NOMBRE)

        if (savedVotos) {
            try {
                setVotos(JSON.parse(savedVotos))
            } catch (error) {
                console.error('Error al cargar votos:', error)
            }
        }

        if (savedNombre) {
            setNombre(savedNombre)
        }
    }, [])

    // Guardar votos cuando cambien
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.VOTOS, JSON.stringify(votos))
    }, [votos])

    // Guardar nombre cuando cambie
    useEffect(() => {
        localStorage.setItem(STORAGE_KEYS.NOMBRE, nombre)
    }, [nombre])

    const handleVote = (categoria: string, seleccion: string) => {
        setVotos(prev => ({
            ...prev,
            [categoria]: seleccion
        }))
    }

    const handleExportPDF = () => {
        if (!nombre) {
            alert('Por favor, ingresa tu nombre antes de exportar el PDF')
            return
        }

        if (Object.keys(votos).length === 0) {
            alert('No hay votos para exportar')
            return
        }
    }

    const renderCategoriaCards = (seccion: "television" | "cine", categoria: string) => {
        const nominees = globosData[seccion][categoria as keyof typeof globosData[typeof seccion]]
        if (!Array.isArray(nominees)) return null

        return (
            <div key={`${seccion}-${categoria}`} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 capitalize">
                    {categoria.replace(/_/g, " ")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nominees.map((nominee: Nominee) => (
                        <Card key={`${categoria}-${nominee.nombre}`} className="overflow-hidden">
                            {/* <div className="aspect-video bg-muted relative overflow-hidden">
                                {nominee.imagen ? (
                                    <Image
                                        src={nominee.imagen}
                                        alt={nominee.nombre}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        priority={false}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full">
                                        <span className="text-muted-foreground">Sin imagen</span>
                                    </div>
                                )}
                            </div> */}
                            <CardHeader>
                                <CardTitle className="text-lg">{nominee.nombre}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant={votos[categoria] === nominee.nombre ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => handleVote(categoria, nominee.nombre)}
                                >
                                    {votos[categoria] === nominee.nombre ? "Votado" : "Votar"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto flex-1 w-full">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-4xl font-bold">Globos de Oro 2025</h1>
                    <ModeToggle />
                </div>

                <div className="mb-8">
                    <Input
                        placeholder="Ingresa tu nombre"
                        value={nombre}
                        onChange={(e) => setNombre(e.target.value)}
                        className="max-w-md"
                    />
                </div>

                <div className="space-y-12">
                    <section>
                        <h2 className="text-3xl font-bold mb-6">Televisión</h2>
                        {Object.keys(globosData.television).map(categoria =>
                            renderCategoriaCards("television", categoria)
                        )}
                    </section>

                    <section>
                        <h2 className="text-3xl font-bold mb-6">Cine</h2>
                        {Object.keys(globosData.cine).map(categoria =>
                            renderCategoriaCards("cine", categoria)
                        )}
                    </section>
                </div>

                <div className="mt-12 bg-card p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Resumen de votos</h2>
                            {nombre && (
                                <p className="text-muted-foreground">
                                    Votante: {nombre}
                                </p>
                            )}
                        </div>
                        <PdfButton nombre={nombre} votos={votos} />
                    </div>

                    <ScrollArea className="h-[400px] rounded-md border">
                        <div className="p-4">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th colSpan={3} className="text-left p-2 pb-4">
                                            <div className="text-lg font-bold">
                                                Globos de Oro 2025
                                                {nombre && (
                                                    <span className="block text-sm font-normal text-muted-foreground mt-1">
                                                        Votante: {nombre}
                                                    </span>
                                                )}
                                            </div>
                                        </th>
                                    </tr>
                                    <tr className="border-t">
                                        <th className="text-left p-2 w-[10%]">Tipo</th>
                                        <th className="text-left p-2 w-[45%]">Categoría</th>
                                        <th className="text-left p-2 w-[45%]">Selección</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(votos).map(([categoria, seleccion]) => (
                                        <tr key={`resumen-${categoria}`} className="border-t">
                                            <td className="p-2">
                                                {Object.keys(globosData.television).includes(categoria) ? "TV" : "CINE"}
                                            </td>
                                            <td className="p-2 capitalize">{categoria.replace(/_/g, " ")}</td>
                                            <td className="p-2">{seleccion}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <footer className="mt-16 pb-4 text-center text-sm text-muted-foreground">
                <p>
                    Creado por{" "}
                    <a
                        href="https://www.linkedin.com/in/erik-retana-webdev/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium underline underline-offset-4 hover:text-primary"
                    >
                        Erik Retana Dev
                    </a>{" "}
                    en Next.js
                </p>
            </footer>
        </div>
    )
} 