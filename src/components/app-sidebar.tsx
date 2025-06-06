/* eslint-disable @next/next/no-img-element */
"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import {
  ChevronDown,
  CirclePlus,
  File,
  Home,
  Search,
  Settings,
  SunMoon,
  Trash2,
  Undo,
} from "lucide-react";
import { SignOutButton, useClerk } from "@clerk/nextjs";
import { toast } from "sonner";
import { usePathname, useRouter } from "next/navigation";
import DocumentItem from "./documents/document-item";
import { DocumentsTree } from "@/lib/types";
import { Id } from "../../convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Input } from "./ui/input";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ThemeToggle } from "./theme-toggle";

export function AppSidebar() {
  const router = useRouter();
  const pathname = usePathname();

  const [, , documentId] = pathname.split("/");

  const { user } = useClerk();

  const [searchTrashQuery, setSearchTrashQuery] = useState("");
  const [settingsOpen, setSettingsOpen] = useState(false);

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
      onClick: () => setSettingsOpen(true),
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

  return (
    <Sidebar className="group/sidebar">
      <SidebarHeader>
        <div className="flex items-center">
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
          <SidebarTrigger className="transition-all group-hover/sidebar:opacity-100 md:opacity-0" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
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

          <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="pb-4">Settings</DialogTitle>

                <DialogDescription className="text-primary">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <SunMoon />

                    {/* Text */}
                    <div>
                      <h3 className="font-semibold">Appearance</h3>
                      <p className="text-muted-foreground text-sm">
                        Choose your preferred theme.
                      </p>
                    </div>

                    {/* Button */}
                    <div className="flex grow items-center justify-end">
                      <ThemeToggle />
                    </div>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </SidebarGroup>
        <SidebarGroup>
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
                <CirclePlus className="size-5" />
                New page
              </Button>
            </li>
          </ul>
        </SidebarGroup>
        <SidebarGroup>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={`ghost`}
                className="w-full cursor-pointer justify-start"
              >
                <Trash2 className="size-5" />
                Trash
              </Button>
            </PopoverTrigger>
            <PopoverContent side="right" className="p-1">
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
                    <li key={document._id} className="relative">
                      <Button
                        variant={`ghost`}
                        className={cn(
                          "relative w-full cursor-pointer justify-start",
                          documentId === document._id && "bg-accent/100",
                        )}
                        onClick={() => {
                          router.push(`/${user?.username}/${document._id}`);
                        }}
                      >
                        {document.icon ? (
                          <span className="-ml-1 block">{document.icon}</span>
                        ) : (
                          <File className="size-5" />
                        )}
                        {document.title}
                      </Button>

                      <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-end p-2 transition-all [&_*]:pointer-events-auto">
                        <Button
                          size={"icon"}
                          variant={"ghost"}
                          className="size-6 cursor-pointer"
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
                          className="size-6 cursor-pointer"
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
                    </li>
                  ))}
                </ul>
              </div>
            </PopoverContent>
          </Popover>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
