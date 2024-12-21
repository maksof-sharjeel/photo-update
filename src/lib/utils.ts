import { clsx, type ClassValue } from "clsx"
// import { useRouter } from "next/router";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function redirectToDashboard(token: string | null) {
  if (token) {
    window.location.href = `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/dashboard`;
  } else {
    toast.error("User is not logged in. Please log in to continue.");
  }
}

export function checkLoginStatus() {
  const token = localStorage.getItem('sessionToken');
  
  if (token) {
    redirectToDashboard(token);
  } else {
    window.location.href =  `${process.env.NEXT_PUBLIC_CUSTOMER_URL}/auth/login`
    toast.error("No valid session token found.");
  }
}
export const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      if (reader.result) {
        resolve(reader.result.toString());
      } else {
        reject("Failed to convert Blob to Base64");
      }
    };
    reader.onerror = () => {
      reject("Error reading Blob");
    };
    reader.readAsDataURL(blob);
  });
};
