"use client";

import { useRef, useState, useEffect } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { Button } from "@/components/ui/button";
import { Printer, Download } from "lucide-react";

interface PrintAndPdfButtonsProps {
  contentId: string;
  fileName?: string;
}

export default function PrintAndPdfButtons({
  contentId,
  fileName = "document",
}: PrintAndPdfButtonsProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [isPrinting, setIsPrinting] = useState(false);
  const promiseResolveRef = useRef<() => void | null>(null);

  useEffect(() => {
    if (isPrinting && promiseResolveRef.current) {
      promiseResolveRef.current();
    }
  }, [isPrinting]);

  const handlePrint = useReactToPrint({
    contentRef,
    documentTitle: fileName,
    onBeforePrint: () => {
      return new Promise<void>((resolve) => {
        const node = document.getElementById(contentId);
        if (node) contentRef.current = node as HTMLDivElement;

        promiseResolveRef.current = resolve;
        setIsPrinting(true);
      });
    },
    onAfterPrint: () => {
      promiseResolveRef.current = null;
      setIsPrinting(false);
    },
  });

  const handleDownloadPdf = async () => {
    const input = document.getElementById(contentId);
    if (!input) return;

    const canvas = await html2canvas(input, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`${fileName}.pdf`);
  };

  return (
    <>
      {/* Hidden from print view */}
      <div className="flex gap-4 print:hidden">
        <Button
          className="bg-gray-500 hover:bg-gray-600 !px-3 !py-0 text-xs font-medium transition-colors duration-300"
          onClick={handlePrint}
        >
          <Printer size="5" />
          Print
        </Button>
        <Button
          className="bg-gray-500 hover:bg-gray-600 !px-3 !py-0 text-xs font-medium transition-colors duration-300"
          onClick={handleDownloadPdf}
        >
          <Download size="5" />
          PDF
        </Button>
      </div>

      {/* Inline global print styling */}
      <style>
        {`@media print {
                body {
                margin: 0;
                padding: 10px;
                background: white;
                }

                #${contentId} {
                margin: 0 auto !important;
                width: 100%; 
                min-height: 100%; 
                font-size: 14pt;
                background-color: #ffffff;
                box-sizing: border-box;
                }

                .print\\:hidden {
                display: none !important;
                }
            }`}
      </style>
    </>
  );
}
