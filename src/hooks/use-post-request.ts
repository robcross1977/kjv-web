import useSWRMutation from "swr/mutation";

async function postRequest(url: string, { arg }: { arg: unknown }) {
  await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${arg}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
}

export const usePostRequest = (url: string) => {
  const { data, trigger, isMutating } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_URL}/${url}`,
    postRequest
  );

  return { data, trigger, isMutating };
};
