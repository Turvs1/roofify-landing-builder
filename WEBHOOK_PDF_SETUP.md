# Webhook PDF Generation with Images - Setup Guide

## Overview
This system uses an n8n webhook workflow to process images from the PreWorksForm and generate comprehensive PDFs with embedded images. The solution provides both text-only and image-enhanced PDF options.

## 🚀 Quick Start

### 1. Frontend Integration
Replace the existing PDF export button in your forms with the new `PDFExportWithImages` component:

```tsx
import PDFExportWithImages from '@/components/PDFExportWithImages';

// In your form component
<PDFExportWithImages formData={formData} className="w-full" />
```

### 2. n8n Webhook Setup
Import the provided `n8n-webhook-pdf-images.json` workflow into your n8n instance.

### 3. Webhook URL
The system expects the webhook at: `https://n8n.wayvvault.cc/webhook/pdf-images`

## 📋 System Architecture

```
PreWorksForm → Webhook Request → n8n Workflow → PDF Generation → Response
     ↓              ↓              ↓              ↓            ↓
  Form Data    JSON Payload   Image Processing  PDFKit      PDF File
  + Images     + Metadata     + Resizing       + Images    Download
```

## 🔧 n8n Workflow Components

### Node 1: Webhook Trigger
- **Path**: `/pdf-images`
- **Method**: POST
- **Response Mode**: Response Node

### Node 2: Extract Form Data
- Extracts form data, image requirements, and metadata
- Logs incoming requests for debugging

### Node 3: Check Images Required
- Routes to image processing or text-only PDF generation
- Conditional logic based on `includeImages` parameter

### Node 4: Process Image Data
- Extracts image URLs from form data
- Categorizes images by source (roof areas, battens, framing)
- Prepares image metadata for processing

### Node 5: Download & Process Images
- Downloads images from URLs
- Resizes images to specified dimensions (300x300px default)
- Converts to appropriate format for PDF embedding

### Node 6: Generate PDF with Images
- Creates PDF structure with image placeholders
- Organizes content by sections
- Prepares image positioning data

### Node 7: Create PDF Document
- Uses PDFKit or similar library to generate actual PDF
- Embeds processed images at appropriate locations
- Applies styling and layout

### Node 8: Respond with PDF
- Returns generated PDF as downloadable file
- Sets appropriate headers for file download

## 📊 Data Flow

### Input Payload
```json
{
  "formData": {
    "selectedDescription": "Job description",
    "assets": [
      {
        "assetName": "Main Roof",
        "roofAreas": [
          {
            "name": "Front Roof",
            "images": [
              {
                "name": "front-roof-1.jpg",
                "url": "https://example.com/image1.jpg"
              }
            ]
          }
        ]
      }
    ]
  },
  "includeImages": true,
  "imageSize": "300x300",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "requestId": "pdf-1234567890-abc123"
}
```

### Output Response
- **Success**: PDF file with `Content-Type: application/pdf`
- **Fallback**: Text-only PDF if image processing fails
- **Error**: JSON error response with details

## 🛠️ Implementation Steps

### Step 1: Install Dependencies
```bash
# In your n8n instance
npm install pdfkit
npm install sharp  # For image processing
npm install canvas # For image manipulation
```

### Step 2: Configure Environment Variables
```bash
# n8n environment variables
WEBHOOK_BASE_URL=https://n8n.wayvvault.cc
MAX_IMAGE_SIZE=300
SUPPORTED_FORMATS=jpg,jpeg,png,webp
PDF_TEMPLATE_PATH=/templates/pre-works-template.html
```

### Step 3: Import Workflow
1. Open n8n dashboard
2. Go to Workflows → Import from File
3. Select `n8n-webhook-pdf-images.json`
4. Activate the workflow

### Step 4: Test Integration
1. Fill out PreWorksForm with test images
2. Select "With Images" PDF option
3. Click Export
4. Verify webhook receives data
5. Check PDF generation and download

## 🔍 Troubleshooting

### Common Issues

#### 1. Webhook Not Receiving Data
- Check n8n workflow activation status
- Verify webhook URL is correct
- Check browser console for CORS errors
- Ensure n8n instance is accessible

#### 2. Image Processing Fails
- Verify image URLs are accessible
- Check image format support
- Monitor n8n execution logs
- Verify image processing dependencies

#### 3. PDF Generation Errors
- Check PDFKit installation
- Verify template files exist
- Monitor memory usage for large images
- Check file permissions

#### 4. Download Issues
- Verify Content-Type headers
- Check browser download settings
- Monitor response size limits
- Verify file naming conventions

### Debug Commands
```bash
# Check n8n logs
n8n logs --follow

# Test webhook endpoint
curl -X POST https://n8n.wayvvault.cc/webhook/pdf-images \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Monitor workflow executions
n8n workflow:list
n8n workflow:execute <workflow-id>
```

## 📈 Performance Optimization

### Image Processing
- **Batch Processing**: Process multiple images concurrently
- **Caching**: Cache processed images for reuse
- **Compression**: Optimize image quality vs file size
- **Format Conversion**: Convert to PDF-optimized formats

### PDF Generation
- **Streaming**: Generate PDF in chunks for large documents
- **Memory Management**: Monitor and optimize memory usage
- **Template Caching**: Cache PDF templates
- **Async Processing**: Handle long-running operations

### Webhook Optimization
- **Rate Limiting**: Implement request throttling
- **Queue Management**: Handle concurrent requests
- **Timeout Handling**: Set appropriate timeouts
- **Error Recovery**: Implement retry mechanisms

## 🔒 Security Considerations

### Input Validation
- Validate image URLs (whitelist domains)
- Check file size limits
- Verify image format support
- Sanitize form data

### Access Control
- Implement webhook authentication
- Rate limit requests per user
- Monitor for abuse patterns
- Log all requests for audit

### Data Privacy
- Don't store sensitive form data
- Implement data retention policies
- Secure image storage
- Audit access logs

## 🚀 Advanced Features

### Custom Templates
- Create branded PDF templates
- Support multiple report types
- Dynamic content positioning
- Multi-language support

### Image Enhancement
- Auto-crop and center images
- Apply filters and effects
- Add watermarks or branding
- Optimize for print vs screen

### Analytics & Monitoring
- Track PDF generation metrics
- Monitor processing times
- Error rate monitoring
- User behavior analytics

## 📞 Support

### Getting Help
1. Check n8n execution logs
2. Review webhook request/response data
3. Test with minimal form data
4. Verify all dependencies are installed

### Contact
- **Technical Issues**: Check n8n documentation
- **Integration Help**: Review this setup guide
- **Custom Features**: Contact development team

## 🔄 Updates & Maintenance

### Regular Tasks
- Monitor webhook performance
- Update image processing libraries
- Review and optimize templates
- Backup workflow configurations

### Version Control
- Export workflow configurations regularly
- Document configuration changes
- Test updates in staging environment
- Maintain rollback procedures

---

**Note**: This system provides a robust foundation for PDF generation with images. The n8n workflow can be customized further based on specific requirements and branding needs.
