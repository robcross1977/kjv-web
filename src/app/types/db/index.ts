import { z } from "zod";
import type { Prisma } from "@prisma/client";

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum([
  "ReadUncommitted",
  "ReadCommitted",
  "RepeatableRead",
  "Serializable",
]);

export const AdminScalarFieldEnumSchema = z.enum(["id", "email", "name"]);

export const PhoneStatusScalarFieldEnumSchema = z.enum([
  "id",
  "status",
  "createdAt",
  "updatedAt",
]);

export const PhoneNumberScalarFieldEnumSchema = z.enum([
  "id",
  "number",
  "statusId",
  "createdAt",
  "updatedAt",
]);

export const CallScalarFieldEnumSchema = z.enum([
  "id",
  "phoneNumberId",
  "createdAt",
  "updatedAt",
]);

export const SortOrderSchema = z.enum(["asc", "desc"]);

export const QueryModeSchema = z.enum(["default", "insensitive"]);
/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// ADMIN SCHEMA
/////////////////////////////////////////

export const AdminSchema = z.object({
  id: z.number().int(),
  email: z.string(),
  name: z.string(),
});

export type Admin = z.infer<typeof AdminSchema>;

/////////////////////////////////////////
// PHONE STATUS SCHEMA
/////////////////////////////////////////

