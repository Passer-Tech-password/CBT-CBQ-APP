import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

/**
 * Utility to export a DOM element as a professional PDF result report
 * @param elementId The ID of the HTML element to export
 * @param fileName The name of the downloaded file
 */
export const exportToPDF = async (elementId: string, fileName: string = "CBT-Result-Report.pdf") => {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    // 1. Setup high-quality canvas
    const canvas = await html2canvas(element, {
      scale: 3, // Very high quality for professional look
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      windowWidth: 1200, // Fixed width for consistent layout
    })

    const imgData = canvas.toDataURL("image/png", 1.0)
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
      compress: true,
    })

    // A4 dimensions in mm
    const pdfWidth = 210
    const pdfHeight = 297

    // Calculate image dimensions to fit A4 width
    const imgWidth = pdfWidth
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    let heightLeft = imgHeight
    let position = 0

    // 2. Add content to PDF, handling multiple pages if needed
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
    heightLeft -= pdfHeight

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight, undefined, 'FAST')
      heightLeft -= pdfHeight
    }

    // 3. Save the PDF
    pdf.save(fileName)
    return true
  } catch (error) {
    console.error("PDF generation failed:", error)
    return false
  }
}
