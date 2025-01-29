import { z } from 'zod';
import type { Prisma } from '@prisma/client';

/////////////////////////////////////////
// HELPER FUNCTIONS
/////////////////////////////////////////


/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const TransactionIsolationLevelSchema = z.enum(['ReadUncommitted','ReadCommitted','RepeatableRead','Serializable']);

export const AdminScalarFieldEnumSchema = z.enum(['id','email','name']);

export const PhoneStatusScalarFieldEnumSchema = z.enum(['id','status','createdAt','updatedAt']);

export const PhoneScalarFieldEnumSchema = z.enum(['id','number','createdAt','updatedAt']);

export const CallScalarFieldEnumSchema = z.enum(['id','phoneId','statusId','script','createdAt','updatedAt']);

export const SortOrderSchema = z.enum(['asc','desc']);

export const QueryModeSchema = z.enum(['default','insensitive']);
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
})

export type Admin = z.infer<typeof AdminSchema>

/////////////////////////////////////////
// PHONE STATUS SCHEMA
/////////////////////////////////////////

export const PhoneStatusSchema = z.object({
  id: z.number().int(),
  status: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type PhoneStatus = z.infer<typeof PhoneStatusSchema>

/////////////////////////////////////////
// PHONE SCHEMA
/////////////////////////////////////////

export const PhoneSchema = z.object({
  id: z.number().int(),
  number: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Phone = z.infer<typeof PhoneSchema>

/////////////////////////////////////////
// CALL SCHEMA
/////////////////////////////////////////

export const CallSchema = z.object({
  id: z.number().int(),
  phoneId: z.number().int(),
  statusId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
})

export type Call = z.infer<typeof CallSchema>

/////////////////////////////////////////
// SELECT & INCLUDE
/////////////////////////////////////////

// ADMIN
//------------------------------------------------------

export const AdminSelectSchema: z.ZodType<Prisma.AdminSelect> = z.object({
  id: z.boolean().optional(),
  email: z.boolean().optional(),
  name: z.boolean().optional(),
}).strict()

// PHONE STATUS
//------------------------------------------------------

export const PhoneStatusIncludeSchema: z.ZodType<Prisma.PhoneStatusInclude> = z.object({
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PhoneStatusCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PhoneStatusArgsSchema: z.ZodType<Prisma.PhoneStatusDefaultArgs> = z.object({
  select: z.lazy(() => PhoneStatusSelectSchema).optional(),
  include: z.lazy(() => PhoneStatusIncludeSchema).optional(),
}).strict();

export const PhoneStatusCountOutputTypeArgsSchema: z.ZodType<Prisma.PhoneStatusCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PhoneStatusCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PhoneStatusCountOutputTypeSelectSchema: z.ZodType<Prisma.PhoneStatusCountOutputTypeSelect> = z.object({
  calls: z.boolean().optional(),
}).strict();

export const PhoneStatusSelectSchema: z.ZodType<Prisma.PhoneStatusSelect> = z.object({
  id: z.boolean().optional(),
  status: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PhoneStatusCountOutputTypeArgsSchema)]).optional(),
}).strict()

// PHONE
//------------------------------------------------------

export const PhoneIncludeSchema: z.ZodType<Prisma.PhoneInclude> = z.object({
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PhoneCountOutputTypeArgsSchema)]).optional(),
}).strict()

export const PhoneArgsSchema: z.ZodType<Prisma.PhoneDefaultArgs> = z.object({
  select: z.lazy(() => PhoneSelectSchema).optional(),
  include: z.lazy(() => PhoneIncludeSchema).optional(),
}).strict();

export const PhoneCountOutputTypeArgsSchema: z.ZodType<Prisma.PhoneCountOutputTypeDefaultArgs> = z.object({
  select: z.lazy(() => PhoneCountOutputTypeSelectSchema).nullish(),
}).strict();

export const PhoneCountOutputTypeSelectSchema: z.ZodType<Prisma.PhoneCountOutputTypeSelect> = z.object({
  calls: z.boolean().optional(),
}).strict();

export const PhoneSelectSchema: z.ZodType<Prisma.PhoneSelect> = z.object({
  id: z.boolean().optional(),
  number: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  calls: z.union([z.boolean(),z.lazy(() => CallFindManyArgsSchema)]).optional(),
  _count: z.union([z.boolean(),z.lazy(() => PhoneCountOutputTypeArgsSchema)]).optional(),
}).strict()

// CALL
//------------------------------------------------------

export const CallIncludeSchema: z.ZodType<Prisma.CallInclude> = z.object({
  phone: z.union([z.boolean(),z.lazy(() => PhoneArgsSchema)]).optional(),
  status: z.union([z.boolean(),z.lazy(() => PhoneStatusArgsSchema)]).optional(),
}).strict()

export const CallArgsSchema: z.ZodType<Prisma.CallDefaultArgs> = z.object({
  select: z.lazy(() => CallSelectSchema).optional(),
  include: z.lazy(() => CallIncludeSchema).optional(),
}).strict();

export const CallSelectSchema: z.ZodType<Prisma.CallSelect> = z.object({
  id: z.boolean().optional(),
  phoneId: z.boolean().optional(),
  statusId: z.boolean().optional(),
  script: z.boolean().optional(),
  createdAt: z.boolean().optional(),
  updatedAt: z.boolean().optional(),
  phone: z.union([z.boolean(),z.lazy(() => PhoneArgsSchema)]).optional(),
  status: z.union([z.boolean(),z.lazy(() => PhoneStatusArgsSchema)]).optional(),
}).strict()


/////////////////////////////////////////
// INPUT TYPES
/////////////////////////////////////////

export const AdminWhereInputSchema: z.ZodType<Prisma.AdminWhereInput> = z.object({
  AND: z.union([ z.lazy(() => AdminWhereInputSchema),z.lazy(() => AdminWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminWhereInputSchema),z.lazy(() => AdminWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict();

export const AdminOrderByWithRelationInputSchema: z.ZodType<Prisma.AdminOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminWhereUniqueInputSchema: z.ZodType<Prisma.AdminWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    email: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    email: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  email: z.string().optional(),
  AND: z.union([ z.lazy(() => AdminWhereInputSchema),z.lazy(() => AdminWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminWhereInputSchema),z.lazy(() => AdminWhereInputSchema).array() ]).optional(),
  name: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
}).strict());

export const AdminOrderByWithAggregationInputSchema: z.ZodType<Prisma.AdminOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => AdminCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => AdminAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => AdminMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => AdminMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => AdminSumOrderByAggregateInputSchema).optional()
}).strict();

