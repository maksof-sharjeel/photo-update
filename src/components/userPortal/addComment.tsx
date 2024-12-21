"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { api } from "@/trpc-server/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card } from "../ui/card";

const formSchema = z.object({
  content: z.string(),
  photoId: z.string(),
  userId: z.string()
});

type reportForm = z.infer<typeof formSchema>;

export function AddComment() {
  const { mutateAsync: checkSession } = api.userAuth.checkToken.useMutation();
  const token = localStorage.getItem('sessionToken');
  const { mutateAsync: commentCreate } = api.manageUploads.createComment.useMutation();
  const { mutateAsync: getAll } = api.manageUploads.getAll.useMutation();
  const form = useForm<reportForm>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
  });
  const [userId, setUserId] = useState('');
  const [data, setData] = useState<any>();
  const [comments, setComments] = useState<{ [key: string]: string }>({});
  const [loadingStates, setLoadingStates] = useState<{ [key: string]: boolean }>({});
  const router = useRouter();

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
        setData(data);
      };
      fetchData();
      router.refresh();
    }
  }, [userId]);

  const handleCommentChange = (event: any, photoId: string) => {
    setComments(prev => ({
      ...prev,
      [photoId]: event.target.value,
    }));
  };

  const handleButtonClick = async (photoId: string) => {
    // Set loading state for specific photoId
    setLoadingStates(prev => ({ ...prev, [photoId]: true }));

    // Create the comment
    await commentCreate({
      content: comments[photoId],
      photoId: photoId,
      userId: userId,
    });

    // Set loading state back to false
    setLoadingStates(prev => ({ ...prev, [photoId]: false }));

    // Reset comment after posting
    setComments(prev => ({ ...prev, [photoId]: '' }));

    // Refresh the page
    router.refresh();
  };

  return (
    <Card className="p-5">
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Image</th>
            <th className="px-4 py-2">Comments</th>
          </tr>
        </thead>
        <tbody>
          {data && data.map((imageItem: any) => (
            <tr key={imageItem.id}>
              <td className="px-4 py-2 text-center">
                <img
                  src={imageItem.url}
                  alt="Uploaded"
                  className="w-32 h-32 object-cover rounded-lg"
                />
              </td>
              <td className="px-4 py-2">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Input
                      type="text"
                      placeholder="Add a comment"
                      className="px-2 py-1 border rounded-md text-sm w-full"
                      value={comments[imageItem.id] || ''}
                      onChange={(event) => handleCommentChange(event, imageItem.id)}
                    />
                    <Button
                      type="button"
                      className="w-45"
                      onClick={() => handleButtonClick(imageItem.id)}
                      disabled={loadingStates[imageItem.id] || false}
                    >
                      {loadingStates[imageItem.id] ? "Adding..." : "Add Comment"}
                    </Button>
                  </div>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}
