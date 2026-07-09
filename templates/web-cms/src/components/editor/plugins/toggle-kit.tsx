"use client";

import { TogglePlugin } from "@platejs/toggle/react";

import { IndentKit } from "#/components/editor/plugins/indent-kit.tsx";
import { ToggleElement } from "#/components/ui/toggle-node.tsx";

export const ToggleKit = [...IndentKit, TogglePlugin.withComponent(ToggleElement)];