export const PhoneStatusSchema = z.object({
  id: z.number().int(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PhoneStatus = z.infer<typeof PhoneStatusSchema>;

/////////////////////////////////////////
// PHONE NUMBER SCHEMA
/////////////////////////////////////////

export const PhoneNumberSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  statusId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type PhoneNumber = z.infer<typeof PhoneNumberSchema>;

/////////////////////////////////////////
// CALL SCHEMA
/////////////////////////////////////////

export const CallSchema = z.object({
  id: z.number().int(),
  phoneNumberId: z.number().int(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
});

export type Call = z.infer<typeof CallSchema>;

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ADMIN
//------------------------------------------------------

export const AdminSelectSchema: z.ZodType<Prisma.AdminSelect> = z
  .object({
    id: z.boolean().optional(),
    email: z.boolean().optional(),
    name: z.boolean().optional(),
  })
  .strict();

// PHONE STATUS
//------------------------------------------------------

export const PhoneStatusIncludeSchema: z.ZodType<Prisma.PhoneStatusInclude> = z
  .object({
    phones: z
      .union([z.boolean(), z.lazy(() => PhoneNumberFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => PhoneStatusCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const PhoneStatusArgsSchema: z.ZodType<Prisma.PhoneStatusDefaultArgs> = z
  .object({
    select: z.lazy(() => PhoneStatusSelectSchema).optional(),
    include: z.lazy(() => PhoneStatusIncludeSchema).optional(),
  })
  .strict();

export const PhoneStatusCountOutputTypeArgsSchema: z.ZodType<Prisma.PhoneStatusCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => PhoneStatusCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const PhoneStatusCountOutputTypeSelectSchema: z.ZodType<Prisma.PhoneStatusCountOutputTypeSelect> =
  z
    .object({
      phones: z.boolean().optional(),
    })
    .strict();

export const PhoneStatusSelectSchema: z.ZodType<Prisma.PhoneStatusSelect> = z
  .object({
    id: z.boolean().optional(),
    status: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    phones: z
      .union([z.boolean(), z.lazy(() => PhoneNumberFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => PhoneStatusCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// PHONE NUMBER
//------------------------------------------------------

export const PhoneNumberIncludeSchema: z.ZodType<Prisma.PhoneNumberInclude> = z
  .object({
    status: z
      .union([z.boolean(), z.lazy(() => PhoneStatusArgsSchema)])
      .optional(),
    calls: z
      .union([z.boolean(), z.lazy(() => CallFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => PhoneNumberCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

export const PhoneNumberArgsSchema: z.ZodType<Prisma.PhoneNumberDefaultArgs> = z
  .object({
    select: z.lazy(() => PhoneNumberSelectSchema).optional(),
    include: z.lazy(() => PhoneNumberIncludeSchema).optional(),
  })
  .strict();

export const PhoneNumberCountOutputTypeArgsSchema: z.ZodType<Prisma.PhoneNumberCountOutputTypeDefaultArgs> =
  z
    .object({
      select: z.lazy(() => PhoneNumberCountOutputTypeSelectSchema).nullish(),
    })
    .strict();

export const PhoneNumberCountOutputTypeSelectSchema: z.ZodType<Prisma.PhoneNumberCountOutputTypeSelect> =
  z
    .object({
      calls: z.boolean().optional(),
    })
    .strict();

export const PhoneNumberSelectSchema: z.ZodType<Prisma.PhoneNumberSelect> = z
  .object({
    id: z.boolean().optional(),
    number: z.boolean().optional(),
    statusId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    status: z
      .union([z.boolean(), z.lazy(() => PhoneStatusArgsSchema)])
      .optional(),
    calls: z
      .union([z.boolean(), z.lazy(() => CallFindManyArgsSchema)])
      .optional(),
    _count: z
      .union([z.boolean(), z.lazy(() => PhoneNumberCountOutputTypeArgsSchema)])
      .optional(),
  })
  .strict();

// CALL
//------------------------------------------------------

export const CallIncludeSchema: z.ZodType<Prisma.CallInclude> = z
  .object({
    phoneNumber: z
      .union([z.boolean(), z.lazy(() => PhoneNumberArgsSchema)])
      .optional(),
  })
  .strict();

export const CallArgsSchema: z.ZodType<Prisma.CallDefaultArgs> = z
  .object({
    select: z.lazy(() => CallSelectSchema).optional(),
    include: z.lazy(() => CallIncludeSchema).optional(),
  })
  .strict();

export const CallSelectSchema: z.ZodType<Prisma.CallSelect> = z
  .object({
    id: z.boolean().optional(),
    phoneNumberId: z.boolean().optional(),
    createdAt: z.boolean().optional(),
    updatedAt: z.boolean().optional(),
    phoneNumber: z
      .union([z.boolean(), z.lazy(() => PhoneNumberArgsSchema)])
      .optional(),
  })
  .strict();

/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AdminWhereInputSchema: z.ZodType<Prisma.AdminWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => AdminWhereInputSchema),
        z.lazy(() => AdminWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => AdminWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => AdminWhereInputSchema),
        z.lazy(() => AdminWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    email: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
    name: z.union([z.lazy(() => StringFilterSchema), z.string()]).optional(),
  })
  .strict();

export const AdminOrderByWithRelationInputSchema: z.ZodType<Prisma.AdminOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AdminWhereUniqueInputSchema: z.ZodType<Prisma.AdminWhereUniqueInput> =
  z
    .union([
      z.object({
        id: z.number().int(),
        email: z.string(),
      }),
      z.object({
        id: z.number().int(),
      }),
      z.object({
        email: z.string(),
      }),
    ])
    .and(
      z
        .object({
          id: z.number().int().optional(),
          email: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => AdminWhereInputSchema),
              z.lazy(() => AdminWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => AdminWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => AdminWhereInputSchema),
              z.lazy(() => AdminWhereInputSchema).array(),
            ])
            .optional(),
          name: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
        })
        .strict()
    );

export const AdminOrderByWithAggregationInputSchema: z.ZodType<Prisma.AdminOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => AdminCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => AdminAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => AdminMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => AdminMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => AdminSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const AdminScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AdminScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => AdminScalarWhereWithAggregatesInputSchema),
          z.lazy(() => AdminScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => AdminScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => AdminScalarWhereWithAggregatesInputSchema),
          z.lazy(() => AdminScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      email: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      name: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
    })
    .strict();

export const PhoneStatusWhereInputSchema: z.ZodType<Prisma.PhoneStatusWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => PhoneStatusWhereInputSchema),
          z.lazy(() => PhoneStatusWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => PhoneStatusWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => PhoneStatusWhereInputSchema),
          z.lazy(() => PhoneStatusWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      status: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      phones: z.lazy(() => PhoneNumberListRelationFilterSchema).optional(),
    })
    .strict();

export const PhoneStatusOrderByWithRelationInputSchema: z.ZodType<Prisma.PhoneStatusOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      phones: z
        .lazy(() => PhoneNumberOrderByRelationAggregateInputSchema)
        .optional(),
    })
    .strict();

export const PhoneStatusWhereUniqueInputSchema: z.ZodType<Prisma.PhoneStatusWhereUniqueInput> =
  z
    .union([
      z.object({
        id: z.number().int(),
        status: z.string(),
      }),
      z.object({
        id: z.number().int(),
      }),
      z.object({
        status: z.string(),
      }),
    ])
    .and(
      z
        .object({
          id: z.number().int().optional(),
          status: z.string().optional(),
          AND: z
            .union([
              z.lazy(() => PhoneStatusWhereInputSchema),
              z.lazy(() => PhoneStatusWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => PhoneStatusWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => PhoneStatusWhereInputSchema),
              z.lazy(() => PhoneStatusWhereInputSchema).array(),
            ])
            .optional(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          phones: z.lazy(() => PhoneNumberListRelationFilterSchema).optional(),
        })
        .strict()
    );

export const PhoneStatusOrderByWithAggregationInputSchema: z.ZodType<Prisma.PhoneStatusOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => PhoneStatusCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z.lazy(() => PhoneStatusAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => PhoneStatusMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => PhoneStatusMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => PhoneStatusSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const PhoneStatusScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PhoneStatusScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema),
          z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema),
          z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      status: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberWhereInputSchema: z.ZodType<Prisma.PhoneNumberWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => PhoneNumberWhereInputSchema),
          z.lazy(() => PhoneNumberWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => PhoneNumberWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => PhoneNumberWhereInputSchema),
          z.lazy(() => PhoneNumberWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      number: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      statusId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      status: z
        .union([
          z.lazy(() => PhoneStatusScalarRelationFilterSchema),
          z.lazy(() => PhoneStatusWhereInputSchema),
        ])
        .optional(),
      calls: z.lazy(() => CallListRelationFilterSchema).optional(),
    })
    .strict();

export const PhoneNumberOrderByWithRelationInputSchema: z.ZodType<Prisma.PhoneNumberOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      number: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      status: z
        .lazy(() => PhoneStatusOrderByWithRelationInputSchema)
        .optional(),
      calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional(),
    })
    .strict();

export const PhoneNumberWhereUniqueInputSchema: z.ZodType<Prisma.PhoneNumberWhereUniqueInput> =
  z
    .object({
      id: z.number().int(),
    })
    .and(
      z
        .object({
          id: z.number().int().optional(),
          AND: z
            .union([
              z.lazy(() => PhoneNumberWhereInputSchema),
              z.lazy(() => PhoneNumberWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => PhoneNumberWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => PhoneNumberWhereInputSchema),
              z.lazy(() => PhoneNumberWhereInputSchema).array(),
            ])
            .optional(),
          number: z
            .union([z.lazy(() => StringFilterSchema), z.string()])
            .optional(),
          statusId: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          status: z
            .union([
              z.lazy(() => PhoneStatusScalarRelationFilterSchema),
              z.lazy(() => PhoneStatusWhereInputSchema),
            ])
            .optional(),
          calls: z.lazy(() => CallListRelationFilterSchema).optional(),
        })
        .strict()
    );

export const PhoneNumberOrderByWithAggregationInputSchema: z.ZodType<Prisma.PhoneNumberOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      number: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z
        .lazy(() => PhoneNumberCountOrderByAggregateInputSchema)
        .optional(),
      _avg: z.lazy(() => PhoneNumberAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => PhoneNumberMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => PhoneNumberMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => PhoneNumberSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const PhoneNumberScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PhoneNumberScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => PhoneNumberScalarWhereWithAggregatesInputSchema),
          z.lazy(() => PhoneNumberScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => PhoneNumberScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => PhoneNumberScalarWhereWithAggregatesInputSchema),
          z.lazy(() => PhoneNumberScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      number: z
        .union([z.lazy(() => StringWithAggregatesFilterSchema), z.string()])
        .optional(),
      statusId: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const CallWhereInputSchema: z.ZodType<Prisma.CallWhereInput> = z
  .object({
    AND: z
      .union([
        z.lazy(() => CallWhereInputSchema),
        z.lazy(() => CallWhereInputSchema).array(),
      ])
      .optional(),
    OR: z
      .lazy(() => CallWhereInputSchema)
      .array()
      .optional(),
    NOT: z
      .union([
        z.lazy(() => CallWhereInputSchema),
        z.lazy(() => CallWhereInputSchema).array(),
      ])
      .optional(),
    id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
    phoneNumberId: z
      .union([z.lazy(() => IntFilterSchema), z.number()])
      .optional(),
    createdAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    updatedAt: z
      .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
      .optional(),
    phoneNumber: z
      .union([
        z.lazy(() => PhoneNumberScalarRelationFilterSchema),
        z.lazy(() => PhoneNumberWhereInputSchema),
      ])
      .optional(),
  })
  .strict();

export const CallOrderByWithRelationInputSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      phoneNumber: z
        .lazy(() => PhoneNumberOrderByWithRelationInputSchema)
        .optional(),
    })
    .strict();

export const CallWhereUniqueInputSchema: z.ZodType<Prisma.CallWhereUniqueInput> =
  z
    .object({
      id: z.number().int(),
    })
    .and(
      z
        .object({
          id: z.number().int().optional(),
          AND: z
            .union([
              z.lazy(() => CallWhereInputSchema),
              z.lazy(() => CallWhereInputSchema).array(),
            ])
            .optional(),
          OR: z
            .lazy(() => CallWhereInputSchema)
            .array()
            .optional(),
          NOT: z
            .union([
              z.lazy(() => CallWhereInputSchema),
              z.lazy(() => CallWhereInputSchema).array(),
            ])
            .optional(),
          phoneNumberId: z
            .union([z.lazy(() => IntFilterSchema), z.number().int()])
            .optional(),
          createdAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          updatedAt: z
            .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
            .optional(),
          phoneNumber: z
            .union([
              z.lazy(() => PhoneNumberScalarRelationFilterSchema),
              z.lazy(() => PhoneNumberWhereInputSchema),
            ])
            .optional(),
        })
        .strict()
    );

export const CallOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
      _count: z.lazy(() => CallCountOrderByAggregateInputSchema).optional(),
      _avg: z.lazy(() => CallAvgOrderByAggregateInputSchema).optional(),
      _max: z.lazy(() => CallMaxOrderByAggregateInputSchema).optional(),
      _min: z.lazy(() => CallMinOrderByAggregateInputSchema).optional(),
      _sum: z.lazy(() => CallSumOrderByAggregateInputSchema).optional(),
    })
    .strict();

export const CallScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallScalarWhereWithAggregatesInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => CallScalarWhereWithAggregatesInputSchema),
          z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => CallScalarWhereWithAggregatesInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => CallScalarWhereWithAggregatesInputSchema),
          z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array(),
        ])
        .optional(),
      id: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      phoneNumberId: z
        .union([z.lazy(() => IntWithAggregatesFilterSchema), z.number()])
        .optional(),
      createdAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.lazy(() => DateTimeWithAggregatesFilterSchema),
          z.coerce.date(),
        ])
        .optional(),
    })
    .strict();

export const AdminCreateInputSchema: z.ZodType<Prisma.AdminCreateInput> = z
  .object({
    email: z.string(),
    name: z.string().optional(),
  })
  .strict();

export const AdminUncheckedCreateInputSchema: z.ZodType<Prisma.AdminUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      email: z.string(),
      name: z.string().optional(),
    })
    .strict();

