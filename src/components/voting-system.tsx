"use client"

import { useState, useEffect } from "react"
// import Image from "next/image"
import { ModeToggle } from "@/components/mode-toggle"
import oscarsData from "@/data/oscars.json"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PdfButton } from '@/components/pdf-button'
import detallesOscars from "@/data/detallesOscars.json"

// interface Nominee {
//     nombre: string
//     imagen: string
// }

const STORAGE_KEYS = {
    VOTOS: 'globos_oro_votos',
    NOMBRE: 'globos_oro_nombre'
} as const

// const createJustWatchUrl = (nombre: string) => {
//     // Limpiamos el nombre de caracteres especiales y roles
//     const cleanName = nombre.split('–')[0].trim() // Remueve el rol/película después del guión
//         .normalize("NFD")
//         .replace(/[\u0300-\u036f]/g, "") // Remueve acentos
//         .replace(/[^a-zA-Z0-9\s]/g, "") // Solo deja letras, números y espacios
    
//     return `https://justwatch.com/mx/buscar?q=${encodeURIComponent(cleanName)}`
// }

export default function VotingSystem() {
    const [votos, setVotos] = useState<Record<string, string>>({})
    const [nombre, setNombre] = useState("")
    const [selectedCategory, setSelectedCategory] = useState<string>("Mejor_Pelicula")

    // Ensure data is consistent between server and client
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

    // Actualizar handleVote para guardar en localStorage
    const handleVote = (categoria: string, seleccion: string) => {
        const newVotos = {
            ...votos,
            [categoria]: seleccion
        }
        setVotos(newVotos)
        // Guardar en localStorage
        localStorage.setItem(STORAGE_KEYS.VOTOS, JSON.stringify(newVotos))
    }

    const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedCategory(event.target.value)
    }

    const handleClearVotes = () => {
        setVotos({})
        localStorage.removeItem(STORAGE_KEYS.VOTOS)
        window.location.reload()
    }

    // También guardar el nombre cuando cambie
    const handleNombreChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newNombre = e.target.value
        setNombre(newNombre)
        localStorage.setItem(STORAGE_KEYS.NOMBRE, newNombre)
    }

    const renderCategoriaCards = (categoria: string) => {
        const nominees = oscarsData.Premios_Oscar_2025[categoria as keyof typeof oscarsData.Premios_Oscar_2025]
        if (!Array.isArray(nominees)) return null

        return (
            <div key={categoria} className="mb-8">
                <h2 className="text-2xl font-bold mb-4 capitalize">
                    {categoria.replace(/_/g, " ")}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {nominees.map((nominee: string) => (
                        <Card key={`${categoria}-${nominee}`} className="overflow-hidden">
                            {/* <div className="aspect-video bg-muted relative overflow-hidden group">
                                <div className="flex items-center justify-center h-full group-hover:bg-muted-foreground/5">
                                    <span className="text-muted-foreground">Sin imagen</span>
                                </div>
                            </div> */}
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {nominee}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Button
                                    variant={votos[categoria] === nominee ? "default" : "outline"}
                                    className="w-full"
                                    onClick={() => handleVote(categoria, nominee)}
                                >
                                    {votos[categoria] === nominee ? "Votado" : "Votar"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        )
    }

    // Obtener el total de categorías y votos realizados
    const totalCategorias = Object.keys(oscarsData.Premios_Oscar_2025).length
    const votosRealizados = Object.keys(votos).length

    return (
        <div className="min-h-screen p-4 md:p-8 flex flex-col">
            <div className="max-w-7xl mx-auto flex-1 w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start mb-8">
                    <div>
                        <div className="flex justify-between items-center mb-4">
                            <h1 className="text-4xl font-bold text-primary">Premios Oscar 2025</h1>
                            <ModeToggle />
                        </div>
                        <Input
                            placeholder="Ingresa tu nombre"
                            value={nombre}
                            onChange={handleNombreChange}
                            className="max-w-md mb-4"
                        />
                        <select value={selectedCategory} onChange={handleCategoryChange} className="p-2 border rounded">
                            <option value="all">Todas las categorías</option>
                            {Object.keys(oscarsData.Premios_Oscar_2025).map(categoria => (
                                <option key={categoria} value={categoria}>
                                    {categoria.replace(/_/g, " ")}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="p-4 border rounded bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-center">
                        <h3 className="text-lg font-bold mb-2">Detalles Adicionales</h3>
                        <p><strong>Fecha:</strong> {detallesOscars.Detalles_Adicionales.Fecha_Ceremonia}</p>
                        <p><strong>Lugar:</strong> {detallesOscars.Detalles_Adicionales.Lugar}</p>
                        <p><strong>Conductor:</strong> {detallesOscars.Detalles_Adicionales.Conductor}</p>
                        <h4 className="mt-2 font-bold">Nominaciones Destacadas:</h4>
                        <ul className="list-disc list-inside">
                            {Object.entries(detallesOscars.Detalles_Adicionales.Nominaciones_Destacadas).map(([pelicula, nominaciones]) => (
                                <li key={pelicula}>{pelicula.replace(/_/g, " ")}: {nominaciones}</li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="space-y-12">
                    {selectedCategory === "all"
                        ? Object.keys(oscarsData.Premios_Oscar_2025).map(categoria =>
                            renderCategoriaCards(categoria)
                        )
                        : renderCategoriaCards(selectedCategory)
                    }
                </div>

                <div className="mt-12 bg-card p-6 rounded-lg">
                    <div className="flex justify-between items-center mb-4">
                        <div className="space-y-2">
                            <h2 className="text-2xl font-bold">Resumen de votos</h2>
                            <div className="space-y-1">
                                {nombre && (
                                    <p className="text-muted-foreground">
                                        Votante: {nombre}
                                    </p>
                                )}
                                <p className="text-muted-foreground">
                                    Progreso: {votosRealizados}/{totalCategorias} categorías votadas
                                </p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            {/* Separar los botones */}
                            {Object.keys(votos).length > 0 && (
                                <>
                                    <PdfButton nombre={nombre} votos={votos} />
                                    <Button 
                                        onClick={handleClearVotes}
                                        variant="destructive" 
                                        className="w-full md:w-auto"
                                    >
                                        Reiniciar Votos
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>

                    <ScrollArea className="h-[400px] rounded-md border">
                        <div className="p-4">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        <th colSpan={3} className="text-left p-2 pb-4">
                                            <div className="text-lg font-bold">
                                                Premios Oscar 2025
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
                                                {Object.keys(oscarsData.Premios_Oscar_2025).includes(categoria) ? "CINE" : "TV"}
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