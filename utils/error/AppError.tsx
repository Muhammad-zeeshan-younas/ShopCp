import { toast } from "sonner";

class AppError extends Error {
  constructor(message: string) {
    super(message);
    toast.error(message);
  }
}

export { AppError };