export const AdminScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.AdminScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => AdminScalarWhereWithAggregatesInputSchema),z.lazy(() => AdminScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => AdminScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => AdminScalarWhereWithAggregatesInputSchema),z.lazy(() => AdminScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  email: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  name: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
}).strict();

export const PhoneStatusWhereInputSchema: z.ZodType<Prisma.PhoneStatusWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PhoneStatusWhereInputSchema),z.lazy(() => PhoneStatusWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneStatusWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneStatusWhereInputSchema),z.lazy(() => PhoneStatusWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict();

export const PhoneStatusOrderByWithRelationInputSchema: z.ZodType<Prisma.PhoneStatusOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PhoneStatusWhereUniqueInputSchema: z.ZodType<Prisma.PhoneStatusWhereUniqueInput> = z.union([
  z.object({
    id: z.number().int(),
    status: z.string()
  }),
  z.object({
    id: z.number().int(),
  }),
  z.object({
    status: z.string(),
  }),
])
.and(z.object({
  id: z.number().int().optional(),
  status: z.string().optional(),
  AND: z.union([ z.lazy(() => PhoneStatusWhereInputSchema),z.lazy(() => PhoneStatusWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneStatusWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneStatusWhereInputSchema),z.lazy(() => PhoneStatusWhereInputSchema).array() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict());

export const PhoneStatusOrderByWithAggregationInputSchema: z.ZodType<Prisma.PhoneStatusOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PhoneStatusCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PhoneStatusAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PhoneStatusMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PhoneStatusMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PhoneStatusSumOrderByAggregateInputSchema).optional()
}).strict();

export const PhoneStatusScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PhoneStatusScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema),z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema),z.lazy(() => PhoneStatusScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  status: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const PhoneWhereInputSchema: z.ZodType<Prisma.PhoneWhereInput> = z.object({
  AND: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  number: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict();

export const PhoneOrderByWithRelationInputSchema: z.ZodType<Prisma.PhoneOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  calls: z.lazy(() => CallOrderByRelationAggregateInputSchema).optional()
}).strict();

export const PhoneWhereUniqueInputSchema: z.ZodType<Prisma.PhoneWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneWhereInputSchema),z.lazy(() => PhoneWhereInputSchema).array() ]).optional(),
  number: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  calls: z.lazy(() => CallListRelationFilterSchema).optional()
}).strict());

export const PhoneOrderByWithAggregationInputSchema: z.ZodType<Prisma.PhoneOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => PhoneCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => PhoneAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => PhoneMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => PhoneMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => PhoneSumOrderByAggregateInputSchema).optional()
}).strict();

export const PhoneScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.PhoneScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema),z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema),z.lazy(() => PhoneScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  number: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CallWhereInputSchema: z.ZodType<Prisma.CallWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  phoneId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  statusId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  script: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  phone: z.union([ z.lazy(() => PhoneScalarRelationFilterSchema),z.lazy(() => PhoneWhereInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PhoneStatusScalarRelationFilterSchema),z.lazy(() => PhoneStatusWhereInputSchema) ]).optional(),
}).strict();

export const CallOrderByWithRelationInputSchema: z.ZodType<Prisma.CallOrderByWithRelationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  script: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  phone: z.lazy(() => PhoneOrderByWithRelationInputSchema).optional(),
  status: z.lazy(() => PhoneStatusOrderByWithRelationInputSchema).optional()
}).strict();

export const CallWhereUniqueInputSchema: z.ZodType<Prisma.CallWhereUniqueInput> = z.object({
  id: z.number().int()
})
.and(z.object({
  id: z.number().int().optional(),
  AND: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallWhereInputSchema),z.lazy(() => CallWhereInputSchema).array() ]).optional(),
  phoneId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  statusId: z.union([ z.lazy(() => IntFilterSchema),z.number().int() ]).optional(),
  script: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  phone: z.union([ z.lazy(() => PhoneScalarRelationFilterSchema),z.lazy(() => PhoneWhereInputSchema) ]).optional(),
  status: z.union([ z.lazy(() => PhoneStatusScalarRelationFilterSchema),z.lazy(() => PhoneStatusWhereInputSchema) ]).optional(),
}).strict());

export const CallOrderByWithAggregationInputSchema: z.ZodType<Prisma.CallOrderByWithAggregationInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  script: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional(),
  _count: z.lazy(() => CallCountOrderByAggregateInputSchema).optional(),
  _avg: z.lazy(() => CallAvgOrderByAggregateInputSchema).optional(),
  _max: z.lazy(() => CallMaxOrderByAggregateInputSchema).optional(),
  _min: z.lazy(() => CallMinOrderByAggregateInputSchema).optional(),
  _sum: z.lazy(() => CallSumOrderByAggregateInputSchema).optional()
}).strict();

export const CallScalarWhereWithAggregatesInputSchema: z.ZodType<Prisma.CallScalarWhereWithAggregatesInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereWithAggregatesInputSchema),z.lazy(() => CallScalarWhereWithAggregatesInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  phoneId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  statusId: z.union([ z.lazy(() => IntWithAggregatesFilterSchema),z.number() ]).optional(),
  script: z.union([ z.lazy(() => StringWithAggregatesFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeWithAggregatesFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const AdminCreateInputSchema: z.ZodType<Prisma.AdminCreateInput> = z.object({
  email: z.string(),
  name: z.string().optional()
}).strict();

export const AdminUncheckedCreateInputSchema: z.ZodType<Prisma.AdminUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional()
}).strict();

export const AdminUpdateInputSchema: z.ZodType<Prisma.AdminUpdateInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminUncheckedUpdateInputSchema: z.ZodType<Prisma.AdminUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminCreateManyInputSchema: z.ZodType<Prisma.AdminCreateManyInput> = z.object({
  id: z.number().int().optional(),
  email: z.string(),
  name: z.string().optional()
}).strict();

export const AdminUpdateManyMutationInputSchema: z.ZodType<Prisma.AdminUpdateManyMutationInput> = z.object({
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const AdminUncheckedUpdateManyInputSchema: z.ZodType<Prisma.AdminUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  email: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  name: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneStatusCreateInputSchema: z.ZodType<Prisma.PhoneStatusCreateInput> = z.object({
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutStatusInputSchema).optional()
}).strict();

export const PhoneStatusUncheckedCreateInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutStatusInputSchema).optional()
}).strict();

