import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

interface FormValues {
  selectedDescription: string;
  notes: string;
  reporterName?: string;
  locationOfStructure?: string;
  locationOther?: string;
  siteAccess?: string;
  customerNotes?: string;
  isPowerIsolated?: string;
  propertyType?: string;
  ageOfProperty?: string;
  propertyCondition?: string;
  constructionType?: string;
  roofServices?: string[];
  assets: any[];
  finalPlan?: FileList;
  finalTakeoff?: FileList;
  powerIsolationImage?: FileList;
}

interface PDFExportWithImagesProps {
  formData: FormValues;
  className?: string;
}

const PDFExportWithImages: React.FC<PDFExportWithImagesProps> = ({ formData, className = "" }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfType, setPdfType] = useState<'text' | 'images'>('images'); // Default to images now

  const generatePDF = async () => {
    setIsGenerating(true);
    
    try {
      if (pdfType === 'images') {
        await generatePDFWithImages();
      } else {
        await generateTextOnlyPDF();
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateTextOnlyPDF = async () => {
    try {
      // Dynamically import jsPDF only when needed
      const { default: jsPDF } = await import('jspdf');
      
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      
      // Add header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pre-Works Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Add basic form information
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Details', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      const formDetails = [
        ['Job Description:', formData.selectedDescription || 'Not specified'],
        ['Property Type:', formData.propertyType || 'Not specified'],
        ['Age of Property:', formData.ageOfProperty || 'Not specified'],
        ['Property Condition:', formData.propertyCondition || 'Not specified'],
        ['Construction Type:', formData.constructionType || 'Not specified'],
        ['Reporter Name:', formData.reporterName || 'Not specified'],
        ['Location of Structure:', formData.locationOfStructure || 'Not specified'],
        ['Site Access:', formData.siteAccess || 'Not specified'],
        ['Power Isolated:', formData.isPowerIsolated || 'Not specified']
      ];
      
      formDetails.forEach(([label, value]) => {
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, 70, yPosition);
        yPosition += 6;
      });
      
      // Save the PDF
      const fileName = `pre-works-assessment-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
    } catch (error) {
      console.error('Error generating text PDF:', error);
      throw error;
    }
  };

  const generatePDFWithImages = async () => {
    try {
      // Dynamically import required libraries
      const { default: jsPDF } = await import('jspdf');
      const { default: html2canvas } = await import('html2canvas');
      
      // Create new PDF document
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      let yPosition = 20;
      let currentPage = 1;
      
      // Helper function to add new page if needed
      const addPageIfNeeded = () => {
        if (yPosition > pageHeight - 40) {
          pdf.addPage();
          currentPage++;
          yPosition = 20;
          return true;
        }
        return false;
      };
      
      // Add header
      pdf.setFontSize(24);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Pre-Works Assessment Report', pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 15;
      
      // Add date
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 20;
      
      // Add job information if available
      if (formData.selectedDescription) {
        pdf.setFontSize(16);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Job Information', 20, yPosition);
        yPosition += 10;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Try to extract job number from description if it follows a pattern
        const jobMatch = formData.selectedDescription.match(/(\d+)/);
        const jobNumber = jobMatch ? jobMatch[1] : 'N/A';
        
        const jobDetails = [
          ['Job Description:', formData.selectedDescription],
          ['Job Number:', jobNumber],
          ['Assessment Date:', new Date().toLocaleDateString()]
        ];
        
        jobDetails.forEach(([label, value]) => {
          pdf.setFont('helvetica', 'bold');
          pdf.text(label, 20, yPosition);
          pdf.setFont('helvetica', 'normal');
          pdf.text(value, 70, yPosition);
          yPosition += 6;
        });
        
        yPosition += 10;
      }
      
      // Add form details
      pdf.setFontSize(16);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Project Details', 20, yPosition);
      yPosition += 10;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      
      // Basic form information
      const formDetails = [
        ['Job Description:', formData.selectedDescription || 'Not specified'],
        ['Property Type:', formData.propertyType || 'Not specified'],
        ['Age of Property:', formData.ageOfProperty || 'Not specified'],
        ['Property Condition:', formData.propertyCondition || 'Not specified'],
        ['Construction Type:', formData.constructionType || 'Not specified'],
        ['Reporter Name:', formData.reporterName || 'Not specified'],
        ['Location of Structure:', formData.locationOfStructure || 'Not specified'],
        ['Location Other:', formData.locationOther || 'Not specified'],
        ['Site Access:', formData.siteAccess || 'Not specified'],
        ['Customer Notes:', formData.customerNotes || 'Not specified'],
        ['Power Isolated:', formData.isPowerIsolated || 'Not specified']
      ];
      
      formDetails.forEach(([label, value]) => {
        addPageIfNeeded();
        pdf.setFont('helvetica', 'bold');
        pdf.text(label, 20, yPosition);
        pdf.setFont('helvetica', 'normal');
        pdf.text(value, 70, yPosition);
        yPosition += 6;
      });
      
      yPosition += 10;
      
      // Add roof services information
      if (formData.roofServices && formData.roofServices.length > 0) {
        addPageIfNeeded();
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Requested Roof Services:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        formData.roofServices.forEach((service, index) => {
          pdf.text(`  • ${service}`, 25, yPosition);
          yPosition += 5;
        });
        
        yPosition += 10;
      }
      
      // Add assets information with images
      for (let assetIndex = 0; assetIndex < formData.assets.length; assetIndex++) {
        const asset = formData.assets[assetIndex];
        
        addPageIfNeeded();
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text(`Asset ${assetIndex + 1}: ${asset.assetName}`, 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Roof Areas with images
        if (asset.roofAreas && asset.roofAreas.length > 0) {
          for (let areaIndex = 0; areaIndex < asset.roofAreas.length; areaIndex++) {
            const area = asset.roofAreas[areaIndex];
            
            addPageIfNeeded();
            pdf.setFont('helvetica', 'bold');
            pdf.text(`Roof Area ${areaIndex + 1}: ${area.name}`, 25, yPosition);
            yPosition += 4; // Reduced from 6 to 4 to match framing section
            
            pdf.setFont('helvetica', 'normal');
            const areaDetails = [
              `  Type: ${area.type || 'Not specified'}`,
              `  Profile: ${area.profile || 'Not specified'}`,
              `  Pitch: ${area.pitchDeg || 'Not specified'}°`,
              `  Colour: ${area.colour || 'Not specified'}`,
              `  Thickness (BMT): ${area.gauge || 'Not specified'}`,
              `  Membrane: ${area.membrane || 'None'}`
            ];
            
            areaDetails.forEach(detail => {
              addPageIfNeeded();
              pdf.text(detail, 30, yPosition);
              yPosition += 4; // Reduced from 5 to 4 for tighter spacing
            });
            
            // Add images for this area in a grid layout
            if (area.images && area.images.length > 0) {
              // No additional spacing - images start immediately after details
              
              // Calculate grid layout - 3 columns with reduced spacing
              const imgWidth = 55; // Slightly smaller to fit 3 columns
              const imgHeight = (imgWidth * 0.75); // Maintain aspect ratio
              const horizontalSpacing = 5; // Reduced spacing between columns
              const verticalSpacing = 3; // Reduced spacing between rows
              const maxImagesPerRow = 3;
              
              // Center the image grid under the section header
              const totalGridWidth = (imgWidth * maxImagesPerRow) + (horizontalSpacing * (maxImagesPerRow - 1));
              const startX = 25 + (totalGridWidth / 2); // Center the grid under the header
              
              // No separate header - images will flow inline with section content
              
              for (let imgIndex = 0; imgIndex < area.images.length; imgIndex++) {
                const image = area.images[imgIndex];
                const row = Math.floor(imgIndex / maxImagesPerRow);
                const col = imgIndex % maxImagesPerRow;
                
                try {
                  // Convert image to base64
                  const base64 = await convertImageToBase64(image.file);
                  
                  // Check if we need a new page for the image
                  if (yPosition + (row * (imgHeight + verticalSpacing + 3)) > pageHeight - 80) {
                    pdf.addPage();
                    currentPage++;
                    yPosition = 20;
                  }
                  
                  // Calculate position for this image
                  const xPos = startX + (col * (imgWidth + horizontalSpacing));
                  const yPos = yPosition + (row * (imgHeight + verticalSpacing + 3)); // First row starts at yPosition, subsequent rows add spacing
                  
                  // Add image to PDF
                  pdf.addImage(base64, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                  
                  // Add image caption below the image
                  pdf.setFontSize(8);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(`Img ${imgIndex + 1}`, xPos, yPos + imgHeight + 2, { align: 'center' });
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError);
                  pdf.setFontSize(8);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(`Error: ${imgError}`, xPos, yPos + imgHeight + 2, { align: 'center' });
                }
              }
              
              // Update yPosition to account for the grid height
              const totalRows = Math.ceil(area.images.length / maxImagesPerRow);
              yPosition += (totalRows * (imgHeight + verticalSpacing + 3)) + 2; // Reduced spacing for tighter layout
            }
            
            yPosition += 2; // Reduced from 5 to 2
          }
        }
        
        // Support Width (Battens/Purlins) with images
        if (asset.battens && asset.battens.length > 0) {
          addPageIfNeeded();
          pdf.setFont('helvetica', 'bold');
          pdf.text('Support Width (Battens/Purlins):', 25, yPosition);
          yPosition += 2; // Reduced from 4 to 2 for even tighter spacing
          
          for (let battenIndex = 0; battenIndex < asset.battens.length; battenIndex++) {
            const batten = asset.battens[battenIndex];
            
            addPageIfNeeded();
            pdf.setFont('helvetica', 'normal');
            const battenDetails = [
              `  Row ${battenIndex + 1}:`,
              `    Type: ${batten.kind}`,
              `    Spacing: ${batten.spacingMm || 'Not specified'}`,
              `    Material: ${batten.material || 'Not specified'}`,
              `    Size: ${batten.size || 'Not specified'}`,
              `    Condition: ${batten.condition || 'Not specified'}`
            ];
            
            battenDetails.forEach(detail => {
              addPageIfNeeded();
              pdf.text(detail, 30, yPosition);
              yPosition += 4; // Reduced from 5 to 4 for tighter spacing
            });
            
            // Add images for this batten in a grid layout
            if (batten.images && batten.images.length > 0) {
              // No additional spacing - images start immediately after details
              
              // Calculate grid layout - 3 columns with reduced spacing
              const imgWidth = 55; // Slightly smaller to fit 3 columns
              const imgHeight = (imgWidth * 0.75); // Maintain aspect ratio
              const horizontalSpacing = 5; // Reduced spacing between columns
              const verticalSpacing = 3; // Reduced spacing between rows
              const maxImagesPerRow = 3;
              
              // Center the image grid under the section header
              const totalGridWidth = (imgWidth * maxImagesPerRow) + (horizontalSpacing * (maxImagesPerRow - 1));
              const startX = 25 + (totalGridWidth / 2); // Center the grid under the header
              
              // No separate header - images will flow inline with section content
              
              for (let imgIndex = 0; imgIndex < batten.images.length; imgIndex++) {
                const image = batten.images[imgIndex];
                const row = Math.floor(imgIndex / maxImagesPerRow);
                const col = imgIndex % maxImagesPerRow;
                
                try {
                  const base64 = await convertImageToBase64(image.file);
                  
                  if (yPosition + (row * (imgHeight + verticalSpacing + 3)) > pageHeight - 80) {
                    pdf.addPage();
                    currentPage++;
                    yPosition = 20;
                  }
                  
                  // Calculate position for this image
                  const xPos = startX + (col * (imgWidth + horizontalSpacing));
                  const yPos = yPosition + (row * (imgHeight + verticalSpacing + 3)); // First row starts at yPosition, subsequent rows add spacing
                  
                  // Add image to PDF
                  pdf.addImage(base64, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                  
                  // Add image caption below the image
                  pdf.setFontSize(8);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(`Img ${imgIndex + 1}`, xPos, yPos + imgHeight + 2, { align: 'center' });
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError);
                  pdf.setFontSize(8);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(`Error: ${imgError}`, xPos, yPos + imgHeight + 2, { align: 'center' });
                }
              }
              
              // Update yPosition to account for the grid height
              const totalRows = Math.ceil(batten.images.length / maxImagesPerRow);
              yPosition += (totalRows * (imgHeight + verticalSpacing + 3)) + 2; // Reduced spacing for tighter layout
            }
            
            yPosition += 2; // Reduced from 5 to 2
          }
        }
        
        // Roof Framing with images
        if (asset.framing && asset.framing.length > 0) {
          addPageIfNeeded();
          pdf.setFont('helvetica', 'bold');
          pdf.text('Roof Framing:', 25, yPosition);
          yPosition += 4; // Reduced from 6 to 4
          
          for (let frameIndex = 0; frameIndex < asset.framing.length; frameIndex++) {
            const frame = asset.framing[frameIndex];
            
            addPageIfNeeded();
            pdf.setFont('helvetica', 'normal');
            const frameDetails = [
              `  Row ${frameIndex + 1}:`,
              `    Material: ${frame.material}`,
              `    Spacing: ${frame.spacing || 'Not specified'}`,
              `    Size: ${frame.size || 'Not specified'}`,
              `    Span: ${frame.span || 'Not specified'}`,
              `    Condition: ${frame.condition || 'Not specified'}`
            ];
            
            frameDetails.forEach(detail => {
              addPageIfNeeded();
              pdf.text(detail, 30, yPosition);
              yPosition += 4; // Reduced from 5 to 4 for tighter spacing
            });
            
            // Add images for this frame in a grid layout
            if (frame.images && frame.images.length > 0) {
              // No additional spacing - images start immediately after details
              
              // Calculate grid layout - 3 columns with reduced spacing
              const imgWidth = 55; // Slightly smaller to fit 3 columns
              const imgHeight = (imgWidth * 0.75); // Maintain aspect ratio
              const horizontalSpacing = 5; // Reduced spacing between columns
              const verticalSpacing = 3; // Reduced spacing between rows
              const maxImagesPerRow = 3;
              
              // Center the image grid under the section header
              const totalGridWidth = (imgWidth * maxImagesPerRow) + (horizontalSpacing * (maxImagesPerRow - 1));
              const startX = 25 + (totalGridWidth / 2); // Center the grid under the header
              
              // No separate header - images will flow inline with section content
              
              for (let imgIndex = 0; imgIndex < frame.images.length; imgIndex++) {
                const image = frame.images[imgIndex];
                const row = Math.floor(imgIndex / maxImagesPerRow);
                const col = imgIndex % maxImagesPerRow;
                
                try {
                  const base64 = await convertImageToBase64(image.file);
                  
                  if (yPosition + (row * (imgHeight + verticalSpacing + 3)) > pageHeight - 80) {
                    pdf.addPage();
                    currentPage++;
                    yPosition = 20;
                  }
                  
                  // Calculate position for this image
                  const xPos = startX + (col * (imgWidth + horizontalSpacing));
                  const yPos = yPosition + (row * (imgHeight + verticalSpacing + 3)); // First row starts at yPosition, subsequent rows add spacing
                  
                  // Add image to PDF
                  pdf.addImage(base64, 'JPEG', xPos, yPos, imgWidth, imgHeight);
                  
                  // Add image caption below the image
                  pdf.setFontSize(8);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(`Img ${imgIndex + 1}`, xPos, yPos + imgHeight + 2, { align: 'center' });
                  
                } catch (imgError) {
                  console.error('Error processing image:', imgError);
                  pdf.setFontSize(8);
                  pdf.setFont('helvetica', 'normal');
                  pdf.text(`Error: ${imgError}`, xPos, yPos + imgHeight + 2, { align: 'center' });
                }
              }
              
              // Update yPosition to account for the grid height
              const totalRows = Math.ceil(frame.images.length / maxImagesPerRow);
              yPosition += (totalRows * (imgHeight + verticalSpacing + 3)) + 2; // Reduced spacing for tighter layout
            }
            
            yPosition += 5;
          }
        }
        
        yPosition += 10;
      }
      
      // Add uploaded files information
      const uploadedFiles = [];
      if (formData.finalPlan && formData.finalPlan.length > 0) {
        uploadedFiles.push(`Final Plan: ${formData.finalPlan[0].name}`);
      }
      if (formData.finalTakeoff && formData.finalTakeoff.length > 0) {
        uploadedFiles.push(`Final Takeoff: ${formData.finalTakeoff[0].name}`);
      }
      if (formData.powerIsolationImage && formData.powerIsolationImage.length > 0) {
        uploadedFiles.push(`Power Isolation Image: ${formData.powerIsolationImage[0].name}`);
      }
      
      if (uploadedFiles.length > 0) {
        addPageIfNeeded();
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('Uploaded Files:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        uploadedFiles.forEach(file => {
          pdf.text(`  • ${file}`, 25, yPosition);
          yPosition += 5;
        });
        
        yPosition += 10;
      }
      
      // Add notes if available
      if (formData.notes) {
        addPageIfNeeded();
        pdf.setFontSize(14);
        pdf.setFont('helvetica', 'bold');
        pdf.text('General Notes:', 20, yPosition);
        yPosition += 8;
        
        pdf.setFontSize(10);
        pdf.setFont('helvetica', 'normal');
        
        // Split notes into lines that fit the page width
        const words = formData.notes.split(' ');
        let line = '';
        const maxWidth = pageWidth - 40;
        
        words.forEach(word => {
          const testLine = line + word + ' ';
          const textWidth = pdf.getTextWidth(testLine);
          
          if (textWidth > maxWidth) {
            addPageIfNeeded();
            pdf.text(line, 20, yPosition);
            yPosition += 6;
            line = word + ' ';
          } else {
            line = testLine;
          }
        });
        
        if (line.trim()) {
          addPageIfNeeded();
          pdf.text(line, 20, yPosition);
        }
      }
      
      // Add footer to all pages
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setFont('helvetica', 'normal');
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        pdf.text('Generated by Roofify Pre-Works Assessment Form', pageWidth / 2, pageHeight - 5, { align: 'center' });
      }
      
      // Save the PDF
      const fileName = `pre-works-assessment-with-images-${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);
      
      console.log('PDF with images generated successfully');
      
    } catch (error) {
      console.error('Error generating PDF with images:', error);
      alert('Failed to generate PDF with images. Falling back to text-only PDF.');
      // Fallback to text-only PDF
      await generateTextOnlyPDF();
    }
  };

  // Helper function to convert image file to base64
  const convertImageToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read image file'));
      reader.readAsDataURL(file);
    });
  };

  return (
    <div className="space-y-4">
      {/* PDF Type Selection */}
      <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="pdfType"
            value="text"
            checked={pdfType === 'text'}
            onChange={(e) => setPdfType(e.target.value as 'text' | 'images')}
            className="text-blue-600"
          />
          <span className="text-sm font-medium">Text Only (Fast)</span>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="radio"
            name="pdfType"
            value="images"
            checked={pdfType === 'images'}
            onChange={(e) => setPdfType(e.target.value as 'text' | 'images')}
            className="text-blue-600"
          />
          <span className="text-sm font-medium">With Images (Recommended)</span>
        </label>
      </div>

      {/* Export Button */}
      <Button
        onClick={generatePDF}
        disabled={isGenerating}
        className={`bg-green-600 hover:bg-green-700 text-white ${className}`}
      >
        {isGenerating ? (
          <>
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
            {pdfType === 'images' ? 'Generating PDF with Images...' : 'Generating PDF...'}
          </>
        ) : (
          <>
            📄 Export as PDF {pdfType === 'images' ? '(with Images)' : '(Text Only)'}
          </>
        )}
      </Button>
    </div>
  );
};

export default PDFExportWithImages;
