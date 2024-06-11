import { Skeleton, Stack } from "@mui/material";

function ChatLoading() {
  return (
    <div>
      <Stack spacing={2}>
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
        <Skeleton animation="wave" />
      </Stack>
    </div>
  );
}

export default ChatLoading;
