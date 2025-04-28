import { Express } from "express";
import { storage } from "../storage";

export function setupQRCodeToolsRoutes(app: Express) {
  // QR Code Generator API
  app.post("/api/qrcode/generate", async (req, res) => {
    try {
      const {
        content,
        contentType = "text",
        color = "000000",
        bgColor = "FFFFFF",
        size = 200,
        margin = 1,
        format = "png"
      } = req.body;

      if (!content) {
        return res.status(400).json({ error: "Content is required" });
      }

      // Validate input
      if (size < 100 || size > 500) {
        return res.status(400).json({ error: "Size must be between 100 and 500 pixels" });
      }

      if (margin < 0 || margin > 5) {
        return res.status(400).json({ error: "Margin must be between 0 and 5" });
      }

      if (!["png", "svg", "jpeg"].includes(format)) {
        return res.status(400).json({ error: "Format must be png, svg, or jpeg" });
      }

      // Process the content based on content type
      let processedContent = content;
      
      switch (contentType) {
        case "url":
          if (!content.startsWith("http://") && !content.startsWith("https://")) {
            processedContent = "https://" + content;
          }
          break;
        case "email":
          processedContent = `mailto:${content}`;
          break;
        case "phone":
          processedContent = `tel:${content}`;
          break;
        case "sms":
          const [phone, message] = content.split(":");
          processedContent = `sms:${phone}${message ? `?body=${encodeURIComponent(message)}` : ""}`;
          break;
        case "wifi":
          // Format: SSID:MyWifi;PASSWORD:mypassword;TYPE:WPA
          const wifiParts = content.split(';').reduce((acc, part) => {
            const [key, value] = part.split(':');
            acc[key] = value;
            return acc;
          }, {} as Record<string, string>);
          
          processedContent = `WIFI:S:${wifiParts.SSID};T:${wifiParts.TYPE};P:${wifiParts.PASSWORD};;`;
          break;
        // Additional content types can be handled here
      }

      // In a real implementation, we'd use a QR code library to generate the image
      // For this implementation, we'll use the QR Server API
      
      // Create a URL for the QR code (using a publicly available QR code API)
      const qrCodeApiUrl = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(processedContent)}&size=${size}x${size}&margin=${margin}&color=${color}&bgcolor=${bgColor}&format=${format}`;
      
      // Return the URL to the frontend
      res.json({
        qrCodeUrl: qrCodeApiUrl
      });
      
    } catch (error) {
      console.error("Error generating QR code:", error);
      res.status(500).json({ error: "Failed to generate QR code" });
    }
  });
}
