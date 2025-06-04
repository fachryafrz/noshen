import { Doc } from "../../convex/_generated/dataModel";

export interface DocumentsTree extends Doc<"documents"> {
  children: DocumentsTree[];
}