export const PhoneStatusUpdateInputSchema: z.ZodType<Prisma.PhoneStatusUpdateInput> = z.object({
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutStatusNestedInputSchema).optional()
}).strict();

export const PhoneStatusUncheckedUpdateInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutStatusNestedInputSchema).optional()
}).strict();

export const PhoneStatusCreateManyInputSchema: z.ZodType<Prisma.PhoneStatusCreateManyInput> = z.object({
  id: z.number().int().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PhoneStatusUpdateManyMutationInputSchema: z.ZodType<Prisma.PhoneStatusUpdateManyMutationInput> = z.object({
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneStatusUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneCreateInputSchema: z.ZodType<Prisma.PhoneCreateInput> = z.object({
  number: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallCreateNestedManyWithoutPhoneInputSchema).optional()
}).strict();

export const PhoneUncheckedCreateInputSchema: z.ZodType<Prisma.PhoneUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  number: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  calls: z.lazy(() => CallUncheckedCreateNestedManyWithoutPhoneInputSchema).optional()
}).strict();

export const PhoneUpdateInputSchema: z.ZodType<Prisma.PhoneUpdateInput> = z.object({
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUpdateManyWithoutPhoneNestedInputSchema).optional()
}).strict();

export const PhoneUncheckedUpdateInputSchema: z.ZodType<Prisma.PhoneUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  calls: z.lazy(() => CallUncheckedUpdateManyWithoutPhoneNestedInputSchema).optional()
}).strict();

export const PhoneCreateManyInputSchema: z.ZodType<Prisma.PhoneCreateManyInput> = z.object({
  id: z.number().int().optional(),
  number: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PhoneUpdateManyMutationInputSchema: z.ZodType<Prisma.PhoneUpdateManyMutationInput> = z.object({
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneUncheckedUpdateManyInputSchema: z.ZodType<Prisma.PhoneUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateInputSchema: z.ZodType<Prisma.CallCreateInput> = z.object({
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  phone: z.lazy(() => PhoneCreateNestedOneWithoutCallsInputSchema),
  status: z.lazy(() => PhoneStatusCreateNestedOneWithoutCallsInputSchema)
}).strict();

export const CallUncheckedCreateInputSchema: z.ZodType<Prisma.CallUncheckedCreateInput> = z.object({
  id: z.number().int().optional(),
  phoneId: z.number().int(),
  statusId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallUpdateInputSchema: z.ZodType<Prisma.CallUpdateInput> = z.object({
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneUpdateOneRequiredWithoutCallsNestedInputSchema).optional(),
  status: z.lazy(() => PhoneStatusUpdateOneRequiredWithoutCallsNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateInputSchema: z.ZodType<Prisma.CallUncheckedUpdateInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phoneId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyInputSchema: z.ZodType<Prisma.CallCreateManyInput> = z.object({
  id: z.number().int().optional(),
  phoneId: z.number().int(),
  statusId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallUpdateManyMutationInputSchema: z.ZodType<Prisma.CallUpdateManyMutationInput> = z.object({
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallUncheckedUpdateManyInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phoneId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const IntFilterSchema: z.ZodType<Prisma.IntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const StringFilterSchema: z.ZodType<Prisma.StringFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const AdminCountOrderByAggregateInputSchema: z.ZodType<Prisma.AdminCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminAvgOrderByAggregateInputSchema: z.ZodType<Prisma.AdminAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminMaxOrderByAggregateInputSchema: z.ZodType<Prisma.AdminMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminMinOrderByAggregateInputSchema: z.ZodType<Prisma.AdminMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  email: z.lazy(() => SortOrderSchema).optional(),
  name: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const AdminSumOrderByAggregateInputSchema: z.ZodType<Prisma.AdminSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const IntWithAggregatesFilterSchema: z.ZodType<Prisma.IntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const StringWithAggregatesFilterSchema: z.ZodType<Prisma.StringWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const DateTimeFilterSchema: z.ZodType<Prisma.DateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const CallListRelationFilterSchema: z.ZodType<Prisma.CallListRelationFilter> = z.object({
  every: z.lazy(() => CallWhereInputSchema).optional(),
  some: z.lazy(() => CallWhereInputSchema).optional(),
  none: z.lazy(() => CallWhereInputSchema).optional()
}).strict();

export const CallOrderByRelationAggregateInputSchema: z.ZodType<Prisma.CallOrderByRelationAggregateInput> = z.object({
  _count: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneStatusCountOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneStatusAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneStatusMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneStatusMinOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  status: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneStatusSumOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneStatusSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const DateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.DateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const PhoneCountOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneAvgOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneMaxOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneMinOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  number: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneSumOrderByAggregateInputSchema: z.ZodType<Prisma.PhoneSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const PhoneScalarRelationFilterSchema: z.ZodType<Prisma.PhoneScalarRelationFilter> = z.object({
  is: z.lazy(() => PhoneWhereInputSchema).optional(),
  isNot: z.lazy(() => PhoneWhereInputSchema).optional()
}).strict();

export const PhoneStatusScalarRelationFilterSchema: z.ZodType<Prisma.PhoneStatusScalarRelationFilter> = z.object({
  is: z.lazy(() => PhoneStatusWhereInputSchema).optional(),
  isNot: z.lazy(() => PhoneStatusWhereInputSchema).optional()
}).strict();

export const CallCountOrderByAggregateInputSchema: z.ZodType<Prisma.CallCountOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  script: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallAvgOrderByAggregateInputSchema: z.ZodType<Prisma.CallAvgOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMaxOrderByAggregateInputSchema: z.ZodType<Prisma.CallMaxOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  script: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallMinOrderByAggregateInputSchema: z.ZodType<Prisma.CallMinOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional(),
  script: z.lazy(() => SortOrderSchema).optional(),
  createdAt: z.lazy(() => SortOrderSchema).optional(),
  updatedAt: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const CallSumOrderByAggregateInputSchema: z.ZodType<Prisma.CallSumOrderByAggregateInput> = z.object({
  id: z.lazy(() => SortOrderSchema).optional(),
  phoneId: z.lazy(() => SortOrderSchema).optional(),
  statusId: z.lazy(() => SortOrderSchema).optional()
}).strict();

export const StringFieldUpdateOperationsInputSchema: z.ZodType<Prisma.StringFieldUpdateOperationsInput> = z.object({
  set: z.string().optional()
}).strict();

export const IntFieldUpdateOperationsInputSchema: z.ZodType<Prisma.IntFieldUpdateOperationsInput> = z.object({
  set: z.number().optional(),
  increment: z.number().optional(),
  decrement: z.number().optional(),
  multiply: z.number().optional(),
  divide: z.number().optional()
}).strict();

export const CallCreateNestedManyWithoutStatusInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutStatusInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutStatusInputSchema),z.lazy(() => CallCreateWithoutStatusInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema),z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyStatusInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutStatusInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutStatusInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutStatusInputSchema),z.lazy(() => CallCreateWithoutStatusInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema),z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyStatusInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const DateTimeFieldUpdateOperationsInputSchema: z.ZodType<Prisma.DateTimeFieldUpdateOperationsInput> = z.object({
  set: z.coerce.date().optional()
}).strict();

export const CallUpdateManyWithoutStatusNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutStatusNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutStatusInputSchema),z.lazy(() => CallCreateWithoutStatusInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema),z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutStatusInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyStatusInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutStatusInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutStatusInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutStatusInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutStatusInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutStatusNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutStatusNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutStatusInputSchema),z.lazy(() => CallCreateWithoutStatusInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema),z.lazy(() => CallCreateOrConnectWithoutStatusInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutStatusInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutStatusInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyStatusInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutStatusInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutStatusInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutStatusInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutStatusInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallCreateNestedManyWithoutPhoneInputSchema: z.ZodType<Prisma.CallCreateNestedManyWithoutPhoneInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutPhoneInputSchema),z.lazy(() => CallCreateWithoutPhoneInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema),z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyPhoneInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedCreateNestedManyWithoutPhoneInputSchema: z.ZodType<Prisma.CallUncheckedCreateNestedManyWithoutPhoneInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutPhoneInputSchema),z.lazy(() => CallCreateWithoutPhoneInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema),z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyPhoneInputEnvelopeSchema).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
}).strict();

export const CallUpdateManyWithoutPhoneNestedInputSchema: z.ZodType<Prisma.CallUpdateManyWithoutPhoneNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutPhoneInputSchema),z.lazy(() => CallCreateWithoutPhoneInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema),z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutPhoneInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutPhoneInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyPhoneInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutPhoneInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutPhoneInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutPhoneInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutPhoneInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutPhoneNestedInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutPhoneNestedInput> = z.object({
  create: z.union([ z.lazy(() => CallCreateWithoutPhoneInputSchema),z.lazy(() => CallCreateWithoutPhoneInputSchema).array(),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema).array() ]).optional(),
  connectOrCreate: z.union([ z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema),z.lazy(() => CallCreateOrConnectWithoutPhoneInputSchema).array() ]).optional(),
  upsert: z.union([ z.lazy(() => CallUpsertWithWhereUniqueWithoutPhoneInputSchema),z.lazy(() => CallUpsertWithWhereUniqueWithoutPhoneInputSchema).array() ]).optional(),
  createMany: z.lazy(() => CallCreateManyPhoneInputEnvelopeSchema).optional(),
  set: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  disconnect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  delete: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  connect: z.union([ z.lazy(() => CallWhereUniqueInputSchema),z.lazy(() => CallWhereUniqueInputSchema).array() ]).optional(),
  update: z.union([ z.lazy(() => CallUpdateWithWhereUniqueWithoutPhoneInputSchema),z.lazy(() => CallUpdateWithWhereUniqueWithoutPhoneInputSchema).array() ]).optional(),
  updateMany: z.union([ z.lazy(() => CallUpdateManyWithWhereWithoutPhoneInputSchema),z.lazy(() => CallUpdateManyWithWhereWithoutPhoneInputSchema).array() ]).optional(),
  deleteMany: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
}).strict();

export const PhoneCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.PhoneCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => PhoneCreateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PhoneCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => PhoneWhereUniqueInputSchema).optional()
}).strict();

export const PhoneStatusCreateNestedOneWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusCreateNestedOneWithoutCallsInput> = z.object({
  create: z.union([ z.lazy(() => PhoneStatusCreateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PhoneStatusCreateOrConnectWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => PhoneStatusWhereUniqueInputSchema).optional()
}).strict();

export const PhoneUpdateOneRequiredWithoutCallsNestedInputSchema: z.ZodType<Prisma.PhoneUpdateOneRequiredWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PhoneCreateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PhoneCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => PhoneUpsertWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => PhoneWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PhoneUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => PhoneUpdateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const PhoneStatusUpdateOneRequiredWithoutCallsNestedInputSchema: z.ZodType<Prisma.PhoneStatusUpdateOneRequiredWithoutCallsNestedInput> = z.object({
  create: z.union([ z.lazy(() => PhoneStatusCreateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedCreateWithoutCallsInputSchema) ]).optional(),
  connectOrCreate: z.lazy(() => PhoneStatusCreateOrConnectWithoutCallsInputSchema).optional(),
  upsert: z.lazy(() => PhoneStatusUpsertWithoutCallsInputSchema).optional(),
  connect: z.lazy(() => PhoneStatusWhereUniqueInputSchema).optional(),
  update: z.union([ z.lazy(() => PhoneStatusUpdateToOneWithWhereWithoutCallsInputSchema),z.lazy(() => PhoneStatusUpdateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedUpdateWithoutCallsInputSchema) ]).optional(),
}).strict();

export const NestedIntFilterSchema: z.ZodType<Prisma.NestedIntFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntFilterSchema) ]).optional(),
}).strict();

export const NestedStringFilterSchema: z.ZodType<Prisma.NestedStringFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringFilterSchema) ]).optional(),
}).strict();

export const NestedIntWithAggregatesFilterSchema: z.ZodType<Prisma.NestedIntWithAggregatesFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedIntWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _avg: z.lazy(() => NestedFloatFilterSchema).optional(),
  _sum: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedIntFilterSchema).optional(),
  _max: z.lazy(() => NestedIntFilterSchema).optional()
}).strict();

