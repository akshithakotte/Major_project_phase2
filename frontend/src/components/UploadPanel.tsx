import { Upload, Loader2 } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";

interface UploadPanelProps {
  title: string;
  description: string;
  buttonLabel: string;
  icon: React.ReactNode;
  accentColor: "blue" | "green";
  onFileSubmit?: (file: File) => Promise<void>;
  isLoading?: boolean;
}

const UploadPanel = ({ title, description, buttonLabel, icon, accentColor, onFileSubmit, isLoading }: UploadPanelProps) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const borderColor = accentColor === "green" ? "border-accent/20" : "border-primary/20";
  const btnBg = accentColor === "green"
    ? "bg-accent/15 hover:bg-accent/25 text-accent border-accent/30"
    : "bg-primary/15 hover:bg-primary/25 text-primary border-primary/30";
  const iconBg = accentColor === "green" ? "bg-accent/10 text-accent" : "bg-primary/10 text-primary";

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && file.name.endsWith(".csv")) {
      setSelectedFile(file);
    } else {
      toast("Please upload a CSV file");
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast("Please select a CSV file first");
      return;
    }
    if (onFileSubmit) {
      await onFileSubmit(selectedFile);
    }
  };

  return (
    <div className={`glass-card rounded-xl p-8 border ${borderColor} flex flex-col items-center text-center`}>
      <div className={`w-16 h-16 rounded-2xl ${iconBg} flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground mb-6 max-w-xs">{description}</p>

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        className={`w-full border-2 border-dashed rounded-xl p-6 mb-4 cursor-pointer transition-colors ${
          dragOver ? "border-primary/50 bg-primary/5" : "border-border hover:border-muted-foreground/30"
        }`}
        onClick={() => fileInputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
      >
        <Upload className="w-6 h-6 text-muted-foreground mx-auto mb-2" />
        <p className="text-xs text-muted-foreground">
          {selectedFile ? selectedFile.name : "Drop your CSV file here or click to browse"}
        </p>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading}
        className={`px-6 py-2.5 rounded-lg border text-sm font-medium transition-all duration-200 ${btnBg} disabled:opacity-50`}
      >
        {isLoading ? <Loader2 className="w-4 h-4 animate-spin inline mr-2" /> : null}
        {isLoading ? "Processing..." : buttonLabel}
      </button>
    </div>
  );
};

export default UploadPanel;
