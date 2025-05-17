
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, X, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import imageCompression from "browser-image-compression";

interface ImageUploadFieldProps {
  bucketName: string;
  value: string | null;
  onChange: (url: string | null) => void;
  label?: string;
}

const ImageUploadField = ({
  bucketName,
  value,
  onChange,
  label = "Image",
}: ImageUploadFieldProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    try {
      setIsUploading(true);
      
      // Compress the image before uploading
      const options = {
        maxSizeMB: 1,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Generate a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${bucketName}/${fileName}`;
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(fileName, compressedFile);
        
      if (error) {
        throw error;
      }
      
      // Get the public URL
      const { data: { publicUrl } } = supabase.storage
        .from(bucketName)
        .getPublicUrl(fileName);
        
      onChange(publicUrl);
      
      toast({
        title: "Image uploaded successfully",
        description: "Your image has been uploaded and compressed.",
      });
      
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Upload failed",
        description: `Error uploading image: ${(error as Error).message}`,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleRemoveImage = () => {
    // Note: We're not deleting the file from storage, just removing the reference
    onChange(null);
  };
  
  return (
    <div className="space-y-2">
      <Label htmlFor="image-upload">{label}</Label>
      
      {!value ? (
        <div className="flex items-center">
          <Input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={isUploading}
            className="max-w-sm"
          />
          {isUploading && (
            <Loader2 className="h-4 w-4 ml-2 animate-spin text-muted-foreground" />
          )}
        </div>
      ) : (
        <div className="flex flex-col space-y-2">
          <div className="relative w-full max-w-md h-48 bg-muted rounded-md overflow-hidden">
            <img
              src={value}
              alt="Uploaded"
              className="w-full h-full object-cover"
            />
            <Button
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2 h-8 w-8"
              onClick={handleRemoveImage}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-fit"
            onClick={() => onChange(null)}
          >
            Change image
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