export const NestedFloatFilterSchema: z.ZodType<Prisma.NestedFloatFilter> = z.object({
  equals: z.number().optional(),
  in: z.number().array().optional(),
  notIn: z.number().array().optional(),
  lt: z.number().optional(),
  lte: z.number().optional(),
  gt: z.number().optional(),
  gte: z.number().optional(),
  not: z.union([ z.number(),z.lazy(() => NestedFloatFilterSchema) ]).optional(),
}).strict();

export const NestedStringWithAggregatesFilterSchema: z.ZodType<Prisma.NestedStringWithAggregatesFilter> = z.object({
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
  not: z.union([ z.string(),z.lazy(() => NestedStringWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedStringFilterSchema).optional(),
  _max: z.lazy(() => NestedStringFilterSchema).optional()
}).strict();

export const NestedDateTimeFilterSchema: z.ZodType<Prisma.NestedDateTimeFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeFilterSchema) ]).optional(),
}).strict();

export const NestedDateTimeWithAggregatesFilterSchema: z.ZodType<Prisma.NestedDateTimeWithAggregatesFilter> = z.object({
  equals: z.coerce.date().optional(),
  in: z.coerce.date().array().optional(),
  notIn: z.coerce.date().array().optional(),
  lt: z.coerce.date().optional(),
  lte: z.coerce.date().optional(),
  gt: z.coerce.date().optional(),
  gte: z.coerce.date().optional(),
  not: z.union([ z.coerce.date(),z.lazy(() => NestedDateTimeWithAggregatesFilterSchema) ]).optional(),
  _count: z.lazy(() => NestedIntFilterSchema).optional(),
  _min: z.lazy(() => NestedDateTimeFilterSchema).optional(),
  _max: z.lazy(() => NestedDateTimeFilterSchema).optional()
}).strict();

export const CallCreateWithoutStatusInputSchema: z.ZodType<Prisma.CallCreateWithoutStatusInput> = z.object({
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  phone: z.lazy(() => PhoneCreateNestedOneWithoutCallsInputSchema)
}).strict();

export const CallUncheckedCreateWithoutStatusInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutStatusInput> = z.object({
  id: z.number().int().optional(),
  phoneId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallCreateOrConnectWithoutStatusInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutStatusInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutStatusInputSchema),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema) ]),
}).strict();

export const CallCreateManyStatusInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyStatusInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyStatusInputSchema),z.lazy(() => CallCreateManyStatusInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CallUpsertWithWhereUniqueWithoutStatusInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutStatusInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutStatusInputSchema),z.lazy(() => CallUncheckedUpdateWithoutStatusInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutStatusInputSchema),z.lazy(() => CallUncheckedCreateWithoutStatusInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutStatusInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutStatusInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutStatusInputSchema),z.lazy(() => CallUncheckedUpdateWithoutStatusInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutStatusInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutStatusInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutStatusInputSchema) ]),
}).strict();

export const CallScalarWhereInputSchema: z.ZodType<Prisma.CallScalarWhereInput> = z.object({
  AND: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  OR: z.lazy(() => CallScalarWhereInputSchema).array().optional(),
  NOT: z.union([ z.lazy(() => CallScalarWhereInputSchema),z.lazy(() => CallScalarWhereInputSchema).array() ]).optional(),
  id: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  phoneId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  statusId: z.union([ z.lazy(() => IntFilterSchema),z.number() ]).optional(),
  script: z.union([ z.lazy(() => StringFilterSchema),z.string() ]).optional(),
  createdAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
  updatedAt: z.union([ z.lazy(() => DateTimeFilterSchema),z.coerce.date() ]).optional(),
}).strict();

export const CallCreateWithoutPhoneInputSchema: z.ZodType<Prisma.CallCreateWithoutPhoneInput> = z.object({
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  status: z.lazy(() => PhoneStatusCreateNestedOneWithoutCallsInputSchema)
}).strict();

export const CallUncheckedCreateWithoutPhoneInputSchema: z.ZodType<Prisma.CallUncheckedCreateWithoutPhoneInput> = z.object({
  id: z.number().int().optional(),
  statusId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallCreateOrConnectWithoutPhoneInputSchema: z.ZodType<Prisma.CallCreateOrConnectWithoutPhoneInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => CallCreateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema) ]),
}).strict();

export const CallCreateManyPhoneInputEnvelopeSchema: z.ZodType<Prisma.CallCreateManyPhoneInputEnvelope> = z.object({
  data: z.union([ z.lazy(() => CallCreateManyPhoneInputSchema),z.lazy(() => CallCreateManyPhoneInputSchema).array() ]),
  skipDuplicates: z.boolean().optional()
}).strict();

export const CallUpsertWithWhereUniqueWithoutPhoneInputSchema: z.ZodType<Prisma.CallUpsertWithWhereUniqueWithoutPhoneInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  update: z.union([ z.lazy(() => CallUpdateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedUpdateWithoutPhoneInputSchema) ]),
  create: z.union([ z.lazy(() => CallCreateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedCreateWithoutPhoneInputSchema) ]),
}).strict();

export const CallUpdateWithWhereUniqueWithoutPhoneInputSchema: z.ZodType<Prisma.CallUpdateWithWhereUniqueWithoutPhoneInput> = z.object({
  where: z.lazy(() => CallWhereUniqueInputSchema),
  data: z.union([ z.lazy(() => CallUpdateWithoutPhoneInputSchema),z.lazy(() => CallUncheckedUpdateWithoutPhoneInputSchema) ]),
}).strict();

export const CallUpdateManyWithWhereWithoutPhoneInputSchema: z.ZodType<Prisma.CallUpdateManyWithWhereWithoutPhoneInput> = z.object({
  where: z.lazy(() => CallScalarWhereInputSchema),
  data: z.union([ z.lazy(() => CallUpdateManyMutationInputSchema),z.lazy(() => CallUncheckedUpdateManyWithoutPhoneInputSchema) ]),
}).strict();

