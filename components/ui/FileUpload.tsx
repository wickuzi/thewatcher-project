"use client";

import { IKImage, IKContext, IKUpload, IKVideo } from "imagekitio-react";
import config from "@/lib/config";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const {
  env: {
    imagekit: { publicKey, urlEndpoint },
  },
} = config;

const authenticator = async () => {
  try {
    // Use relative path instead of full URL
    const response = await fetch('/api/auth/imagekit');

    if (!response.ok) {
      const errorText = await response.text();
      console.error('ImageKit auth failed:', { status: response.status, errorText });
      throw new Error(
        `ImageKit authentication failed: ${response.status} ${errorText}`,
      );
    }

    const data = await response.json();
    
    if (!data.signature || !data.expire || !data.token) {
      console.error('Invalid response from ImageKit auth:', data);
      throw new Error('Invalid response from authentication service');
    }

    return {
      signature: data.signature,
      expire: data.expire,
      token: data.token
    };
  } catch (error: any) {
    console.error('Authentication error:', error);
    throw new Error(`Authentication failed: ${error.message}`);
  }
};

interface Props {
  type: "image" | "video";
  accept: string;
  placeholder: string;
  folder: string;
  variant: "dark" | "light";
  onFileChange: (filePath: string) => void;
  value?: string;
}

const FileUpload = ({
  type,
  accept,
  placeholder,
  folder,
  variant,
  onFileChange,
  value,
}: Props) => {
  const ikUploadRef = useRef(null);
  // Aseguramos que la ruta sea una URL completa
  const getFullUrl = (path: string) => {
    if (!path) return path;
    // Si ya es una URL completa, la devolvemos tal cual
    if (path.startsWith('http')) return path;
    // Si no, la convertimos a URL completa
    return `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${path}`;
  };

  const [file, setFile] = useState<{ filePath: string } | null>(
    value ? { filePath: getFullUrl(value) } : null
  );
  const [progress, setProgress] = useState(0);

  const styles = {
    button:
      variant === "dark"
        ? "bg-dark-300"
        : "bg-light-600 border-gray-100 border",
    placeholder: variant === "dark" ? "text-light-100" : "text-slate-500",
    text: variant === "dark" ? "text-light-100" : "text-dark-400",
  };

  const onError = (error: any) => {
    console.log(error);

    toast({
      title: `${type} subido fallido`,
      description: `Tu ${type} no pudo ser subido. Por favor, intenta de nuevo.`,
      variant: "destructive",
    });
  };

  const onSuccess = (res: { filePath: string; url: string }) => {
    // Usamos la URL completa de ImageKit
    const fileUrl = res.url || `${process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT}${res.filePath}`;
    
    setFile({ filePath: fileUrl });
    onFileChange(fileUrl);

    toast({
      title: `${type} subido exitosamente`,
      description: `Archivo subido exitosamente!`,
    });
  };

  const onValidate = (file: File) => {
    if (type === "image") {
      if (file.size > 20 * 1024 * 1024) {
        toast({
          title: "El archivo es muy pesado",
          description: "Por favor, sube un archivo que sea menor a 20MB",
          variant: "destructive",
        });

        return false;
      }
    } else if (type === "video") {
      if (file.size > 50 * 1024 * 1024) {
        toast({
          title: "El archivo es muy pesado",
          description: "Por favor, sube un archivo que sea menor a 50MB",
          variant: "destructive",
        });
        return false;
      }
    }

    return true;
  };

  return (
    <IKContext
      publicKey={publicKey}
      urlEndpoint={urlEndpoint}
      authenticator={authenticator}
    >
      <IKUpload
        ref={ikUploadRef}
        onError={onError}
        onSuccess={onSuccess}
        useUniqueFileName={true}
        validateFile={onValidate}
        onUploadStart={() => setProgress(0)}
        onUploadProgress={({ loaded, total }: { loaded: number; total: number }) => {
          const percent = Math.round((loaded / total) * 100);
          setProgress(percent);
        }}
        folder={folder}
        accept={accept}
        className="hidden"
      />

      <button
        className={cn("upload-btn", styles.button)}
        onClick={(e) => {
          e.preventDefault();

          if (ikUploadRef.current) {
            // @ts-ignore
            ikUploadRef.current?.click();
          }
        }}
      >
        <Image
          src="/icons/upload.svg"
          alt="upload-icon"
          width={20}
          height={20}
          className="object-contain"
        />

        <p className={cn("text-base", styles.placeholder)}>{placeholder}</p>

        
        
      </button>

      {progress > 0 && progress !== 100 && (
        <div className="w-full rounded-full bg-green-200">
          <div className="progress" style={{ width: `${progress}%` }}>
            {progress}%
          </div>
        </div>
      )}

      {file &&
        (type === "image" ? (
          <IKImage
            alt={file.filePath.split('/').pop() || 'Imagen subida'}
            path={file.filePath}
            width={500}
            height={300}
          />
        ) : type === "video" ? (
          <IKVideo
            path={file.filePath}
            controls={true}
            className="h-96 w-full rounded-xl"
          />
        ) : null)}
    </IKContext>
  );
};

export default FileUpload;