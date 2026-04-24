import { useQuery } from "@tanstack/react-query";
import { fetchSkills } from "../lib/settings-api.js";

export function useSkills() {
  const query = useQuery({
    queryKey: ["skills"],
    queryFn: fetchSkills,
  });

  const skills = query.data?.skills || [];

  return { skills, query };
}
