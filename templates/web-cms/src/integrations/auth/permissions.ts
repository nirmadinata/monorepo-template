import type { Statements } from "better-auth/plugins/access";
import { createAccessControl } from "better-auth/plugins/access";
import { adminAc, defaultStatements } from "better-auth/plugins/admin/access";

export const STATEMENT_MEMBER_ENUM = {
    USER: {
        IMPERSONATE_ADMINS: "impersonate-admins",
    },
} as const;

export const ROLES_ENUM = {
    ADMIN: "admin",
    SUPERADMIN: "superadmin",
} as const;

const statements = {
    ...defaultStatements,
} satisfies Statements;

export const ac = createAccessControl(statements);

const admin = ac.newRole({
    ...adminAc.statements,
    user: [STATEMENT_MEMBER_ENUM.USER.IMPERSONATE_ADMINS, ...adminAc.statements.user],
});

const superadmin = ac.newRole({
    ...admin.statements,
    user: [STATEMENT_MEMBER_ENUM.USER.IMPERSONATE_ADMINS, ...adminAc.statements.user],
});

export const ROLES = {
    [ROLES_ENUM.ADMIN]: admin,
    [ROLES_ENUM.SUPERADMIN]: superadmin,
} as const;
