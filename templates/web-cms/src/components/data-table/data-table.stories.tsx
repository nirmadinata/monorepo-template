// oxlint-disable no-alert

import type { Meta, StoryObj } from "@storybook/tanstack-react";
import { MailIcon, PencilIcon, TrashIcon, UserIcon } from "lucide-react";
import { useState } from "react";

import { columnAction } from "./columns/column-action";
import { columnActions } from "./columns/column-actions";
import { columnImage } from "./columns/column-image";
import { columnLink } from "./columns/column-link";
import { columnNumbering } from "./columns/column-numbering";
import { columnSelect } from "./columns/column-select";
import { columnText } from "./columns/column-text";
import { DataTable } from "./data-table";

interface User {
    id: string;
    name: string;
    email: string;
    avatar: string;
    website: string;
    role: string;
    photo?: string;
}

const MOCK_USERS: User[] = [
    {
        id: "1",
        name: "Alice Johnson",
        email: "alice@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Alice+Johnson",
        photo: "https://picsum.photos/seed/alice/200/120",
        website: "https://alice.dev",
        role: "Admin",
    },
    {
        id: "2",
        name: "Bob Smith",
        email: "bob@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Bob+Smith",
        photo: "https://picsum.photos/seed/bob/200/120",
        website: "https://bob.io",
        role: "Editor",
    },
    {
        id: "3",
        name: "Carol White",
        email: "carol@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Carol+White",
        photo: "https://picsum.photos/seed/carol/200/120",
        website: "https://carol.dev",
        role: "Viewer",
    },
    {
        id: "4",
        name: "Dave Brown",
        email: "dave@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Dave+Brown",
        photo: "https://picsum.photos/seed/dave/200/120",
        website: "https://dave.io",
        role: "Admin",
    },
    {
        id: "5",
        name: "Eve Davis",
        email: "eve@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Eve+Davis",
        photo: "https://picsum.photos/seed/eve/200/120",
        website: "https://eve.dev",
        role: "Editor",
    },
    {
        id: "6",
        name: "Frank Miller",
        email: "frank@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Frank+Miller",
        photo: "https://picsum.photos/seed/frank/200/120",
        website: "https://frank.io",
        role: "Viewer",
    },
    {
        id: "7",
        name: "Grace Wilson",
        email: "grace@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Grace+Wilson",
        photo: "https://picsum.photos/seed/grace/200/120",
        website: "https://grace.dev",
        role: "Admin",
    },
    {
        id: "8",
        name: "Hank Moore",
        email: "hank@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Hank+Moore",
        photo: "https://picsum.photos/seed/hank/200/120",
        website: "https://hank.io",
        role: "Editor",
    },
    {
        id: "9",
        name: "Ivy Taylor",
        email: "ivy@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Ivy+Taylor",
        photo: "https://picsum.photos/seed/ivy/200/120",
        website: "https://ivy.dev",
        role: "Viewer",
    },
    {
        id: "10",
        name: "Jack Anderson",
        email: "jack@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Jack+Anderson",
        photo: "https://picsum.photos/seed/jack/200/120",
        website: "https://jack.io",
        role: "Admin",
    },
    {
        id: "11",
        name: "Kara Thomas",
        email: "kara@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Kara+Thomas",
        photo: "https://picsum.photos/seed/kara/200/120",
        website: "https://kara.dev",
        role: "Editor",
    },
    {
        id: "12",
        name: "Leo Jackson",
        email: "leo@example.com",
        avatar: "https://api.dicebear.com/9.x/initials/svg?seed=Leo+Jackson",
        photo: "https://picsum.photos/seed/leo/200/120",
        website: "https://leo.io",
        role: "Viewer",
    },
];

const meta: Meta<typeof DataTable> = {
    title: "DataTable/DataTable",
    component: DataTable,
    parameters: {
        layout: "padded",
    },
};

export default meta;

type Story = StoryObj<typeof DataTable>;

const BASIC_COLUMNS = [
    columnNumbering<User>(),
    columnText<User>("name", { header: "Name" }),
    columnText<User>("email", { header: "Email" }),
    columnText<User>("role", { header: "Role" }),
];

export const Basic: Story = {
    render: () => <DataTable columns={BASIC_COLUMNS} data={MOCK_USERS} />,
};

export const WithSorting: Story = {
    render: () => <DataTable columns={BASIC_COLUMNS} data={MOCK_USERS} enableSorting />,
};

export const WithPagination: Story = {
    render: () => (
        <DataTable columns={BASIC_COLUMNS} data={MOCK_USERS} pagination="automatic" enableSorting />
    ),
};

export const WithAutomaticPagination: Story = {
    render: () => (
        <DataTable
            columns={BASIC_COLUMNS}
            data={MOCK_USERS}
            pagination={{ type: "automatic", defaultPageSize: 3 }}
            enableSorting
        />
    ),
};

export const WithManualPagination: Story = {
    render: function render() {
        const [pageIndex, setPageIndex] = useState(0);
        const pageSize = 5;
        const total = MOCK_USERS.length;
        const paginatedData = MOCK_USERS.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);

        return (
            <DataTable
                columns={BASIC_COLUMNS}
                data={paginatedData}
                pagination={{
                    type: "manual",
                    pageIndex,
                    pageSize,
                    total,
                    onPageChange: setPageIndex,
                }}
                enableSorting
            />
        );
    },
};

export const WithRowSelection: Story = {
    render: () => (
        <DataTable
            columns={[
                columnSelect<User>(),
                columnNumbering<User>(),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", { header: "Role" }),
            ]}
            data={MOCK_USERS}
            enableRowSelection
            enableSorting
        />
    ),
};

