export type ApiResponse<T> = {
  success: boolean;
  data: T;
  meta?: unknown;
};

export type ApiErrorResponse = {
  success: false;
  error: {
    code: string;
    message: string;
    details?: {
      field: string;
      message: string;
    }[];
  };
};