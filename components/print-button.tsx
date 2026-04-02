'use client'
import { Printer } from 'lucide-react'
export function PrintButton() {
    return (
        <button className="pill cvPrintBtn" onClick={() => window.print()}>
            <Printer size={16} />
            <span>Print / Save PDF</span>
        </button>
    )
}
