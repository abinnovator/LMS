"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";
import {
  RenderErrorState,
  RenderState,
  RenderUploadingState,
  SuccessState,
} from "./RenderState";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { useConstructUrl } from "@/hooks/use-construct-url";

interface uploaderState {
  id: string | null;
  file: File | null;
  uploading: boolean;
  progress: number;
  key?: string;
  isDeleting: boolean;
  error: boolean;
  objectUrl?: string;
  fileType: "image" | "video";
}
interface iAppProps {
  value?: string;
  onChange: (value: string) => void;
}
const Uploader = ({ value, onChange }: iAppProps) => {
  const fileUrl = useConstructUrl(value || "");
  const [fileState, setFileState] = useState<uploaderState>({
    error: false,
    file: null,
    id: null,
    uploading: false,
    progress: 0,
    fileType: "image",
    isDeleting: false,
    key: value,
    objectUrl: fileUrl,
  });
  async function uploadFile(file: File) {
    setFileState((prev) => ({ ...prev, uploading: true, progress: 0 }));
    try {
      // 1. Get presigned URl
      const presignedResponse = await fetch("/api/s3/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });
      if (!presignedResponse.ok) {
        toast.error("Failed to get presigned URL");
        setFileState((prev) => ({
          ...prev,
          uploading: false,
          progress: 0,
          error: true,
        }));
        return;
      }
      const { presignedUrl, key } = await presignedResponse.json();

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable) {
            const progressPercentage = (event.loaded / event.total) * 100;
            setFileState((prev) => ({
              ...prev,
              progress: Math.round(progressPercentage),
            }));
          }
        };
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState((prev) => ({
              ...prev,
              progress: 100,
              uploading: false,
              key: key,
            }));
            onChange?.(key);
            toast.success("File uploaded successfully");
            resolve();
          } else {
            toast.error("Failed to upload file");
            reject(new Error("Failed to upload file"));
          }
        };
        xhr.upload.onerror = () => {
          toast.error("Failed to upload file");
          reject(new Error("Failed to upload file"));
        };
        xhr.open("PUT", presignedUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });
    } catch (error) {
      toast.error("Something went wrong");
      setFileState((prev) => ({
        ...prev,
        uploading: false,
        progress: 0,
        error: true,
      }));
      console.log(error);
    }
  }
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      // Do something with the files

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }
        setFileState({
          file: file,
          uploading: false,
          progress: 0,
          objectUrl: URL.createObjectURL(file),
          error: false,
          id: uuidv4(),
          isDeleting: false,
          fileType: "image",
        });
        uploadFile(file);
      }
    },
    [fileState.objectUrl]
  );
  async function handleRemoveFile() {
    if (!fileState.isDeleting && fileState.objectUrl) {
      try {
        setFileState((prev) => ({
          ...prev,
          isDeleting: true,
        }));
        const response = await fetch("/api/s3/delete", {
          method: "Delete",
          headers: { "Content-type": "application/json" },
          body: JSON.stringify({ key: fileState.key }),
        });
        if (!response.ok) {
          toast.error("Failed to delete file");
          setFileState((prev) => ({
            ...prev,
            isDeleting: false,
            error: true,
          }));
          return;
        }
        if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
          URL.revokeObjectURL(fileState.objectUrl);
        }

        onChange?.("");
        setFileState(() => ({
          file: null,
          uploading: false,
          progress: 0,
          isDeleting: false,
          objectUrl: undefined,
          key: undefined,
          fileType: "image",
          id: null,
          error: false,
        }));
        toast.success("File removed successfully");
      } catch (error) {
        toast.error("Error removing file. Please try again.");
        setFileState((prev) => ({
          ...prev,
          isDeleting: false,
          error: true,
        }));
      }
    }
  }
  function renderContent() {
    if (fileState.error) {
      return <RenderErrorState />;
    }
    if (fileState.uploading) {
      return (
        <RenderUploadingState
          progress={fileState.progress}
          file={fileState.file!}
        />
      );
    }
    if (fileState.objectUrl) {
      return (
        <SuccessState
          previewUrl={fileState.objectUrl}
          isDeleting={fileState.isDeleting}
          handleDelete={handleRemoveFile}
        />
      );
    }
    return <RenderState isDragActive={false} />;
  }
  useEffect(() => {
    return () => {
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl);
      }
    };
  }, [fileState.objectUrl]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
    multiple: false,
    maxSize: 5 * 1024 * 1024, // 5 mb calc
    onDropRejected: rejectedFiles,
    disabled:
      fileState.isDeleting || !!fileState.objectUrl || fileState.uploading,
  });
  function rejectedFiles(fileRejection: FileRejection[]) {
    const tooManyFiles = fileRejection.find(
      (rejection) => rejection.errors[0].code === "too-many-files"
    );
    const fileSizeToBig = fileRejection.find(
      (rejection) => rejection.errors[0].code === "file-too-large"
    );
    if (tooManyFiles) {
      toast.error("Too many files selected. Max is 1");
    }
    if (fileSizeToBig) {
      toast.error("The file size is too much. The maximum size is 5mb");
    }
  }
  return (
    <Card
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed transition-colors duration-200 ease-in-out w-full h-64",
        isDragActive
          ? "border-primary bg-primary/10 border-solid"
          : "border-border hover:border-primary"
      )}
    >
      <CardContent className="flex items-center justify-center h-full w-full p-4">
        <input {...getInputProps()} />
        {/* {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag &apos;n&apos; drop some files here, or click to select files
          </p>
        )} */}
        {renderContent()}
      </CardContent>
    </Card>
  );
};

export default Uploader;
