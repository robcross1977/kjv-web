import { Call, Phone } from "@prisma/client";

export type CallWithPhone = Call & { phone: Phone };
