/* eslint-disable @next/next/no-img-element */
"use client";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronsLeft,
  CirclePlus,
  Search,
  Settings,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useRouter } from "next/navigation";
import { DocumentsTree } from "@/lib/types";
import DocumentItem from "./documents/document-item";
import { useEffect, useRef, useState } from "react";

export default function Sidebar() {
  const router = useRouter();

  const { user } = useClerk();

  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);

  const handleCreateDocument = async (parentDocumentId?: Id<"documents">) => {
    const documentId = await createDocument({
      title: "Untitled",
      parentDocumentId: parentDocumentId,
    });

    router.push(`/${user?.username}/${documentId}`);
  };

  const menu = [
    {
      icon: <Search className="size-5" />,
      title: "Search",
      onClick: () => {
        toast.info("Not implemented yet");
      },
    },
    {
      icon: <Settings className="size-5" />,
      title: "Settings",
      onClick: () => {
        toast.info("Not implemented yet");
      },
    },
    {
      icon: <CirclePlus className="size-5" />,
      title: "New page",
      onClick: handleCreateDocument,
    },
  ];

  function buildTree(
    docs: DocumentsTree[],
    parentId: string | null = null
  ): DocumentsTree[] {
    return docs
      .filter((doc) => (doc.parentDocumentId ?? null) === parentId)
      .map((doc) => ({
        ...doc,
        children: buildTree(docs, doc._id),
      }));
  }

  const tree = buildTree((documents as DocumentsTree[]) ?? []);

  const [width, setWidth] = useState(240); // default 240px
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current || !sidebarRef.current) return;
      const newWidth = e.clientX;
      if (newWidth > 200 && newWidth < 480) setWidth(newWidth); // batas minimal & maksimal
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  return (
    <aside
      ref={sidebarRef}
      className="bg-secondary/50 p-2 pb-0 h-dvh group/sidebar overflow-y-auto relative flex flex-col z-50"
      style={{
        width: width,
      }}
    >
      {/* User */}
      <div className="flex">
        {/* User Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer grow justify-start"
            >
              <img src={user?.imageUrl} alt="" className="w-5 h-5 rounded" />
              {user?.username}
              <ChevronDown className="text-primary/50" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem
              asChild
              variant="destructive"
              className="w-full cursor-pointer"
            >
              <SignOutButton>Log out</SignOutButton>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Collapse Toggle */}
        <Button
          variant={`ghost`}
          className="cursor-pointer opacity-0 transition-all group-hover/sidebar:opacity-100"
          size={"icon"}
          onClick={() => {
            toast.info("Not implemented yet");
          }}
        >
          <ChevronsLeft className="size-6 text-primary/50" />
        </Button>
      </div>

      <div className="space-y-2 grow overflow-x-auto -mx-2 px-2">
        {/* Menu */}
        <ul>
          {menu.map((item) => (
            <li key={item.title}>
              <Button
                variant={`ghost`}
                className="cursor-pointer w-full justify-start"
                onClick={() => item.onClick()}
              >
                {item.icon}
                <span>{item.title}</span>
              </Button>
            </li>
          ))}
        </ul>

        {/* Documents */}
        <ul>
          {tree?.map((document) => (
            <DocumentItem
              key={document._id}
              document={document as DocumentsTree}
              onClick={handleCreateDocument}
            />
          ))}
        </ul>

        {/* Trash */}
        <Button
          variant={`ghost`}
          className="cursor-pointer w-full justify-start"
          onClick={() => {
            toast.info("Not implemented yet");
          }}
        >
          <Trash2 />
          Trash
        </Button>
      </div>

      {/* Resizable Handle */}
      <div
        onMouseDown={() => (isResizingRef.current = true)}
        className="opacity-50 hover:opacity-100 transition-all cursor-col-resize absolute h-full w-0.5 bg-primary/10 right-0 top-0 hover:w-1"
      ></div>
    </aside>
  );
}
