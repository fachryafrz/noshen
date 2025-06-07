import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-dvh place-content-center">
      <SignIn />
    </div>
  );
}
