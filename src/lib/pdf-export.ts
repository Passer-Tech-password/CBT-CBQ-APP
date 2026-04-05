import { jsPDF } from "jspdf"
import html2canvas from "html2canvas"

/**
 * Utility to export a DOM element as a PDF
 * @param elementId The ID of the HTML element to export
 * @param fileName The name of the downloaded file
 */
export const exportToPDF = async (elementId: string, fileName: string = "result-report.pdf") => {
  const element = document.getElementById(elementId)
  if (!element) return

  try {
    const canvas = await html2canvas(element, {
      scale: 2, // Higher quality
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
    })

    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    const imgWidth = 210 // A4 width in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    
    // If the image is longer than one page, we could add multiple pages, 
    // but for simple results, one long page or standard A4 usually suffices.
    // For now, let's stick to standard A4 and scale accordingly or add pages if needed.
    
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
    heightLeft -= 297 // A4 height

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= 297
    }

    pdf.save(fileName)
    return true
  } catch (error) {
    console.error("PDF generation failed:", error)
    return false
  }
}
