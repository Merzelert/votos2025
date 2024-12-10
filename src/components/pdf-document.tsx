"use client"

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'
import globosData from "@/data/globos.json"

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#ffffff',
        padding: 30
    },
    header: {
        marginBottom: 20,
        borderBottom: 1,
        borderBottomColor: '#666',
        paddingBottom: 10
    },
    title: {
        fontSize: 20,
        marginBottom: 5
    },
    voter: {
        fontSize: 12,
        color: '#666',
        marginBottom: 10
    },
    table: {
        display: 'flex',
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        marginBottom: 20
    },
    tableRow: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#bfbfbf',
        minHeight: 30,
        alignItems: 'center'
    },
    tableHeader: {
        backgroundColor: '#f0f0f0'
    },
    typeCell: {
        width: '10%',
        padding: 6,
        fontSize: 10
    },
    categoryCell: {
        width: '45%',
        padding: 6,
        fontSize: 10
    },
    selectionCell: {
        width: '45%',
        padding: 6,
        fontSize: 10
    },
    footer: {
        position: 'absolute',
        bottom: 30,
        left: 30,
        right: 30,
        textAlign: 'center',
        color: '#666',
        fontSize: 10
    }
})

interface PdfDocumentProps {
    nombre: string
    votos: Record<string, string>
}

export function PdfDocument({ nombre, votos }: PdfDocumentProps) {
    const getType = (categoria: string) => {
        return Object.keys(globosData.television).includes(categoria) ? "TV" : "CINE"
    }

    return (
        <Document>
            <Page size="A4" style={styles.page}>
                <View style={styles.header}>
                    <Text style={styles.title}>Globos de Oro 2025</Text>
                    {nombre && <Text style={styles.voter}>Votante: {nombre}</Text>}
                </View>

                <View style={styles.table}>
                    <View style={[styles.tableRow, styles.tableHeader]}>
                        <Text style={styles.typeCell}>Tipo</Text>
                        <Text style={styles.categoryCell}>Categoría</Text>
                        <Text style={styles.selectionCell}>Selección</Text>
                    </View>
                    {Object.entries(votos).map(([categoria, seleccion], index) => (
                        <View key={index} style={styles.tableRow}>
                            <Text style={styles.typeCell}>
                                {getType(categoria)}
                            </Text>
                            <Text style={styles.categoryCell}>
                                {categoria.replace(/_/g, " ")}
                            </Text>
                            <Text style={styles.selectionCell}>{seleccion}</Text>
                        </View>
                    ))}
                </View>

                <Text style={styles.footer}>
                    Creado por Erik Retana Dev en Next.js
                </Text>
            </Page>
        </Document>
    )
} 