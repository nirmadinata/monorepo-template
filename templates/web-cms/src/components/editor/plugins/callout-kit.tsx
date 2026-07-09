"use client";

import { CalloutPlugin } from "@platejs/callout/react";

import { CalloutElement } from "#/components/ui/callout-node.tsx";

export const CalloutKit = [CalloutPlugin.withComponent(CalloutElement)];
