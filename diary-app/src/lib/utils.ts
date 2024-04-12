import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

export const formatTimestamp = (timestamp: string) =>
  format(new Date(timestamp), "do LLL h:mm a (O)");
