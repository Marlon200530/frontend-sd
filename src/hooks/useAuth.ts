import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getMe,
  login,
  logout,
  register,
  type LoginPayload,
  type RegisterPayload,
} from "../services/auth.service";
import { hasAuthTokens } from "../utils/token";

export function useMe() {
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getMe,
    retry: false,
    enabled: hasAuthTokens(),
  });
}

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: LoginPayload) => login(payload),

    onSuccess: (authData) => {
      queryClient.setQueryData(["auth", "me"], authData.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => register(payload),
  });
}

export function useLogout() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logout,

    onSuccess: () => {
      queryClient.clear();
    },
  });
}
