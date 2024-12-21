"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { any, z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { VerifyingImage } from "./verifyingImage";
import { api } from "@/trpc-server/react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  content: z.string(),
  photoId: z.string(),
  userId: z.string()
});

type reportForm = z.infer<typeof formSchema>;

export function UploadPhoto() {
  const { mutateAsync: checkSession } = api.userAuth.checkToken.useMutation();
  const token = localStorage.getItem('sessionToken');
  const { mutateAsync: commentCreate, isLoading } =
    api.manageUploads.
      createComment.useMutation();
  const { mutateAsync: getAll, } =
    api.manageUploads.
      getAll.useMutation();
  const form = useForm<reportForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const [comment, setComment] = useState('');
  const [userId, setUserId] = useState('');
  const [data, setData] = useState<any>();
  const router =useRouter()


  const handleCommentChange = (event: any) => {
    setComment(event.target.value);
  };
  useEffect(() => {
    const check = async () => {
      if (token) {
        const user = await checkSession({ token });
        const id = user?.userId;
        if (id) {
          setUserId(id);
        }
      } else {
        toast.error("login First Please");
      }
    };
    check();
  }, [token]);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const data = await getAll({ userId });
        setData(data)
      };
      fetchData();
      router.refresh()
    }
  }, [userId])
  const handleButtonClick = async (photoId:string) => {
    commentCreate({
      content: comment,
      photoId: photoId,
      userId: userId

    })
    router.refresh()
    setComment('')
  };

  return (
    <div className="max-w-full">
      <VerifyingImage />
      <Card className="p-5">
        <table className="min-w-full table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2">Image</th>
              <th className="px-4 py-2">Comments</th>
            </tr>
          </thead>
          <tbody>
            {/* Iterate through the data array */}
            {data && data.map((imageItem:any) => (
              <tr key={imageItem.id}>
                {/* Display image using URL from the data */}
                <td className="px-4 py-2 text-center">
                  <img
                    src={imageItem.url} // Dynamically render the image URL
                    alt="Uploaded"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </td>
                <td className="px-4 py-2">
                  <div className="space-y-2">
                    {/* Dynamically render comments */}
                    {imageItem.comments.length > 0 ? (
                      imageItem.comments.map((comment:any, index:any) => (
                        <p key={index} className="text-sm text-gray-700">{comment.content}</p>
                      ))
                    ) : (
                      <p className="text-sm text-gray-700">No comments yet.</p>
                    )}
                    <div className="flex items-center space-x-2">
                      <Input
                        type="text"
                        placeholder="Add a comment"
                        className="px-2 py-1 border rounded-md text-sm w-full"
                        value={comment}
                        onChange={handleCommentChange}
                      />
                      <Button
                        type="button"
                        className="w-45"
                        onClick={() => handleButtonClick(imageItem.id)}
                        disabled={isLoading}
                      >
                        {isLoading ? "Adding..." : "Add Comment"}
                      </Button>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>


    </div>
  );
}