export const PhoneCreateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneCreateWithoutCallsInput> = z.object({
  number: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PhoneUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneUncheckedCreateWithoutCallsInput> = z.object({
  id: z.number().int().optional(),
  number: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PhoneCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.PhoneCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => PhoneWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PhoneCreateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const PhoneStatusCreateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusCreateWithoutCallsInput> = z.object({
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PhoneStatusUncheckedCreateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedCreateWithoutCallsInput> = z.object({
  id: z.number().int().optional(),
  status: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const PhoneStatusCreateOrConnectWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusCreateOrConnectWithoutCallsInput> = z.object({
  where: z.lazy(() => PhoneStatusWhereUniqueInputSchema),
  create: z.union([ z.lazy(() => PhoneStatusCreateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedCreateWithoutCallsInputSchema) ]),
}).strict();

export const PhoneUpsertWithoutCallsInputSchema: z.ZodType<Prisma.PhoneUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => PhoneUpdateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => PhoneCreateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => PhoneWhereInputSchema).optional()
}).strict();

export const PhoneUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.PhoneUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => PhoneWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PhoneUpdateWithoutCallsInputSchema),z.lazy(() => PhoneUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const PhoneUpdateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneUpdateWithoutCallsInput> = z.object({
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  number: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneStatusUpsertWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusUpsertWithoutCallsInput> = z.object({
  update: z.union([ z.lazy(() => PhoneStatusUpdateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedUpdateWithoutCallsInputSchema) ]),
  create: z.union([ z.lazy(() => PhoneStatusCreateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedCreateWithoutCallsInputSchema) ]),
  where: z.lazy(() => PhoneStatusWhereInputSchema).optional()
}).strict();

export const PhoneStatusUpdateToOneWithWhereWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusUpdateToOneWithWhereWithoutCallsInput> = z.object({
  where: z.lazy(() => PhoneStatusWhereInputSchema).optional(),
  data: z.union([ z.lazy(() => PhoneStatusUpdateWithoutCallsInputSchema),z.lazy(() => PhoneStatusUncheckedUpdateWithoutCallsInputSchema) ]),
}).strict();

export const PhoneStatusUpdateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusUpdateWithoutCallsInput> = z.object({
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const PhoneStatusUncheckedUpdateWithoutCallsInputSchema: z.ZodType<Prisma.PhoneStatusUncheckedUpdateWithoutCallsInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyStatusInputSchema: z.ZodType<Prisma.CallCreateManyStatusInput> = z.object({
  id: z.number().int().optional(),
  phoneId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallUpdateWithoutStatusInputSchema: z.ZodType<Prisma.CallUpdateWithoutStatusInput> = z.object({
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  phone: z.lazy(() => PhoneUpdateOneRequiredWithoutCallsNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutStatusInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutStatusInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phoneId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutStatusInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutStatusInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  phoneId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallCreateManyPhoneInputSchema: z.ZodType<Prisma.CallCreateManyPhoneInput> = z.object({
  id: z.number().int().optional(),
  statusId: z.number().int(),
  script: z.string(),
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional()
}).strict();

export const CallUpdateWithoutPhoneInputSchema: z.ZodType<Prisma.CallUpdateWithoutPhoneInput> = z.object({
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  status: z.lazy(() => PhoneStatusUpdateOneRequiredWithoutCallsNestedInputSchema).optional()
}).strict();

export const CallUncheckedUpdateWithoutPhoneInputSchema: z.ZodType<Prisma.CallUncheckedUpdateWithoutPhoneInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

export const CallUncheckedUpdateManyWithoutPhoneInputSchema: z.ZodType<Prisma.CallUncheckedUpdateManyWithoutPhoneInput> = z.object({
  id: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  statusId: z.union([ z.number().int(),z.lazy(() => IntFieldUpdateOperationsInputSchema) ]).optional(),
  script: z.union([ z.string(),z.lazy(() => StringFieldUpdateOperationsInputSchema) ]).optional(),
  createdAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
  updatedAt: z.union([ z.coerce.date(),z.lazy(() => DateTimeFieldUpdateOperationsInputSchema) ]).optional(),
}).strict();

/////////////////////////////////////////
// ARGS
/////////////////////////////////////////

export const AdminFindFirstArgsSchema: z.ZodType<Prisma.AdminFindFirstArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereInputSchema.optional(),
  orderBy: z.union([ AdminOrderByWithRelationInputSchema.array(),AdminOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AdminScalarFieldEnumSchema,AdminScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AdminFindFirstOrThrowArgsSchema: z.ZodType<Prisma.AdminFindFirstOrThrowArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereInputSchema.optional(),
  orderBy: z.union([ AdminOrderByWithRelationInputSchema.array(),AdminOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AdminScalarFieldEnumSchema,AdminScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AdminFindManyArgsSchema: z.ZodType<Prisma.AdminFindManyArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereInputSchema.optional(),
  orderBy: z.union([ AdminOrderByWithRelationInputSchema.array(),AdminOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ AdminScalarFieldEnumSchema,AdminScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const AdminAggregateArgsSchema: z.ZodType<Prisma.AdminAggregateArgs> = z.object({
  where: AdminWhereInputSchema.optional(),
  orderBy: z.union([ AdminOrderByWithRelationInputSchema.array(),AdminOrderByWithRelationInputSchema ]).optional(),
  cursor: AdminWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AdminGroupByArgsSchema: z.ZodType<Prisma.AdminGroupByArgs> = z.object({
  where: AdminWhereInputSchema.optional(),
  orderBy: z.union([ AdminOrderByWithAggregationInputSchema.array(),AdminOrderByWithAggregationInputSchema ]).optional(),
  by: AdminScalarFieldEnumSchema.array(),
  having: AdminScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const AdminFindUniqueArgsSchema: z.ZodType<Prisma.AdminFindUniqueArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereUniqueInputSchema,
}).strict() ;

export const AdminFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.AdminFindUniqueOrThrowArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereUniqueInputSchema,
}).strict() ;

export const PhoneStatusFindFirstArgsSchema: z.ZodType<Prisma.PhoneStatusFindFirstArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereInputSchema.optional(),
  orderBy: z.union([ PhoneStatusOrderByWithRelationInputSchema.array(),PhoneStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneStatusScalarFieldEnumSchema,PhoneStatusScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneStatusFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PhoneStatusFindFirstOrThrowArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereInputSchema.optional(),
  orderBy: z.union([ PhoneStatusOrderByWithRelationInputSchema.array(),PhoneStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneStatusScalarFieldEnumSchema,PhoneStatusScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneStatusFindManyArgsSchema: z.ZodType<Prisma.PhoneStatusFindManyArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereInputSchema.optional(),
  orderBy: z.union([ PhoneStatusOrderByWithRelationInputSchema.array(),PhoneStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneStatusScalarFieldEnumSchema,PhoneStatusScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneStatusAggregateArgsSchema: z.ZodType<Prisma.PhoneStatusAggregateArgs> = z.object({
  where: PhoneStatusWhereInputSchema.optional(),
  orderBy: z.union([ PhoneStatusOrderByWithRelationInputSchema.array(),PhoneStatusOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneStatusWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PhoneStatusGroupByArgsSchema: z.ZodType<Prisma.PhoneStatusGroupByArgs> = z.object({
  where: PhoneStatusWhereInputSchema.optional(),
  orderBy: z.union([ PhoneStatusOrderByWithAggregationInputSchema.array(),PhoneStatusOrderByWithAggregationInputSchema ]).optional(),
  by: PhoneStatusScalarFieldEnumSchema.array(),
  having: PhoneStatusScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PhoneStatusFindUniqueArgsSchema: z.ZodType<Prisma.PhoneStatusFindUniqueArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereUniqueInputSchema,
}).strict() ;

export const PhoneStatusFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PhoneStatusFindUniqueOrThrowArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereUniqueInputSchema,
}).strict() ;

export const PhoneFindFirstArgsSchema: z.ZodType<Prisma.PhoneFindFirstArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneScalarFieldEnumSchema,PhoneScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneFindFirstOrThrowArgsSchema: z.ZodType<Prisma.PhoneFindFirstOrThrowArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneScalarFieldEnumSchema,PhoneScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneFindManyArgsSchema: z.ZodType<Prisma.PhoneFindManyArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ PhoneScalarFieldEnumSchema,PhoneScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const PhoneAggregateArgsSchema: z.ZodType<Prisma.PhoneAggregateArgs> = z.object({
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithRelationInputSchema.array(),PhoneOrderByWithRelationInputSchema ]).optional(),
  cursor: PhoneWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PhoneGroupByArgsSchema: z.ZodType<Prisma.PhoneGroupByArgs> = z.object({
  where: PhoneWhereInputSchema.optional(),
  orderBy: z.union([ PhoneOrderByWithAggregationInputSchema.array(),PhoneOrderByWithAggregationInputSchema ]).optional(),
  by: PhoneScalarFieldEnumSchema.array(),
  having: PhoneScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const PhoneFindUniqueArgsSchema: z.ZodType<Prisma.PhoneFindUniqueArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PhoneFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.PhoneFindUniqueOrThrowArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const CallFindFirstArgsSchema: z.ZodType<Prisma.CallFindFirstArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallFindFirstOrThrowArgsSchema: z.ZodType<Prisma.CallFindFirstOrThrowArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallFindManyArgsSchema: z.ZodType<Prisma.CallFindManyArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
  distinct: z.union([ CallScalarFieldEnumSchema,CallScalarFieldEnumSchema.array() ]).optional(),
}).strict() ;

export const CallAggregateArgsSchema: z.ZodType<Prisma.CallAggregateArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithRelationInputSchema.array(),CallOrderByWithRelationInputSchema ]).optional(),
  cursor: CallWhereUniqueInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallGroupByArgsSchema: z.ZodType<Prisma.CallGroupByArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  orderBy: z.union([ CallOrderByWithAggregationInputSchema.array(),CallOrderByWithAggregationInputSchema ]).optional(),
  by: CallScalarFieldEnumSchema.array(),
  having: CallScalarWhereWithAggregatesInputSchema.optional(),
  take: z.number().optional(),
  skip: z.number().optional(),
}).strict() ;

export const CallFindUniqueArgsSchema: z.ZodType<Prisma.CallFindUniqueArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallFindUniqueOrThrowArgsSchema: z.ZodType<Prisma.CallFindUniqueOrThrowArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const AdminCreateArgsSchema: z.ZodType<Prisma.AdminCreateArgs> = z.object({
  select: AdminSelectSchema.optional(),
  data: z.union([ AdminCreateInputSchema,AdminUncheckedCreateInputSchema ]),
}).strict() ;

export const AdminUpsertArgsSchema: z.ZodType<Prisma.AdminUpsertArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereUniqueInputSchema,
  create: z.union([ AdminCreateInputSchema,AdminUncheckedCreateInputSchema ]),
  update: z.union([ AdminUpdateInputSchema,AdminUncheckedUpdateInputSchema ]),
}).strict() ;

export const AdminCreateManyArgsSchema: z.ZodType<Prisma.AdminCreateManyArgs> = z.object({
  data: z.union([ AdminCreateManyInputSchema,AdminCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AdminCreateManyAndReturnArgsSchema: z.ZodType<Prisma.AdminCreateManyAndReturnArgs> = z.object({
  data: z.union([ AdminCreateManyInputSchema,AdminCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const AdminDeleteArgsSchema: z.ZodType<Prisma.AdminDeleteArgs> = z.object({
  select: AdminSelectSchema.optional(),
  where: AdminWhereUniqueInputSchema,
}).strict() ;

export const AdminUpdateArgsSchema: z.ZodType<Prisma.AdminUpdateArgs> = z.object({
  select: AdminSelectSchema.optional(),
  data: z.union([ AdminUpdateInputSchema,AdminUncheckedUpdateInputSchema ]),
  where: AdminWhereUniqueInputSchema,
}).strict() ;

export const AdminUpdateManyArgsSchema: z.ZodType<Prisma.AdminUpdateManyArgs> = z.object({
  data: z.union([ AdminUpdateManyMutationInputSchema,AdminUncheckedUpdateManyInputSchema ]),
  where: AdminWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyAdminCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyAdminCreateManyAndReturnArgs> = z.object({
  data: z.union([ AdminUpdateManyMutationInputSchema,AdminUncheckedUpdateManyInputSchema ]),
  where: AdminWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const AdminDeleteManyArgsSchema: z.ZodType<Prisma.AdminDeleteManyArgs> = z.object({
  where: AdminWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PhoneStatusCreateArgsSchema: z.ZodType<Prisma.PhoneStatusCreateArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  data: z.union([ PhoneStatusCreateInputSchema,PhoneStatusUncheckedCreateInputSchema ]),
}).strict() ;

export const PhoneStatusUpsertArgsSchema: z.ZodType<Prisma.PhoneStatusUpsertArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereUniqueInputSchema,
  create: z.union([ PhoneStatusCreateInputSchema,PhoneStatusUncheckedCreateInputSchema ]),
  update: z.union([ PhoneStatusUpdateInputSchema,PhoneStatusUncheckedUpdateInputSchema ]),
}).strict() ;

export const PhoneStatusCreateManyArgsSchema: z.ZodType<Prisma.PhoneStatusCreateManyArgs> = z.object({
  data: z.union([ PhoneStatusCreateManyInputSchema,PhoneStatusCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PhoneStatusCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PhoneStatusCreateManyAndReturnArgs> = z.object({
  data: z.union([ PhoneStatusCreateManyInputSchema,PhoneStatusCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PhoneStatusDeleteArgsSchema: z.ZodType<Prisma.PhoneStatusDeleteArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  where: PhoneStatusWhereUniqueInputSchema,
}).strict() ;

export const PhoneStatusUpdateArgsSchema: z.ZodType<Prisma.PhoneStatusUpdateArgs> = z.object({
  select: PhoneStatusSelectSchema.optional(),
  include: PhoneStatusIncludeSchema.optional(),
  data: z.union([ PhoneStatusUpdateInputSchema,PhoneStatusUncheckedUpdateInputSchema ]),
  where: PhoneStatusWhereUniqueInputSchema,
}).strict() ;

export const PhoneStatusUpdateManyArgsSchema: z.ZodType<Prisma.PhoneStatusUpdateManyArgs> = z.object({
  data: z.union([ PhoneStatusUpdateManyMutationInputSchema,PhoneStatusUncheckedUpdateManyInputSchema ]),
  where: PhoneStatusWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyPhoneStatusCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyPhoneStatusCreateManyAndReturnArgs> = z.object({
  data: z.union([ PhoneStatusUpdateManyMutationInputSchema,PhoneStatusUncheckedUpdateManyInputSchema ]),
  where: PhoneStatusWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PhoneStatusDeleteManyArgsSchema: z.ZodType<Prisma.PhoneStatusDeleteManyArgs> = z.object({
  where: PhoneStatusWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PhoneCreateArgsSchema: z.ZodType<Prisma.PhoneCreateArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  data: z.union([ PhoneCreateInputSchema,PhoneUncheckedCreateInputSchema ]),
}).strict() ;

export const PhoneUpsertArgsSchema: z.ZodType<Prisma.PhoneUpsertArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
  create: z.union([ PhoneCreateInputSchema,PhoneUncheckedCreateInputSchema ]),
  update: z.union([ PhoneUpdateInputSchema,PhoneUncheckedUpdateInputSchema ]),
}).strict() ;

export const PhoneCreateManyArgsSchema: z.ZodType<Prisma.PhoneCreateManyArgs> = z.object({
  data: z.union([ PhoneCreateManyInputSchema,PhoneCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PhoneCreateManyAndReturnArgsSchema: z.ZodType<Prisma.PhoneCreateManyAndReturnArgs> = z.object({
  data: z.union([ PhoneCreateManyInputSchema,PhoneCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const PhoneDeleteArgsSchema: z.ZodType<Prisma.PhoneDeleteArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PhoneUpdateArgsSchema: z.ZodType<Prisma.PhoneUpdateArgs> = z.object({
  select: PhoneSelectSchema.optional(),
  include: PhoneIncludeSchema.optional(),
  data: z.union([ PhoneUpdateInputSchema,PhoneUncheckedUpdateInputSchema ]),
  where: PhoneWhereUniqueInputSchema,
}).strict() ;

export const PhoneUpdateManyArgsSchema: z.ZodType<Prisma.PhoneUpdateManyArgs> = z.object({
  data: z.union([ PhoneUpdateManyMutationInputSchema,PhoneUncheckedUpdateManyInputSchema ]),
  where: PhoneWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyPhoneCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyPhoneCreateManyAndReturnArgs> = z.object({
  data: z.union([ PhoneUpdateManyMutationInputSchema,PhoneUncheckedUpdateManyInputSchema ]),
  where: PhoneWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const PhoneDeleteManyArgsSchema: z.ZodType<Prisma.PhoneDeleteManyArgs> = z.object({
  where: PhoneWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CallCreateArgsSchema: z.ZodType<Prisma.CallCreateArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  data: z.union([ CallCreateInputSchema,CallUncheckedCreateInputSchema ]),
}).strict() ;

export const CallUpsertArgsSchema: z.ZodType<Prisma.CallUpsertArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
  create: z.union([ CallCreateInputSchema,CallUncheckedCreateInputSchema ]),
  update: z.union([ CallUpdateInputSchema,CallUncheckedUpdateInputSchema ]),
}).strict() ;

export const CallCreateManyArgsSchema: z.ZodType<Prisma.CallCreateManyArgs> = z.object({
  data: z.union([ CallCreateManyInputSchema,CallCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallCreateManyAndReturnArgsSchema: z.ZodType<Prisma.CallCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallCreateManyInputSchema,CallCreateManyInputSchema.array() ]),
  skipDuplicates: z.boolean().optional(),
}).strict() ;

export const CallDeleteArgsSchema: z.ZodType<Prisma.CallDeleteArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallUpdateArgsSchema: z.ZodType<Prisma.CallUpdateArgs> = z.object({
  select: CallSelectSchema.optional(),
  include: CallIncludeSchema.optional(),
  data: z.union([ CallUpdateInputSchema,CallUncheckedUpdateInputSchema ]),
  where: CallWhereUniqueInputSchema,
}).strict() ;

export const CallUpdateManyArgsSchema: z.ZodType<Prisma.CallUpdateManyArgs> = z.object({
  data: z.union([ CallUpdateManyMutationInputSchema,CallUncheckedUpdateManyInputSchema ]),
  where: CallWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const updateManyCallCreateManyAndReturnArgsSchema: z.ZodType<Prisma.updateManyCallCreateManyAndReturnArgs> = z.object({
  data: z.union([ CallUpdateManyMutationInputSchema,CallUncheckedUpdateManyInputSchema ]),
  where: CallWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;

export const CallDeleteManyArgsSchema: z.ZodType<Prisma.CallDeleteManyArgs> = z.object({
  where: CallWhereInputSchema.optional(),
  limit: z.number().optional(),
}).strict() ;