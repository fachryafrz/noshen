import DocumentHeader from "@/components/documents/header";
import { Id } from "../../../../../convex/_generated/dataModel";

export default async function DocumentsPage({
  params,
}: {
  params: Promise<{ documentId: Id<"documents"> }>;
}) {
  const { documentId } = await params;

  return (
    <div>
      {/* Header */}
      <DocumentHeader documentId={documentId} />

      {/* Content */}
      <div className="p-4">Content</div>
    </div>
  );
}