export const AdminUpdateInputSchema: z.ZodType<Prisma.AdminUpdateInput> = z
  .object({
    email: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
    name: z
      .union([z.string(), z.lazy(() => StringFieldUpdateOperationsInputSchema)])
      .optional(),
  })
  .strict();

export const AdminUncheckedUpdateInputSchema: z.ZodType<Prisma.AdminUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AdminCreateManyInputSchema: z.ZodType<Prisma.AdminCreateManyInput> =
  z
    .object({
      id: z.number().int().optional(),
      email: z.string(),
      name: z.string().optional(),
    })
    .strict();

export const AdminUpdateManyMutationInputSchema: z.ZodType<Prisma.AdminUpdateManyMutationInput> =
  z
    .object({
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const AdminUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AdminUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      email: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      name: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusCreateInputSchema: z.ZodType<Prisma.PhoneStatusCreateInput> =
  z
    .object({
      status: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      phones: z
        .lazy(() => PhoneNumberCreateNestedManyWithoutStatusInputSchema)
        .optional(),
    })
    .strict();

export const PhoneStatusUncheckedCreateInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      status: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      phones: z
        .lazy(
          () => PhoneNumberUncheckedCreateNestedManyWithoutStatusInputSchema
        )
        .optional(),
    })
    .strict();

export const PhoneStatusUpdateInputSchema: z.ZodType<Prisma.PhoneStatusUpdateInput> =
  z
    .object({
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      phones: z
        .lazy(() => PhoneNumberUpdateManyWithoutStatusNestedInputSchema)
        .optional(),
    })
    .strict();

export const PhoneStatusUncheckedUpdateInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      phones: z
        .lazy(
          () => PhoneNumberUncheckedUpdateManyWithoutStatusNestedInputSchema
        )
        .optional(),
    })
    .strict();

