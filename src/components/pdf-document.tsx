"use client"

import { useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 30
    },
    section: {
        margin: 10,
        padding: 10,
    },
    title: {
        fontSize: 24,
        marginBottom: 10,
    },
    subtitle: {
        fontSize: 18,
        marginBottom: 10,
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
    }
})

interface PdfDocumentProps {
    nombre: string
    votos: Record<string, string>
}


const MyDocument = ({ nombre, votos }: PdfDocumentProps) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.title}>Premios Oscar 2025</Text>
                <Text style={styles.subtitle}>Votante: {nombre}</Text>
                {Object.entries(votos).map(([categoria, seleccion]) => (
                    <Text key={categoria} style={styles.text}>
                        {categoria.replace(/_/g, " ")}: {seleccion}
                    </Text>
                ))}
            </View>
        </Page>
    </Document>
)

export const PdfDocument = ({ nombre, votos }: PdfDocumentProps) => {
    const fileName = useMemo(() => 
        `oscar-2025-${nombre.toLowerCase().replace(/\s+/g, "-")}.pdf`,
        [nombre]
    )

    return (
        <PDFDownloadLink
            document={<MyDocument nombre={nombre} votos={votos} />}
            fileName={fileName}
        >
            <Button>
                Exportar a PDF
            </Button>
        </PDFDownloadLink>
    )
} 