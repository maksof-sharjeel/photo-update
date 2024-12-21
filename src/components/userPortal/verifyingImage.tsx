import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "../ui/label";
import { Upload } from "lucide-react";
import { useState } from "react";
import Image from "next/image";
import { blobToBase64 } from "@/lib/utils";
import { api } from "@/trpc-server/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function VerifyingImage() {
  const { mutateAsync: checkSession } = api.userAuth.checkToken.useMutation();
  const { mutateAsync: photoUpload, isLoading } = api.manageUploads.create.useMutation();
  const token = localStorage.getItem('sessionToken');
  const [preview, setPreview] = useState<string | null>(null);
  const [base64Url, setBase64Url] = useState('');
  const router = useRouter()
  const form = useForm({
    defaultValues: {
      image: null,
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (!file.type.startsWith("image/")) {
        form.setError("image", {
          type: "manual",
          message: "Please upload a valid image file.",
        });
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        form.setError("image", {
          type: "manual",
          message: "Image size must be less than 10MB.",
        });
        return;
      }

      form.clearErrors("image");

      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);

      try {
        const blobBase64 = await blobToBase64(file);
        setBase64Url(blobBase64)
      } catch (error) {
        console.error("Error converting Blob to Base64:", error);
      }
    }
  };

  const onSubmit = async (data: any) => {
    if (token) {
      const user = await checkSession({ token });
      if (base64Url) {
        const userId = user?.userId;
        if (userId) {
          photoUpload({
            base64url: base64Url,
            userId,
          });
          setPreview(null)
        }
      } else {
        console.error("Image URL could not be generated.");
      }
    } else {
      toast.error("Please Login First");
    }
    router.refresh()
  };

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">
                  Upload Image
                </FormLabel>
                <FormControl>
                  <>
                    <div className="flex justify-center items-center px-6 pt-5 border-2 border-dotted border-gray-700 hover:border-green-700 rounded-lg mt-4">
                      <div className="space-y-1 text-center">
                        <Upload className="mx-auto h-8 w-8 text-gray-700 hover:text-green-700" />
                        <div className="text-xs text-gray-600 text-center">
                          <Label
                            htmlFor="image-upload"
                            className="cursor-pointer font-bold"
                          >
                            <span className="text-green-700">Upload a file</span>
                            <Input
                              type="file"
                              id="image-upload"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => {
                                handleFileChange(e);
                                field.onChange(e.target.files?.[0]);
                              }}
                            />
                          </Label>
                          <p className="pt-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500 pb-3">
                          PNG, JPG, GIF, up to 10MB
                        </p>
                      </div>
                    </div>
                    {preview && (
                      <div className="mt-4 mb-3 flex justify-center">
                        <Image
                          src={preview}
                          alt="Image Preview"
                          className="max-w-xs h-auto rounded-lg shadow-md object-cover"
                          width={250}
                          height={250}
                        />
                      </div>
                    )}
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {form.formState.errors.image && (
            <p className="text-red-600 text-xs">{form.formState.errors.image.message}</p>
          )}

          <div className="flex items-center justify-center">
            <Button
              type="submit"
              disabled={!preview}
              className="w-full bg-green-700 hover:bg-green-600 text-white text-sm"
            >
              Upload Image
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
