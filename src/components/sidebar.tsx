/* eslint-disable @next/next/no-img-element */
"use client";

import { SignOutButton, useClerk } from "@clerk/nextjs";
import {
  ChevronDown,
  ChevronsLeft,
  CirclePlus,
  File,
  Home,
  Search,
  Settings,
  Trash2,
  Undo,
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
import { usePathname, useRouter } from "next/navigation";
import { DocumentsTree } from "@/lib/types";
import DocumentItem from "./documents/document-item";
import { useEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "./ui/input";

export default function Sidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [, , documentId] = pathname.split("/");

  const { user } = useClerk();

  const [searchTrashQuery, setSearchTrashQuery] = useState("");

  const createDocument = useMutation(api.documents.createDocument);
  const documents = useQuery(api.documents.getDocuments);
  const deletedDocuments = useQuery(api.documents.getDeleted, {
    query: searchTrashQuery,
  });
  const restoreDocument = useMutation(api.documents.restoreDocument);
  const deleteForever = useMutation(api.documents.deleteForever);

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
      icon: <Home className="size-5" />,
      title: "Home",
      onClick: () => {
        router.push(`/${user?.username}`);
      },
    },
    {
      icon: <Settings className="size-5" />,
      title: "Settings",
      onClick: () => {
        toast.info("Not implemented yet");
      },
    },
  ];

  function buildTree(
    docs: DocumentsTree[],
    parentId: string | null = null,
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
      className="bg-secondary/50 group/sidebar relative z-50 flex h-dvh flex-col overflow-y-auto p-2 pb-0"
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
              className="grow cursor-pointer justify-start"
            >
              <img src={user?.imageUrl} alt="" className="h-5 w-5 rounded" />
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
          <ChevronsLeft className="text-primary/50 size-6" />
        </Button>
      </div>

      <div className="-mx-2 grow space-y-2 overflow-x-auto px-2">
        {/* Menu */}
        <ul>
          {menu.map((item) => (
            <li key={item.title}>
              <Button
                variant={`ghost`}
                className="w-full cursor-pointer justify-start"
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
            />
          ))}
          <li>
            <Button
              variant={`ghost`}
              className="w-full cursor-pointer justify-start"
              onClick={() => handleCreateDocument()}
            >
              <CirclePlus />
              New page
            </Button>
          </li>
        </ul>

        {/* Trash */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={`ghost`}
              className="w-full cursor-pointer justify-start"
            >
              <Trash2 />
              Trash
            </Button>
          </PopoverTrigger>
          <PopoverContent side="right" className="z-[99999]">
            <div className="space-y-4">
              <div className="flex items-center gap-1">
                {/* Icon */}
                <div className="grid w-9 place-content-center">
                  <Search className="size-5" />
                </div>

                {/* Input */}
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full"
                  onChange={(e) => {
                    setSearchTrashQuery(e.target.value);
                  }}
                  value={searchTrashQuery}
                />
              </div>

              {deletedDocuments?.length === 0 && (
                <span className="text-primary/50 block w-full text-center text-sm font-medium">
                  {searchTrashQuery ? "No results found" : "No page in trash"}
                </span>
              )}

              <ul>
                {(deletedDocuments || []).map((document) => (
                  <li key={document._id}>
                    <Button
                      variant={`ghost`}
                      className="hover:!bg-accent/30 relative w-full cursor-pointer justify-start"
                      onClick={() => {
                        router.push(`/${user?.username}/${document._id}`);
                      }}
                    >
                      <File />
                      {document.title}

                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end p-2 transition-all [&_*]:pointer-events-auto">
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          className="hover:!bg-accent/100 size-6 cursor-pointer"
                          onClick={async () => {
                            await restoreDocument({
                              documentId: document._id,
                            });
                          }}
                        >
                          <Undo />
                        </Button>
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          className="hover:!bg-accent/100 size-6 cursor-pointer"
                          onClick={async () => {
                            await deleteForever({ documentId: document._id });

                            if (documentId === document._id) {
                              router.push(`/${user?.username}`);
                            }
                          }}
                        >
                          <Trash2 />
                        </Button>
                      </div>
                    </Button>
                  </li>
                ))}
              </ul>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* Resizable Handle */}
      <div
        onMouseDown={() => (isResizingRef.current = true)}
        className="bg-primary/10 absolute top-0 right-0 h-full w-0.5 cursor-col-resize opacity-50 transition-all hover:w-1 hover:opacity-100"
      ></div>
    </aside>
  );
}
