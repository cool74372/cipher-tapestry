import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Lock, Unlock, RotateCcw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AlgorithmCard } from "./AlgorithmCard";
import { algorithms, EncryptionAlgorithm } from "@/lib/encryption";

export const EncryptionInterface = () => {
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<EncryptionAlgorithm>(algorithms[0]);
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");
  const [key, setKey] = useState("3");
  const [isEncrypting, setIsEncrypting] = useState(true);
  const { toast } = useToast();

  const handleProcess = () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please enter some text to process.",
        variant: "destructive"
      });
      return;
    }

    if (selectedAlgorithm.requiresKey && !key.trim()) {
      toast({
        title: "Key Required",
        description: `Please enter a ${selectedAlgorithm.keyLabel?.toLowerCase() || "key"}.`,
        variant: "destructive"
      });
      return;
    }

    try {
      const result = isEncrypting 
        ? selectedAlgorithm.encrypt(inputText, key)
        : selectedAlgorithm.decrypt(inputText, key);
      
      setOutputText(result);
      
      toast({
        title: `${isEncrypting ? "Encryption" : "Decryption"} Complete`,
        description: `Text processed using ${selectedAlgorithm.name}`,
      });
    } catch (error) {
      toast({
        title: "Processing Error",
        description: "An error occurred while processing the text.",
        variant: "destructive"
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied!",
        description: "Text copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Could not copy text to clipboard.",
        variant: "destructive"
      });
    }
  };

  const swapInputOutput = () => {
    const temp = inputText;
    setInputText(outputText);
    setOutputText(temp);
    setIsEncrypting(!isEncrypting);
  };

  const clearAll = () => {
    setInputText("");
    setOutputText("");
    setKey(selectedAlgorithm.name === "Caesar Cipher" ? "3" : selectedAlgorithm.name === "Rail Fence Cipher" ? "3" : "KEY");
  };

  return (
    <div className="min-h-screen bg-gradient-cyber p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-glow font-terminal">
            CIPHER_MATRIX
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced text encryption using classical cryptographic algorithms. 
            Select an algorithm, enter your text, and secure your data.
          </p>
        </div>

        {/* Algorithm Selection */}
        <section>
          <h2 className="text-2xl font-bold mb-4 text-terminal">Select Algorithm</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {algorithms.map((algorithm) => (
              <AlgorithmCard
                key={algorithm.name}
                algorithm={algorithm}
                isSelected={selectedAlgorithm.name === algorithm.name}
                onSelect={() => {
                  setSelectedAlgorithm(algorithm);
                  setKey(algorithm.name === "Caesar Cipher" ? "3" : algorithm.name === "Rail Fence Cipher" ? "3" : "KEY");
                  setOutputText("");
                }}
              />
            ))}
          </div>
        </section>

        {/* Main Interface */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <Card className="p-6 shadow-cyber">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-terminal">Input Text</h3>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={swapInputOutput}
                    className="hover:shadow-glow"
                  >
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Swap
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearAll}
                    className="hover:shadow-glow"
                  >
                    Clear
                  </Button>
                </div>
              </div>
              
              <Textarea
                placeholder="Enter your text here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-32 font-terminal resize-none"
              />

              {selectedAlgorithm.requiresKey && (
                <div className="space-y-2">
                  <Label htmlFor="key">{selectedAlgorithm.keyLabel}</Label>
                  <Input
                    id="key"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    placeholder={`Enter ${selectedAlgorithm.keyLabel?.toLowerCase()}`}
                    className="font-terminal"
                  />
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setIsEncrypting(true);
                    handleProcess();
                  }}
                  className="flex-1 shadow-glow hover:shadow-cyber"
                >
                  <Lock className="h-4 w-4 mr-2" />
                  Encrypt
                </Button>
                <Button
                  onClick={() => {
                    setIsEncrypting(false);
                    handleProcess();
                  }}
                  variant="secondary"
                  className="flex-1 hover:shadow-glow"
                >
                  <Unlock className="h-4 w-4 mr-2" />
                  Decrypt
                </Button>
              </div>
            </div>
          </Card>

          {/* Output Section */}
          <Card className="p-6 shadow-cyber">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-terminal">Output Text</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(outputText)}
                  disabled={!outputText}
                  className="hover:shadow-glow"
                >
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
              </div>
              
              <Textarea
                value={outputText}
                readOnly
                placeholder="Processed text will appear here..."
                className="min-h-32 font-terminal resize-none bg-muted"
              />

              {outputText && (
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>Algorithm: {selectedAlgorithm.name}</div>
                  <div>Characters: {outputText.length}</div>
                  <div>Mode: {isEncrypting ? "Encrypted" : "Decrypted"}</div>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Algorithm Info */}
        <Card className="p-6 shadow-cyber">
          <h3 className="text-xl font-bold text-terminal mb-3">About {selectedAlgorithm.name}</h3>
          <p className="text-muted-foreground leading-relaxed">
            {selectedAlgorithm.description}
          </p>
        </Card>
      </div>
    </div>
  );
};