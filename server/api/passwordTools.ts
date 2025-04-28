import { Express } from "express";
import { storage } from "../storage";

export function setupPasswordToolsRoutes(app: Express) {
  // Password Generator API
  app.post("/api/password/generate", async (req, res) => {
    try {
      const {
        length = 16,
        includeUppercase = true,
        includeLowercase = true,
        includeNumbers = true,
        includeSymbols = true,
      } = req.body;

      // Validate input
      if (!includeUppercase && !includeLowercase && !includeNumbers && !includeSymbols) {
        return res.status(400).json({ error: "At least one character type must be selected" });
      }

      if (length < 8 || length > 32) {
        return res.status(400).json({ error: "Password length must be between 8 and 32 characters" });
      }

      // Define character sets
      const uppercaseChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      const lowercaseChars = "abcdefghijklmnopqrstuvwxyz";
      const numberChars = "0123456789";
      const symbolChars = "!@#$%^&*()_+~`|}{[]:;?><,./-=";

      // Create a character pool based on selected options
      let charPool = "";
      if (includeUppercase) charPool += uppercaseChars;
      if (includeLowercase) charPool += lowercaseChars;
      if (includeNumbers) charPool += numberChars;
      if (includeSymbols) charPool += symbolChars;

      // Generate password
      let password = "";
      const charPoolLength = charPool.length;

      // Ensure at least one character from each selected type
      if (includeUppercase) {
        password += uppercaseChars.charAt(Math.floor(Math.random() * uppercaseChars.length));
      }
      if (includeLowercase) {
        password += lowercaseChars.charAt(Math.floor(Math.random() * lowercaseChars.length));
      }
      if (includeNumbers) {
        password += numberChars.charAt(Math.floor(Math.random() * numberChars.length));
      }
      if (includeSymbols) {
        password += symbolChars.charAt(Math.floor(Math.random() * symbolChars.length));
      }

      // Fill the rest of the password
      for (let i = password.length; i < length; i++) {
        password += charPool.charAt(Math.floor(Math.random() * charPoolLength));
      }

      // Shuffle the password characters
      password = shuffleString(password);

      // Calculate password strength
      const strength = calculatePasswordStrength(
        password,
        includeUppercase,
        includeLowercase,
        includeNumbers,
        includeSymbols
      );

      res.json({
        password,
        strength
      });
    } catch (error) {
      console.error("Error generating password:", error);
      res.status(500).json({ error: "Failed to generate password" });
    }
  });

  // Helper function to shuffle a string
  function shuffleString(str: string): string {
    const array = str.split("");
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array.join("");
  }

  // Function to calculate password strength
  function calculatePasswordStrength(
    password: string,
    hasUppercase: boolean,
    hasLowercase: boolean,
    hasNumbers: boolean,
    hasSymbols: boolean
  ): number {
    let strength = 0;

    // Length contribution (up to 40%)
    const lengthFactor = Math.min(password.length / 32, 1);
    strength += lengthFactor * 40;

    // Character variety contribution (up to 60%)
    let characterTypes = 0;
    if (hasUppercase) characterTypes++;
    if (hasLowercase) characterTypes++;
    if (hasNumbers) characterTypes++;
    if (hasSymbols) characterTypes++;

    const varietyFactor = characterTypes / 4;
    strength += varietyFactor * 60;

    // Entropy adjustment based on repetitions and patterns
    // Check for repeating characters
    const repeatingChars = /(.)\1{2,}/g;
    if (repeatingChars.test(password)) {
      strength -= 10;
    }

    // Check for sequential characters
    const sequentialChars = /(abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i;
    if (sequentialChars.test(password)) {
      strength -= 10;
    }

    // Ensure strength is between 0 and 100
    return Math.max(0, Math.min(100, Math.round(strength)));
  }
}