export const PhoneStatusCreateManyInputSchema: z.ZodType<Prisma.PhoneStatusCreateManyInput> =
  z
    .object({
      id: z.number().int().optional(),
      status: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const PhoneStatusUpdateManyMutationInputSchema: z.ZodType<Prisma.PhoneStatusUpdateManyMutationInput> =
  z
    .object({
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberCreateInputSchema: z.ZodType<Prisma.PhoneNumberCreateInput> =
  z
    .object({
      number: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      status: z.lazy(() => PhoneStatusCreateNestedOneWithoutPhonesInputSchema),
      calls: z
        .lazy(() => CallCreateNestedManyWithoutPhoneNumberInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedCreateInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      number: z.string(),
      statusId: z.number().int(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      calls: z
        .lazy(() => CallUncheckedCreateNestedManyWithoutPhoneNumberInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUpdateInputSchema: z.ZodType<Prisma.PhoneNumberUpdateInput> =
  z
    .object({
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .lazy(() => PhoneStatusUpdateOneRequiredWithoutPhonesNestedInputSchema)
        .optional(),
      calls: z
        .lazy(() => CallUpdateManyWithoutPhoneNumberNestedInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedUpdateInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      statusId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      calls: z
        .lazy(() => CallUncheckedUpdateManyWithoutPhoneNumberNestedInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberCreateManyInputSchema: z.ZodType<Prisma.PhoneNumberCreateManyInput> =
  z
    .object({
      id: z.number().int().optional(),
      number: z.string(),
      statusId: z.number().int(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const PhoneNumberUpdateManyMutationInputSchema: z.ZodType<Prisma.PhoneNumberUpdateManyMutationInput> =
  z
    .object({
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      statusId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallCreateInputSchema: z.ZodType<Prisma.CallCreateInput> = z
  .object({
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
    phoneNumber: z.lazy(
      () => PhoneNumberCreateNestedOneWithoutCallsInputSchema
    ),
  })
  .strict();

export const CallUncheckedCreateInputSchema: z.ZodType<Prisma.CallUncheckedCreateInput> =
  z
    .object({
      id: z.number().int().optional(),
      phoneNumberId: z.number().int(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const CallUpdateInputSchema: z.ZodType<Prisma.CallUpdateInput> = z
  .object({
    createdAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    updatedAt: z
      .union([
        z.coerce.date(),
        z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
      ])
      .optional(),
    phoneNumber: z
      .lazy(() => PhoneNumberUpdateOneRequiredWithoutCallsNestedInputSchema)
      .optional(),
  })
  .strict();

export const CallUncheckedUpdateInputSchema: z.ZodType<Prisma.CallUncheckedUpdateInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      phoneNumberId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallCreateManyInputSchema: z.ZodType<Prisma.CallCreateManyInput> =
  z
    .object({
      id: z.number().int().optional(),
      phoneNumberId: z.number().int(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const CallUpdateManyMutationInputSchema: z.ZodType<Prisma.CallUpdateManyMutationInput> =
  z
    .object({
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      phoneNumberId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    mode: z.lazy(() => QueryModeSchema).optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  })
  .strict();

export const AdminCountOrderByAggregateInputSchema: z.ZodType<Prisma.AdminCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AdminAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AdminAvgOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AdminMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AdminMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AdminMinOrderByAggregateInputSchema: z.ZodType<Prisma.AdminMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      email: z.lazy(() => SortOrderSchema).optional(),
      name: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const AdminSumOrderByAggregateInputSchema: z.ZodType<Prisma.AdminSumOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional(),
      in: z.number().array().optional(),
      notIn: z.number().array().optional(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedIntFilterSchema).optional(),
      _max: z.lazy(() => NestedIntFilterSchema).optional(),
    })
    .strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      mode: z.lazy(() => QueryModeSchema).optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z
  .object({
    equals: z.coerce.date().optional(),
    in: z.coerce.date().array().optional(),
    notIn: z.coerce.date().array().optional(),
    lt: z.coerce.date().optional(),
    lte: z.coerce.date().optional(),
    gt: z.coerce.date().optional(),
    gte: z.coerce.date().optional(),
    not: z
      .union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
      .optional(),
  })
  .strict();

export const PhoneNumberListRelationFilterSchema: z.ZodType<Prisma.PhoneNumberListRelationFilter> =
  z
    .object({
      every: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
      some: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
      none: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
    })
    .strict();

export const PhoneNumberOrderByRelationAggregateInputSchema: z.ZodType<Prisma.PhoneNumberOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneStatusCountOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneStatusAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusAvgOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneStatusMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneStatusMinOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      status: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneStatusSumOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusSumOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    })
    .strict();

export const PhoneStatusScalarRelationFilterSchema: z.ZodType<Prisma.PhoneStatusScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => PhoneStatusWhereInputSchema).optional(),
      isNot: z.lazy(() => PhoneStatusWhereInputSchema).optional(),
    })
    .strict();

export const CallListRelationFilterSchema: z.ZodType<Prisma.CallListRelationFilter> =
  z
    .object({
      every: z.lazy(() => CallWhereInputSchema).optional(),
      some: z.lazy(() => CallWhereInputSchema).optional(),
      none: z.lazy(() => CallWhereInputSchema).optional(),
    })
    .strict();

export const CallOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallOrderByRelationAggregateInput> =
  z
    .object({
      _count: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneNumberCountOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneNumberCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      number: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneNumberAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneNumberAvgOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneNumberMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneNumberMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      number: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneNumberMinOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneNumberMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      number: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneNumberSumOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneNumberSumOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      statusId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const PhoneNumberScalarRelationFilterSchema: z.ZodType<Prisma.PhoneNumberScalarRelationFilter> =
  z
    .object({
      is: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
      isNot: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
    })
    .strict();

export const CallCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallCountOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CallAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallAvgOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CallMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallMaxOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CallMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallMinOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
      createdAt: z.lazy(() => SortOrderSchema).optional(),
      updatedAt: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const CallSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallSumOrderByAggregateInput> =
  z
    .object({
      id: z.lazy(() => SortOrderSchema).optional(),
      phoneNumberId: z.lazy(() => SortOrderSchema).optional(),
    })
    .strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> =
  z
    .object({
      set: z.string().optional(),
    })
    .strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> =
  z
    .object({
      set: z.number().optional(),
      increment: z.number().optional(),
      decrement: z.number().optional(),
      multiply: z.number().optional(),
      divide: z.number().optional(),
    })
    .strict();

export const PhoneNumberCreateNestedManyWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberCreateNestedManyWithoutStatusInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema),
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema).array(),
          z.lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => PhoneNumberCreateManyStatusInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedCreateNestedManyWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedCreateNestedManyWithoutStatusInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema),
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema).array(),
          z.lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => PhoneNumberCreateManyStatusInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> =
  z
    .object({
      set: z.coerce.date().optional(),
    })
    .strict();

export const PhoneNumberUpdateManyWithoutStatusNestedInputSchema: z.ZodType<Prisma.PhoneNumberUpdateManyWithoutStatusNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema),
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema).array(),
          z.lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => PhoneNumberUpsertWithWhereUniqueWithoutStatusInputSchema
          ),
          z
            .lazy(
              () => PhoneNumberUpsertWithWhereUniqueWithoutStatusInputSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => PhoneNumberCreateManyStatusInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => PhoneNumberUpdateWithWhereUniqueWithoutStatusInputSchema
          ),
          z
            .lazy(
              () => PhoneNumberUpdateWithWhereUniqueWithoutStatusInputSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => PhoneNumberUpdateManyWithWhereWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberUpdateManyWithWhereWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => PhoneNumberScalarWhereInputSchema),
          z.lazy(() => PhoneNumberScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedUpdateManyWithoutStatusNestedInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedUpdateManyWithoutStatusNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema),
          z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema).array(),
          z.lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberCreateOrConnectWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(
            () => PhoneNumberUpsertWithWhereUniqueWithoutStatusInputSchema
          ),
          z
            .lazy(
              () => PhoneNumberUpsertWithWhereUniqueWithoutStatusInputSchema
            )
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => PhoneNumberCreateManyStatusInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => PhoneNumberWhereUniqueInputSchema),
          z.lazy(() => PhoneNumberWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(
            () => PhoneNumberUpdateWithWhereUniqueWithoutStatusInputSchema
          ),
          z
            .lazy(
              () => PhoneNumberUpdateWithWhereUniqueWithoutStatusInputSchema
            )
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => PhoneNumberUpdateManyWithWhereWithoutStatusInputSchema),
          z
            .lazy(() => PhoneNumberUpdateManyWithWhereWithoutStatusInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => PhoneNumberScalarWhereInputSchema),
          z.lazy(() => PhoneNumberScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusCreateNestedOneWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusCreateNestedOneWithoutPhonesInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneStatusCreateWithoutPhonesInputSchema),
          z.lazy(() => PhoneStatusUncheckedCreateWithoutPhonesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => PhoneStatusCreateOrConnectWithoutPhonesInputSchema)
        .optional(),
      connect: z.lazy(() => PhoneStatusWhereUniqueInputSchema).optional(),
    })
    .strict();

export const CallCreateNestedManyWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutPhoneNumberInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema),
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema).array(),
          z.lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CallCreateManyPhoneNumberInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CallUncheckedCreateNestedManyWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutPhoneNumberInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema),
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema).array(),
          z.lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CallCreateManyPhoneNumberInputEnvelopeSchema)
        .optional(),
      connect: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusUpdateOneRequiredWithoutPhonesNestedInputSchema: z.ZodType<Prisma.PhoneStatusUpdateOneRequiredWithoutPhonesNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneStatusCreateWithoutPhonesInputSchema),
          z.lazy(() => PhoneStatusUncheckedCreateWithoutPhonesInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => PhoneStatusCreateOrConnectWithoutPhonesInputSchema)
        .optional(),
      upsert: z
        .lazy(() => PhoneStatusUpsertWithoutPhonesInputSchema)
        .optional(),
      connect: z.lazy(() => PhoneStatusWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => PhoneStatusUpdateToOneWithWhereWithoutPhonesInputSchema),
          z.lazy(() => PhoneStatusUpdateWithoutPhonesInputSchema),
          z.lazy(() => PhoneStatusUncheckedUpdateWithoutPhonesInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallUpdateManyWithoutPhoneNumberNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutPhoneNumberNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema),
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema).array(),
          z.lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => CallUpsertWithWhereUniqueWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUpsertWithWhereUniqueWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CallCreateManyPhoneNumberInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => CallUpdateWithWhereUniqueWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUpdateWithWhereUniqueWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => CallUpdateManyWithWhereWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUpdateManyWithWhereWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CallScalarWhereInputSchema),
          z.lazy(() => CallScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const CallUncheckedUpdateManyWithoutPhoneNumberNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutPhoneNumberNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema),
          z.lazy(() => CallCreateWithoutPhoneNumberInputSchema).array(),
          z.lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      connectOrCreate: z
        .union([
          z.lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallCreateOrConnectWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      upsert: z
        .union([
          z.lazy(() => CallUpsertWithWhereUniqueWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUpsertWithWhereUniqueWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      createMany: z
        .lazy(() => CallCreateManyPhoneNumberInputEnvelopeSchema)
        .optional(),
      set: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      disconnect: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      delete: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      connect: z
        .union([
          z.lazy(() => CallWhereUniqueInputSchema),
          z.lazy(() => CallWhereUniqueInputSchema).array(),
        ])
        .optional(),
      update: z
        .union([
          z.lazy(() => CallUpdateWithWhereUniqueWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUpdateWithWhereUniqueWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      updateMany: z
        .union([
          z.lazy(() => CallUpdateManyWithWhereWithoutPhoneNumberInputSchema),
          z
            .lazy(() => CallUpdateManyWithWhereWithoutPhoneNumberInputSchema)
            .array(),
        ])
        .optional(),
      deleteMany: z
        .union([
          z.lazy(() => CallScalarWhereInputSchema),
          z.lazy(() => CallScalarWhereInputSchema).array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberCreateNestedOneWithoutCallsInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneNumberCreateWithoutCallsInputSchema),
          z.lazy(() => PhoneNumberUncheckedCreateWithoutCallsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => PhoneNumberCreateOrConnectWithoutCallsInputSchema)
        .optional(),
      connect: z.lazy(() => PhoneNumberWhereUniqueInputSchema).optional(),
    })
    .strict();

export const PhoneNumberUpdateOneRequiredWithoutCallsNestedInputSchema: z.ZodType<Prisma.PhoneNumberUpdateOneRequiredWithoutCallsNestedInput> =
  z
    .object({
      create: z
        .union([
          z.lazy(() => PhoneNumberCreateWithoutCallsInputSchema),
          z.lazy(() => PhoneNumberUncheckedCreateWithoutCallsInputSchema),
        ])
        .optional(),
      connectOrCreate: z
        .lazy(() => PhoneNumberCreateOrConnectWithoutCallsInputSchema)
        .optional(),
      upsert: z.lazy(() => PhoneNumberUpsertWithoutCallsInputSchema).optional(),
      connect: z.lazy(() => PhoneNumberWhereUniqueInputSchema).optional(),
      update: z
        .union([
          z.lazy(() => PhoneNumberUpdateToOneWithWhereWithoutCallsInputSchema),
          z.lazy(() => PhoneNumberUpdateWithoutCallsInputSchema),
          z.lazy(() => PhoneNumberUncheckedUpdateWithoutCallsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z.union([z.number(), z.lazy(() => NestedIntFilterSchema)]).optional(),
  })
  .strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z
  .object({
    equals: z.string().optional(),
    in: z.string().array().optional(),
    notIn: z.string().array().optional(),
    lt: z.string().optional(),
    lte: z.string().optional(),
    gt: z.string().optional(),
    gte: z.string().optional(),
    contains: z.string().optional(),
    startsWith: z.string().optional(),
    endsWith: z.string().optional(),
    not: z
      .union([z.string(), z.lazy(() => NestedStringFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> =
  z
    .object({
      equals: z.number().optional(),
      in: z.number().array().optional(),
      notIn: z.number().array().optional(),
      lt: z.number().optional(),
      lte: z.number().optional(),
      gt: z.number().optional(),
      gte: z.number().optional(),
      not: z
        .union([z.number(), z.lazy(() => NestedIntWithAggregatesFilterSchema)])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
      _sum: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedIntFilterSchema).optional(),
      _max: z.lazy(() => NestedIntFilterSchema).optional(),
    })
    .strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z
  .object({
    equals: z.number().optional(),
    in: z.number().array().optional(),
    notIn: z.number().array().optional(),
    lt: z.number().optional(),
    lte: z.number().optional(),
    gt: z.number().optional(),
    gte: z.number().optional(),
    not: z
      .union([z.number(), z.lazy(() => NestedFloatFilterSchema)])
      .optional(),
  })
  .strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> =
  z
    .object({
      equals: z.string().optional(),
      in: z.string().array().optional(),
      notIn: z.string().array().optional(),
      lt: z.string().optional(),
      lte: z.string().optional(),
      gt: z.string().optional(),
      gte: z.string().optional(),
      contains: z.string().optional(),
      startsWith: z.string().optional(),
      endsWith: z.string().optional(),
      not: z
        .union([
          z.string(),
          z.lazy(() => NestedStringWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedStringFilterSchema).optional(),
      _max: z.lazy(() => NestedStringFilterSchema).optional(),
    })
    .strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([z.coerce.date(), z.lazy(() => NestedDateTimeFilterSchema)])
        .optional(),
    })
    .strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> =
  z
    .object({
      equals: z.coerce.date().optional(),
      in: z.coerce.date().array().optional(),
      notIn: z.coerce.date().array().optional(),
      lt: z.coerce.date().optional(),
      lte: z.coerce.date().optional(),
      gt: z.coerce.date().optional(),
      gte: z.coerce.date().optional(),
      not: z
        .union([
          z.coerce.date(),
          z.lazy(() => NestedDateTimeWithAggregatesFilterSchema),
        ])
        .optional(),
      _count: z.lazy(() => NestedIntFilterSchema).optional(),
      _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
      _max: z.lazy(() => NestedDateTimeFilterSchema).optional(),
    })
    .strict();

export const PhoneNumberCreateWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberCreateWithoutStatusInput> =
  z
    .object({
      number: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      calls: z
        .lazy(() => CallCreateNestedManyWithoutPhoneNumberInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedCreateWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedCreateWithoutStatusInput> =
  z
    .object({
      id: z.number().int().optional(),
      number: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      calls: z
        .lazy(() => CallUncheckedCreateNestedManyWithoutPhoneNumberInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberCreateOrConnectWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberCreateOrConnectWithoutStatusInput> =
  z
    .object({
      where: z.lazy(() => PhoneNumberWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema),
        z.lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema),
      ]),
    })
    .strict();

export const PhoneNumberCreateManyStatusInputEnvelopeSchema: z.ZodType<Prisma.PhoneNumberCreateManyStatusInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => PhoneNumberCreateManyStatusInputSchema),
        z.lazy(() => PhoneNumberCreateManyStatusInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const PhoneNumberUpsertWithWhereUniqueWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUpsertWithWhereUniqueWithoutStatusInput> =
  z
    .object({
      where: z.lazy(() => PhoneNumberWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => PhoneNumberUpdateWithoutStatusInputSchema),
        z.lazy(() => PhoneNumberUncheckedUpdateWithoutStatusInputSchema),
      ]),
      create: z.union([
        z.lazy(() => PhoneNumberCreateWithoutStatusInputSchema),
        z.lazy(() => PhoneNumberUncheckedCreateWithoutStatusInputSchema),
      ]),
    })
    .strict();

export const PhoneNumberUpdateWithWhereUniqueWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUpdateWithWhereUniqueWithoutStatusInput> =
  z
    .object({
      where: z.lazy(() => PhoneNumberWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => PhoneNumberUpdateWithoutStatusInputSchema),
        z.lazy(() => PhoneNumberUncheckedUpdateWithoutStatusInputSchema),
      ]),
    })
    .strict();

export const PhoneNumberUpdateManyWithWhereWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUpdateManyWithWhereWithoutStatusInput> =
  z
    .object({
      where: z.lazy(() => PhoneNumberScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => PhoneNumberUpdateManyMutationInputSchema),
        z.lazy(() => PhoneNumberUncheckedUpdateManyWithoutStatusInputSchema),
      ]),
    })
    .strict();

export const PhoneNumberScalarWhereInputSchema: z.ZodType<Prisma.PhoneNumberScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => PhoneNumberScalarWhereInputSchema),
          z.lazy(() => PhoneNumberScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => PhoneNumberScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => PhoneNumberScalarWhereInputSchema),
          z.lazy(() => PhoneNumberScalarWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      number: z
        .union([z.lazy(() => StringFilterSchema), z.string()])
        .optional(),
      statusId: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict();

export const PhoneStatusCreateWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusCreateWithoutPhonesInput> =
  z
    .object({
      status: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const PhoneStatusUncheckedCreateWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedCreateWithoutPhonesInput> =
  z
    .object({
      id: z.number().int().optional(),
      status: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const PhoneStatusCreateOrConnectWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusCreateOrConnectWithoutPhonesInput> =
  z
    .object({
      where: z.lazy(() => PhoneStatusWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => PhoneStatusCreateWithoutPhonesInputSchema),
        z.lazy(() => PhoneStatusUncheckedCreateWithoutPhonesInputSchema),
      ]),
    })
    .strict();

export const CallCreateWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallCreateWithoutPhoneNumberInput> =
  z
    .object({
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const CallUncheckedCreateWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutPhoneNumberInput> =
  z
    .object({
      id: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const CallCreateOrConnectWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutPhoneNumberInput> =
  z
    .object({
      where: z.lazy(() => CallWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => CallCreateWithoutPhoneNumberInputSchema),
        z.lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema),
      ]),
    })
    .strict();

export const CallCreateManyPhoneNumberInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyPhoneNumberInputEnvelope> =
  z
    .object({
      data: z.union([
        z.lazy(() => CallCreateManyPhoneNumberInputSchema),
        z.lazy(() => CallCreateManyPhoneNumberInputSchema).array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const PhoneStatusUpsertWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusUpsertWithoutPhonesInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => PhoneStatusUpdateWithoutPhonesInputSchema),
        z.lazy(() => PhoneStatusUncheckedUpdateWithoutPhonesInputSchema),
      ]),
      create: z.union([
        z.lazy(() => PhoneStatusCreateWithoutPhonesInputSchema),
        z.lazy(() => PhoneStatusUncheckedCreateWithoutPhonesInputSchema),
      ]),
      where: z.lazy(() => PhoneStatusWhereInputSchema).optional(),
    })
    .strict();

export const PhoneStatusUpdateToOneWithWhereWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusUpdateToOneWithWhereWithoutPhonesInput> =
  z
    .object({
      where: z.lazy(() => PhoneStatusWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => PhoneStatusUpdateWithoutPhonesInputSchema),
        z.lazy(() => PhoneStatusUncheckedUpdateWithoutPhonesInputSchema),
      ]),
    })
    .strict();

export const PhoneStatusUpdateWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusUpdateWithoutPhonesInput> =
  z
    .object({
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusUncheckedUpdateWithoutPhonesInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedUpdateWithoutPhonesInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallUpsertWithWhereUniqueWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutPhoneNumberInput> =
  z
    .object({
      where: z.lazy(() => CallWhereUniqueInputSchema),
      update: z.union([
        z.lazy(() => CallUpdateWithoutPhoneNumberInputSchema),
        z.lazy(() => CallUncheckedUpdateWithoutPhoneNumberInputSchema),
      ]),
      create: z.union([
        z.lazy(() => CallCreateWithoutPhoneNumberInputSchema),
        z.lazy(() => CallUncheckedCreateWithoutPhoneNumberInputSchema),
      ]),
    })
    .strict();

export const CallUpdateWithWhereUniqueWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutPhoneNumberInput> =
  z
    .object({
      where: z.lazy(() => CallWhereUniqueInputSchema),
      data: z.union([
        z.lazy(() => CallUpdateWithoutPhoneNumberInputSchema),
        z.lazy(() => CallUncheckedUpdateWithoutPhoneNumberInputSchema),
      ]),
    })
    .strict();

export const CallUpdateManyWithWhereWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutPhoneNumberInput> =
  z
    .object({
      where: z.lazy(() => CallScalarWhereInputSchema),
      data: z.union([
        z.lazy(() => CallUpdateManyMutationInputSchema),
        z.lazy(() => CallUncheckedUpdateManyWithoutPhoneNumberInputSchema),
      ]),
    })
    .strict();

export const CallScalarWhereInputSchema: z.ZodType<Prisma.CallScalarWhereInput> =
  z
    .object({
      AND: z
        .union([
          z.lazy(() => CallScalarWhereInputSchema),
          z.lazy(() => CallScalarWhereInputSchema).array(),
        ])
        .optional(),
      OR: z
        .lazy(() => CallScalarWhereInputSchema)
        .array()
        .optional(),
      NOT: z
        .union([
          z.lazy(() => CallScalarWhereInputSchema),
          z.lazy(() => CallScalarWhereInputSchema).array(),
        ])
        .optional(),
      id: z.union([z.lazy(() => IntFilterSchema), z.number()]).optional(),
      phoneNumberId: z
        .union([z.lazy(() => IntFilterSchema), z.number()])
        .optional(),
      createdAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
      updatedAt: z
        .union([z.lazy(() => DateTimeFilterSchema), z.coerce.date()])
        .optional(),
    })
    .strict();

export const PhoneNumberCreateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberCreateWithoutCallsInput> =
  z
    .object({
      number: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
      status: z.lazy(() => PhoneStatusCreateNestedOneWithoutPhonesInputSchema),
    })
    .strict();

export const PhoneNumberUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedCreateWithoutCallsInput> =
  z
    .object({
      id: z.number().int().optional(),
      number: z.string(),
      statusId: z.number().int(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const PhoneNumberCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberCreateOrConnectWithoutCallsInput> =
  z
    .object({
      where: z.lazy(() => PhoneNumberWhereUniqueInputSchema),
      create: z.union([
        z.lazy(() => PhoneNumberCreateWithoutCallsInputSchema),
        z.lazy(() => PhoneNumberUncheckedCreateWithoutCallsInputSchema),
      ]),
    })
    .strict();

export const PhoneNumberUpsertWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberUpsertWithoutCallsInput> =
  z
    .object({
      update: z.union([
        z.lazy(() => PhoneNumberUpdateWithoutCallsInputSchema),
        z.lazy(() => PhoneNumberUncheckedUpdateWithoutCallsInputSchema),
      ]),
      create: z.union([
        z.lazy(() => PhoneNumberCreateWithoutCallsInputSchema),
        z.lazy(() => PhoneNumberUncheckedCreateWithoutCallsInputSchema),
      ]),
      where: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
    })
    .strict();

export const PhoneNumberUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberUpdateToOneWithWhereWithoutCallsInput> =
  z
    .object({
      where: z.lazy(() => PhoneNumberWhereInputSchema).optional(),
      data: z.union([
        z.lazy(() => PhoneNumberUpdateWithoutCallsInputSchema),
        z.lazy(() => PhoneNumberUncheckedUpdateWithoutCallsInputSchema),
      ]),
    })
    .strict();

export const PhoneNumberUpdateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberUpdateWithoutCallsInput> =
  z
    .object({
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      status: z
        .lazy(() => PhoneStatusUpdateOneRequiredWithoutPhonesNestedInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedUpdateWithoutCallsInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      statusId: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberCreateManyStatusInputSchema: z.ZodType<Prisma.PhoneNumberCreateManyStatusInput> =
  z
    .object({
      id: z.number().int().optional(),
      number: z.string(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const PhoneNumberUpdateWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUpdateWithoutStatusInput> =
  z
    .object({
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      calls: z
        .lazy(() => CallUpdateManyWithoutPhoneNumberNestedInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedUpdateWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedUpdateWithoutStatusInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      calls: z
        .lazy(() => CallUncheckedUpdateManyWithoutPhoneNumberNestedInputSchema)
        .optional(),
    })
    .strict();

export const PhoneNumberUncheckedUpdateManyWithoutStatusInputSchema: z.ZodType<Prisma.PhoneNumberUncheckedUpdateManyWithoutStatusInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      number: z
        .union([
          z.string(),
          z.lazy(() => StringFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallCreateManyPhoneNumberInputSchema: z.ZodType<Prisma.CallCreateManyPhoneNumberInput> =
  z
    .object({
      id: z.number().int().optional(),
      createdAt: z.coerce.date().optional(),
      updatedAt: z.coerce.date().optional(),
    })
    .strict();

export const CallUpdateWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUpdateWithoutPhoneNumberInput> =
  z
    .object({
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallUncheckedUpdateWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutPhoneNumberInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

export const CallUncheckedUpdateManyWithoutPhoneNumberInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutPhoneNumberInput> =
  z
    .object({
      id: z
        .union([
          z.number().int(),
          z.lazy(() => IntFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      createdAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
      updatedAt: z
        .union([
          z.coerce.date(),
          z.lazy(() => DateTimeFieldUpdateOperationsInputSchema),
        ])
        .optional(),
    })
    .strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AdminFindFirstArgsSchema: z.ZodType<Prisma.AdminFindFirstArgs> = z
  .object({
    select: AdminSelectSchema.optional(),
    where: AdminWhereInputSchema.optional(),
    orderBy: z
      .union([
        AdminOrderByWithRelationInputSchema.array(),
        AdminOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: AdminWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([AdminScalarFieldEnumSchema, AdminScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const AdminFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AdminFindFirstOrThrowArgs> =
  z
    .object({
      select: AdminSelectSchema.optional(),
      where: AdminWhereInputSchema.optional(),
      orderBy: z
        .union([
          AdminOrderByWithRelationInputSchema.array(),
          AdminOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: AdminWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([AdminScalarFieldEnumSchema, AdminScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict();

export const AdminFindManyArgsSchema: z.ZodType<Prisma.AdminFindManyArgs> = z
  .object({
    select: AdminSelectSchema.optional(),
    where: AdminWhereInputSchema.optional(),
    orderBy: z
      .union([
        AdminOrderByWithRelationInputSchema.array(),
        AdminOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: AdminWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([AdminScalarFieldEnumSchema, AdminScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const AdminAggregateArgsSchema: z.ZodType<Prisma.AdminAggregateArgs> = z
  .object({
    where: AdminWhereInputSchema.optional(),
    orderBy: z
      .union([
        AdminOrderByWithRelationInputSchema.array(),
        AdminOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: AdminWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const AdminGroupByArgsSchema: z.ZodType<Prisma.AdminGroupByArgs> = z
  .object({
    where: AdminWhereInputSchema.optional(),
    orderBy: z
      .union([
        AdminOrderByWithAggregationInputSchema.array(),
        AdminOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: AdminScalarFieldEnumSchema.array(),
    having: AdminScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const AdminFindUniqueArgsSchema: z.ZodType<Prisma.AdminFindUniqueArgs> =
  z
    .object({
      select: AdminSelectSchema.optional(),
      where: AdminWhereUniqueInputSchema,
    })
    .strict();

export const AdminFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AdminFindUniqueOrThrowArgs> =
  z
    .object({
      select: AdminSelectSchema.optional(),
      where: AdminWhereUniqueInputSchema,
    })
    .strict();

export const PhoneStatusFindFirstArgsSchema: z.ZodType<Prisma.PhoneStatusFindFirstArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneStatusOrderByWithRelationInputSchema.array(),
          PhoneStatusOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneStatusWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PhoneStatusScalarFieldEnumSchema,
          PhoneStatusScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PhoneStatusFindFirstOrThrowArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneStatusOrderByWithRelationInputSchema.array(),
          PhoneStatusOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneStatusWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PhoneStatusScalarFieldEnumSchema,
          PhoneStatusScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusFindManyArgsSchema: z.ZodType<Prisma.PhoneStatusFindManyArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneStatusOrderByWithRelationInputSchema.array(),
          PhoneStatusOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneStatusWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PhoneStatusScalarFieldEnumSchema,
          PhoneStatusScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneStatusAggregateArgsSchema: z.ZodType<Prisma.PhoneStatusAggregateArgs> =
  z
    .object({
      where: PhoneStatusWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneStatusOrderByWithRelationInputSchema.array(),
          PhoneStatusOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneStatusWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const PhoneStatusGroupByArgsSchema: z.ZodType<Prisma.PhoneStatusGroupByArgs> =
  z
    .object({
      where: PhoneStatusWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneStatusOrderByWithAggregationInputSchema.array(),
          PhoneStatusOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: PhoneStatusScalarFieldEnumSchema.array(),
      having: PhoneStatusScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const PhoneStatusFindUniqueArgsSchema: z.ZodType<Prisma.PhoneStatusFindUniqueArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereUniqueInputSchema,
    })
    .strict();

export const PhoneStatusFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PhoneStatusFindUniqueOrThrowArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereUniqueInputSchema,
    })
    .strict();

export const PhoneNumberFindFirstArgsSchema: z.ZodType<Prisma.PhoneNumberFindFirstArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneNumberOrderByWithRelationInputSchema.array(),
          PhoneNumberOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneNumberWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PhoneNumberScalarFieldEnumSchema,
          PhoneNumberScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PhoneNumberFindFirstOrThrowArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneNumberOrderByWithRelationInputSchema.array(),
          PhoneNumberOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneNumberWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PhoneNumberScalarFieldEnumSchema,
          PhoneNumberScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberFindManyArgsSchema: z.ZodType<Prisma.PhoneNumberFindManyArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneNumberOrderByWithRelationInputSchema.array(),
          PhoneNumberOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneNumberWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([
          PhoneNumberScalarFieldEnumSchema,
          PhoneNumberScalarFieldEnumSchema.array(),
        ])
        .optional(),
    })
    .strict();

export const PhoneNumberAggregateArgsSchema: z.ZodType<Prisma.PhoneNumberAggregateArgs> =
  z
    .object({
      where: PhoneNumberWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneNumberOrderByWithRelationInputSchema.array(),
          PhoneNumberOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: PhoneNumberWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const PhoneNumberGroupByArgsSchema: z.ZodType<Prisma.PhoneNumberGroupByArgs> =
  z
    .object({
      where: PhoneNumberWhereInputSchema.optional(),
      orderBy: z
        .union([
          PhoneNumberOrderByWithAggregationInputSchema.array(),
          PhoneNumberOrderByWithAggregationInputSchema,
        ])
        .optional(),
      by: PhoneNumberScalarFieldEnumSchema.array(),
      having: PhoneNumberScalarWhereWithAggregatesInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
    })
    .strict();

export const PhoneNumberFindUniqueArgsSchema: z.ZodType<Prisma.PhoneNumberFindUniqueArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereUniqueInputSchema,
    })
    .strict();

export const PhoneNumberFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PhoneNumberFindUniqueOrThrowArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereUniqueInputSchema,
    })
    .strict();

export const CallFindFirstArgsSchema: z.ZodType<Prisma.CallFindFirstArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    where: CallWhereInputSchema.optional(),
    orderBy: z
      .union([
        CallOrderByWithRelationInputSchema.array(),
        CallOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CallWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([CallScalarFieldEnumSchema, CallScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const CallFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallFindFirstOrThrowArgs> =
  z
    .object({
      select: CallSelectSchema.optional(),
      include: CallIncludeSchema.optional(),
      where: CallWhereInputSchema.optional(),
      orderBy: z
        .union([
          CallOrderByWithRelationInputSchema.array(),
          CallOrderByWithRelationInputSchema,
        ])
        .optional(),
      cursor: CallWhereUniqueInputSchema.optional(),
      take: z.number().optional(),
      skip: z.number().optional(),
      distinct: z
        .union([CallScalarFieldEnumSchema, CallScalarFieldEnumSchema.array()])
        .optional(),
    })
    .strict();

export const CallFindManyArgsSchema: z.ZodType<Prisma.CallFindManyArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    where: CallWhereInputSchema.optional(),
    orderBy: z
      .union([
        CallOrderByWithRelationInputSchema.array(),
        CallOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CallWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
    distinct: z
      .union([CallScalarFieldEnumSchema, CallScalarFieldEnumSchema.array()])
      .optional(),
  })
  .strict();

export const CallAggregateArgsSchema: z.ZodType<Prisma.CallAggregateArgs> = z
  .object({
    where: CallWhereInputSchema.optional(),
    orderBy: z
      .union([
        CallOrderByWithRelationInputSchema.array(),
        CallOrderByWithRelationInputSchema,
      ])
      .optional(),
    cursor: CallWhereUniqueInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const CallGroupByArgsSchema: z.ZodType<Prisma.CallGroupByArgs> = z
  .object({
    where: CallWhereInputSchema.optional(),
    orderBy: z
      .union([
        CallOrderByWithAggregationInputSchema.array(),
        CallOrderByWithAggregationInputSchema,
      ])
      .optional(),
    by: CallScalarFieldEnumSchema.array(),
    having: CallScalarWhereWithAggregatesInputSchema.optional(),
    take: z.number().optional(),
    skip: z.number().optional(),
  })
  .strict();

export const CallFindUniqueArgsSchema: z.ZodType<Prisma.CallFindUniqueArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    where: CallWhereUniqueInputSchema,
  })
  .strict();

export const CallFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallFindUniqueOrThrowArgs> =
  z
    .object({
      select: CallSelectSchema.optional(),
      include: CallIncludeSchema.optional(),
      where: CallWhereUniqueInputSchema,
    })
    .strict();

export const AdminCreateArgsSchema: z.ZodType<Prisma.AdminCreateArgs> = z
  .object({
    select: AdminSelectSchema.optional(),
    data: z.union([AdminCreateInputSchema, AdminUncheckedCreateInputSchema]),
  })
  .strict();

export const AdminUpsertArgsSchema: z.ZodType<Prisma.AdminUpsertArgs> = z
  .object({
    select: AdminSelectSchema.optional(),
    where: AdminWhereUniqueInputSchema,
    create: z.union([AdminCreateInputSchema, AdminUncheckedCreateInputSchema]),
    update: z.union([AdminUpdateInputSchema, AdminUncheckedUpdateInputSchema]),
  })
  .strict();

export const AdminCreateManyArgsSchema: z.ZodType<Prisma.AdminCreateManyArgs> =
  z
    .object({
      data: z.union([
        AdminCreateManyInputSchema,
        AdminCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AdminCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AdminCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        AdminCreateManyInputSchema,
        AdminCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const AdminDeleteArgsSchema: z.ZodType<Prisma.AdminDeleteArgs> = z
  .object({
    select: AdminSelectSchema.optional(),
    where: AdminWhereUniqueInputSchema,
  })
  .strict();

export const AdminUpdateArgsSchema: z.ZodType<Prisma.AdminUpdateArgs> = z
  .object({
    select: AdminSelectSchema.optional(),
    data: z.union([AdminUpdateInputSchema, AdminUncheckedUpdateInputSchema]),
    where: AdminWhereUniqueInputSchema,
  })
  .strict();

export const AdminUpdateManyArgsSchema: z.ZodType<Prisma.AdminUpdateManyArgs> =
  z
    .object({
      data: z.union([
        AdminUpdateManyMutationInputSchema,
        AdminUncheckedUpdateManyInputSchema,
      ]),
      where: AdminWhereInputSchema.optional(),
    })
    .strict();

export const updateManyAdminCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyAdminCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        AdminUpdateManyMutationInputSchema,
        AdminUncheckedUpdateManyInputSchema,
      ]),
      where: AdminWhereInputSchema.optional(),
    })
    .strict();

export const AdminDeleteManyArgsSchema: z.ZodType<Prisma.AdminDeleteManyArgs> =
  z
    .object({
      where: AdminWhereInputSchema.optional(),
    })
    .strict();

export const PhoneStatusCreateArgsSchema: z.ZodType<Prisma.PhoneStatusCreateArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      data: z.union([
        PhoneStatusCreateInputSchema,
        PhoneStatusUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const PhoneStatusUpsertArgsSchema: z.ZodType<Prisma.PhoneStatusUpsertArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereUniqueInputSchema,
      create: z.union([
        PhoneStatusCreateInputSchema,
        PhoneStatusUncheckedCreateInputSchema,
      ]),
      update: z.union([
        PhoneStatusUpdateInputSchema,
        PhoneStatusUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const PhoneStatusCreateManyArgsSchema: z.ZodType<Prisma.PhoneStatusCreateManyArgs> =
  z
    .object({
      data: z.union([
        PhoneStatusCreateManyInputSchema,
        PhoneStatusCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const PhoneStatusCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PhoneStatusCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        PhoneStatusCreateManyInputSchema,
        PhoneStatusCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const PhoneStatusDeleteArgsSchema: z.ZodType<Prisma.PhoneStatusDeleteArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      where: PhoneStatusWhereUniqueInputSchema,
    })
    .strict();

export const PhoneStatusUpdateArgsSchema: z.ZodType<Prisma.PhoneStatusUpdateArgs> =
  z
    .object({
      select: PhoneStatusSelectSchema.optional(),
      include: PhoneStatusIncludeSchema.optional(),
      data: z.union([
        PhoneStatusUpdateInputSchema,
        PhoneStatusUncheckedUpdateInputSchema,
      ]),
      where: PhoneStatusWhereUniqueInputSchema,
    })
    .strict();

export const PhoneStatusUpdateManyArgsSchema: z.ZodType<Prisma.PhoneStatusUpdateManyArgs> =
  z
    .object({
      data: z.union([
        PhoneStatusUpdateManyMutationInputSchema,
        PhoneStatusUncheckedUpdateManyInputSchema,
      ]),
      where: PhoneStatusWhereInputSchema.optional(),
    })
    .strict();

export const updateManyPhoneStatusCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyPhoneStatusCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        PhoneStatusUpdateManyMutationInputSchema,
        PhoneStatusUncheckedUpdateManyInputSchema,
      ]),
      where: PhoneStatusWhereInputSchema.optional(),
    })
    .strict();

export const PhoneStatusDeleteManyArgsSchema: z.ZodType<Prisma.PhoneStatusDeleteManyArgs> =
  z
    .object({
      where: PhoneStatusWhereInputSchema.optional(),
    })
    .strict();

export const PhoneNumberCreateArgsSchema: z.ZodType<Prisma.PhoneNumberCreateArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      data: z.union([
        PhoneNumberCreateInputSchema,
        PhoneNumberUncheckedCreateInputSchema,
      ]),
    })
    .strict();

export const PhoneNumberUpsertArgsSchema: z.ZodType<Prisma.PhoneNumberUpsertArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereUniqueInputSchema,
      create: z.union([
        PhoneNumberCreateInputSchema,
        PhoneNumberUncheckedCreateInputSchema,
      ]),
      update: z.union([
        PhoneNumberUpdateInputSchema,
        PhoneNumberUncheckedUpdateInputSchema,
      ]),
    })
    .strict();

export const PhoneNumberCreateManyArgsSchema: z.ZodType<Prisma.PhoneNumberCreateManyArgs> =
  z
    .object({
      data: z.union([
        PhoneNumberCreateManyInputSchema,
        PhoneNumberCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const PhoneNumberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PhoneNumberCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        PhoneNumberCreateManyInputSchema,
        PhoneNumberCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const PhoneNumberDeleteArgsSchema: z.ZodType<Prisma.PhoneNumberDeleteArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      where: PhoneNumberWhereUniqueInputSchema,
    })
    .strict();

export const PhoneNumberUpdateArgsSchema: z.ZodType<Prisma.PhoneNumberUpdateArgs> =
  z
    .object({
      select: PhoneNumberSelectSchema.optional(),
      include: PhoneNumberIncludeSchema.optional(),
      data: z.union([
        PhoneNumberUpdateInputSchema,
        PhoneNumberUncheckedUpdateInputSchema,
      ]),
      where: PhoneNumberWhereUniqueInputSchema,
    })
    .strict();

export const PhoneNumberUpdateManyArgsSchema: z.ZodType<Prisma.PhoneNumberUpdateManyArgs> =
  z
    .object({
      data: z.union([
        PhoneNumberUpdateManyMutationInputSchema,
        PhoneNumberUncheckedUpdateManyInputSchema,
      ]),
      where: PhoneNumberWhereInputSchema.optional(),
    })
    .strict();

export const updateManyPhoneNumberCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyPhoneNumberCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        PhoneNumberUpdateManyMutationInputSchema,
        PhoneNumberUncheckedUpdateManyInputSchema,
      ]),
      where: PhoneNumberWhereInputSchema.optional(),
    })
    .strict();

export const PhoneNumberDeleteManyArgsSchema: z.ZodType<Prisma.PhoneNumberDeleteManyArgs> =
  z
    .object({
      where: PhoneNumberWhereInputSchema.optional(),
    })
    .strict();

export const CallCreateArgsSchema: z.ZodType<Prisma.CallCreateArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    data: z.union([CallCreateInputSchema, CallUncheckedCreateInputSchema]),
  })
  .strict();

export const CallUpsertArgsSchema: z.ZodType<Prisma.CallUpsertArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    where: CallWhereUniqueInputSchema,
    create: z.union([CallCreateInputSchema, CallUncheckedCreateInputSchema]),
    update: z.union([CallUpdateInputSchema, CallUncheckedUpdateInputSchema]),
  })
  .strict();

export const CallCreateManyArgsSchema: z.ZodType<Prisma.CallCreateManyArgs> = z
  .object({
    data: z.union([
      CallCreateManyInputSchema,
      CallCreateManyInputSchema.array(),
    ]),
    skipDuplicates: z.boolean().optional(),
  })
  .strict();

export const CallCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        CallCreateManyInputSchema,
        CallCreateManyInputSchema.array(),
      ]),
      skipDuplicates: z.boolean().optional(),
    })
    .strict();

export const CallDeleteArgsSchema: z.ZodType<Prisma.CallDeleteArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    where: CallWhereUniqueInputSchema,
  })
  .strict();

export const CallUpdateArgsSchema: z.ZodType<Prisma.CallUpdateArgs> = z
  .object({
    select: CallSelectSchema.optional(),
    include: CallIncludeSchema.optional(),
    data: z.union([CallUpdateInputSchema, CallUncheckedUpdateInputSchema]),
    where: CallWhereUniqueInputSchema,
  })
  .strict();

export const CallUpdateManyArgsSchema: z.ZodType<Prisma.CallUpdateManyArgs> = z
  .object({
    data: z.union([
      CallUpdateManyMutationInputSchema,
      CallUncheckedUpdateManyInputSchema,
    ]),
    where: CallWhereInputSchema.optional(),
  })
  .strict();

export const updateManyCallCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyCallCreateManyAndReturnArgs> =
  z
    .object({
      data: z.union([
        CallUpdateManyMutationInputSchema,
        CallUncheckedUpdateManyInputSchema,
      ]),
      where: CallWhereInputSchema.optional(),
    })
    .strict();

export const CallDeleteManyArgsSchema: z.ZodType<Prisma.CallDeleteManyArgs> = z
  .object({
    where: CallWhereInputSchema.optional(),
  })
  .strict();
