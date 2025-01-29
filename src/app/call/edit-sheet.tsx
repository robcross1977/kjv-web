import { Call } from "@prisma/client";

export default function EditSheet({
  open,
  setOpen,
  selectedCall,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  selectedCall: Call;
}) {
  return <div>EditSheet</div>;
}
