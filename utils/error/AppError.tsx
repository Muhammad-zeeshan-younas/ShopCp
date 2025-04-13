import { toast } from "sonner";

class AppError extends Error {
  constructor(message: string) {
    super(message);
    toast.error(message, {
      duration: 1000,
      action: {
        label: "Cancel",
        onClick: () => {},
      },
    });
  }
}

export { AppError };
