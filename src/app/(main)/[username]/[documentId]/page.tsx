import { Id } from "../../../../../convex/_generated/dataModel";
import DocumentPage from "@/components/documents";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ documentId: Id<"documents"> }>;
}) {
  const { documentId } = await params;

  return <DocumentPage documentId={documentId} />;
}
