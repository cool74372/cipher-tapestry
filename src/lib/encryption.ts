export interface EncryptionAlgorithm {
  name: string;
  description: string;
  requiresKey: boolean;
  keyLabel?: string;
  encrypt: (text: string, key?: string) => string;
  decrypt: (text: string, key?: string) => string;
}

// Caesar Cipher
export const caesarCipher: EncryptionAlgorithm = {
  name: "Caesar Cipher",
  description: "A substitution cipher where each letter is shifted by a fixed number of positions in the alphabet.",
  requiresKey: true,
  keyLabel: "Shift (0-25)",
  encrypt: (text: string, key: string = "3") => {
    const shift = parseInt(key) % 26;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'A' && char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
    });
  },
  decrypt: (text: string, key: string = "3") => {
    const shift = parseInt(key) % 26;
    return text.replace(/[a-zA-Z]/g, (char) => {
      const base = char >= 'A' && char <= 'Z' ? 65 : 97;
      return String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
    });
  }
};

// Vigenère Cipher
export const vigenereCipher: EncryptionAlgorithm = {
  name: "Vigenère Cipher",
  description: "A polyalphabetic substitution cipher using a repeating keyword to shift letters.",
  requiresKey: true,
  keyLabel: "Keyword",
  encrypt: (text: string, key: string = "KEY") => {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-zA-Z]/)) {
        const base = char >= 'A' && char <= 'Z' ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        result += String.fromCharCode(((char.charCodeAt(0) - base + shift) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return result;
  },
  decrypt: (text: string, key: string = "KEY") => {
    const cleanKey = key.toUpperCase().replace(/[^A-Z]/g, '');
    if (!cleanKey) return text;
    
    let result = '';
    let keyIndex = 0;
    
    for (let i = 0; i < text.length; i++) {
      const char = text[i];
      if (char.match(/[a-zA-Z]/)) {
        const base = char >= 'A' && char <= 'Z' ? 65 : 97;
        const shift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
        result += String.fromCharCode(((char.charCodeAt(0) - base - shift + 26) % 26) + base);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return result;
  }
};

// Rail Fence Cipher
export const railFenceCipher: EncryptionAlgorithm = {
  name: "Rail Fence Cipher",
  description: "A transposition cipher that arranges text in a zigzag pattern across multiple rails.",
  requiresKey: true,
  keyLabel: "Number of Rails",
  encrypt: (text: string, key: string = "3") => {
    const rails = parseInt(key);
    if (rails <= 1 || rails >= text.length) return text;
    
    const fence: string[][] = Array(rails).fill(null).map(() => []);
    let rail = 0;
    let direction = 1;
    
    for (let i = 0; i < text.length; i++) {
      fence[rail].push(text[i]);
      rail += direction;
      
      if (rail === rails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    return fence.map(row => row.join('')).join('');
  },
  decrypt: (text: string, key: string = "3") => {
    const rails = parseInt(key);
    if (rails <= 1 || rails >= text.length) return text;
    
    const fence: (string | null)[][] = Array(rails).fill(null).map(() => Array(text.length).fill(null));
    let rail = 0;
    let direction = 1;
    
    // Mark positions
    for (let i = 0; i < text.length; i++) {
      fence[rail][i] = '*';
      rail += direction;
      
      if (rail === rails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    // Fill characters
    let index = 0;
    for (let r = 0; r < rails; r++) {
      for (let c = 0; c < text.length; c++) {
        if (fence[r][c] === '*') {
          fence[r][c] = text[index++];
        }
      }
    }
    
    // Read zigzag
    let result = '';
    rail = 0;
    direction = 1;
    
    for (let i = 0; i < text.length; i++) {
      result += fence[rail][i];
      rail += direction;
      
      if (rail === rails - 1 || rail === 0) {
        direction = -direction;
      }
    }
    
    return result;
  }
};

// Available algorithms
export const algorithms: EncryptionAlgorithm[] = [
  caesarCipher,
  vigenereCipher,
  railFenceCipher
];