import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EncryptionAlgorithm } from "@/lib/encryption";

interface AlgorithmCardProps {
  algorithm: EncryptionAlgorithm;
  isSelected: boolean;
  onSelect: () => void;
}

export const AlgorithmCard = ({ algorithm, isSelected, onSelect }: AlgorithmCardProps) => {
  return (
    <Card
      className={`p-4 cursor-pointer transition-all duration-300 border-2 hover:shadow-glow ${
        isSelected 
          ? "border-primary bg-gradient-glow shadow-cyber" 
          : "border-muted hover:border-terminal-dim"
      }`}
      onClick={onSelect}
    >
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className={`font-bold text-lg ${isSelected ? "text-glow" : ""}`}>
            {algorithm.name}
          </h3>
          {algorithm.requiresKey && (
            <Badge variant="secondary" className="text-xs">
              Requires Key
            </Badge>
          )}
        </div>
        <p className="text-muted-foreground text-sm leading-relaxed">
          {algorithm.description}
        </p>
      </div>
    </Card>
  );
};