export const WithRowClick: Story = {
    render: () => (
        <DataTable
            columns={BASIC_COLUMNS}
            data={MOCK_USERS}
            onRowClick={(row) => window.alert(`Clicked: ${row.original.name}`)}
        />
    ),
};

export const WithImages: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnImage<User>("avatar", {
                    header: "Avatar",
                    size: "sm",
                    fallback: (row) => row.original.name.charAt(0),
                }),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", { header: "Role" }),
            ]}
            data={MOCK_USERS}
            enableSorting
        />
    ),
};

export const WithLinks: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnLink<User>("website", { header: "Website" }),
            ]}
            data={MOCK_USERS}
        />
    ),
};

const MANY_COLUMNS = [
    columnSelect<User>(),
    columnNumbering<User>(),
    columnImage<User>("avatar", {
        header: "",
        size: "sm",
        fallback: (row) => row.original.name.charAt(0),
    }),
    columnText<User>("name", { header: "Name" }),
    columnText<User>("email", { header: "Email" }),
    columnText<User>("email", { header: "Email Duplicate" }),
    columnText<User>("role", { header: "Role" }),
    columnText<User>("role", { header: "Role Duplicate" }),
    columnLink<User>("website", { header: "Website" }),
    columnLink<User>("website", { header: "Website Duplicate" }),
    columnText<User>("id", { header: "ID" }),
    columnImage<User>("photo", { header: "Photo", shape: "rectangle" }),
    columnAction<User>({
        icon: MailIcon,
        label: "Send email",
        onClick: (row) => window.alert(`Emailing: ${row.original.email}`),
    }),
    columnActions<User>({
        label: "Row actions",
        items: [
            {
                label: "Edit",
                icon: PencilIcon,
                onClick: (row) => window.alert(`Edit: ${row.original.name}`),
            },
            {
                label: "Delete",
                icon: TrashIcon,
                variant: "destructive",
                onClick: (row) => window.alert(`Delete: ${row.original.name}`),
            },
        ],
    }),
];

export const WithManyColumns: Story = {
    render: () => (
        <DataTable columns={MANY_COLUMNS} data={MOCK_USERS.slice(0, 6)} horizontalScroll />
    ),
};

export const WithRectangularImages: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnImage<User>("photo", { header: "Photo", shape: "rectangle" }),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", { header: "Role" }),
            ]}
            data={MOCK_USERS.slice(0, 6)}
        />
    ),
};

export const WithLargeRectangularImages: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnImage<User>("photo", { header: "Photo", shape: "rectangle", size: "lg" }),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
            ]}
            data={MOCK_USERS.slice(0, 4)}
        />
    ),
};

export const WithSingleAction: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", { header: "Role" }),
                columnAction<User>({
                    icon: MailIcon,
                    label: "Send email",
                    onClick: (row) => window.alert(`Emailing: ${row.original.email}`),
                }),
            ]}
            data={MOCK_USERS.slice(0, 6)}
        />
    ),
};

export const WithActionsDropdown: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", { header: "Role" }),
                columnActions<User>({
                    label: "Row actions",
                    items: [
                        {
                            label: "Edit",
                            icon: PencilIcon,
                            onClick: (row) => window.alert(`Edit: ${row.original.name}`),
                        },
                        {
                            label: "View Profile",
                            icon: UserIcon,
                            onClick: (row) => window.alert(`View: ${row.original.name}`),
                        },
                        {
                            label: "Delete",
                            icon: TrashIcon,
                            variant: "destructive",
                            onClick: (row) => window.alert(`Delete: ${row.original.name}`),
                        },
                    ],
                }),
            ]}
            data={MOCK_USERS.slice(0, 6)}
        />
    ),
};

export const FullFeatured: Story = {
    render: () => (
        <DataTable
            columns={[
                columnSelect<User>(),
                columnNumbering<User>(),
                columnImage<User>("avatar", {
                    header: "",
                    size: "sm",
                    fallback: (row) => row.original.name.charAt(0),
                }),
                columnText<User>("name", { header: "Name" }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", { header: "Role" }),
                columnLink<User>("website", { header: "Website" }),
                columnActions<User>({
                    label: "Row actions",
                    items: [
                        {
                            label: "Edit",
                            icon: PencilIcon,
                            onClick: (row) => window.alert(`Edit: ${row.original.name}`),
                        },
                        {
                            label: "Delete",
                            icon: TrashIcon,
                            variant: "destructive",
                            onClick: (row) => window.alert(`Delete: ${row.original.name}`),
                        },
                    ],
                }),
            ]}
            data={MOCK_USERS}
            enableRowSelection
            pagination={{ type: "automatic", defaultPageSize: 5 }}
            enableSorting
        />
    ),
};

export const EmptyState: Story = {
    render: () => (
        <DataTable
            columns={BASIC_COLUMNS}
            data={[]}
            emptyMessage="No users found. Try adjusting your filters."
        />
    ),
};

export const CustomCellFormatter: Story = {
    render: () => (
        <DataTable
            columns={[
                columnNumbering<User>(),
                columnText<User>("name", {
                    header: "Name",
                    cell: (value) => (
                        <span className="font-semibold text-primary">{String(value)}</span>
                    ),
                }),
                columnText<User>("email", { header: "Email" }),
                columnText<User>("role", {
                    header: "Role",
                    cell: (value) => {
                        const role = String(value);
                        const badgeColors: Record<string, string> = {
                            Admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
                            Editor: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            Viewer: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
                        };
                        return (
                            <span
                                className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${badgeColors[role] ?? ""}`}
                            >
                                {role}
                            </span>
                        );
                    },
                }),
            ]}
            data={MOCK_USERS}
        />
    ),
};
