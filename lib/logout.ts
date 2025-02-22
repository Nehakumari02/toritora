
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export const useLogout = () => {
  const router = useRouter();
  const { toast } = useToast();

  const logout = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/logout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (res.status === 200) {
        localStorage.removeItem("userProfession");
        router.replace("/onboard");
      } else {
        toast({
          title: "Unauthorized request",
          description: "Invalid token found, logging out",
          variant: "destructive",
        });
        router.replace("/onboard");
      }
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Something went wrong while logging out",
        variant: "destructive",
      });
    }
  };

  return logout;
};
