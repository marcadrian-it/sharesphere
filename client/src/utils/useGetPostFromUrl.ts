import { useGetIntId } from "./useGetIntId";
import { usePostQuery } from "../generated/graphql";

export const useGetPostFromUrl = () => {
  const intId = useGetIntId();
  return usePostQuery({
    skip: intId === -1,
    variables: {
      id: intId,
    },
  });
};
