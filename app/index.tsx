import { useAppStore } from "@/store/useAppStore";
import { Redirect, type Href } from "expo-router";

export default function RedirectPage() {
  const isAuthenticated = useAppStore((s) => !!s.accessToken);
  const href = (isAuthenticated ? "(home)" : "login") as Href;

  return <Redirect href={href} />;
}
