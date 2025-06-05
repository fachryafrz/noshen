import { Smile } from "lucide-react";
import { Button } from "../ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import EmojiPicker, { Theme } from "emoji-picker-react";
import { useTheme } from "next-themes";
import { MouseDownEvent } from "emoji-picker-react/dist/config/config";

export default function ToolbarIcon({
  onEmojiClick,
}: {
  onEmojiClick: MouseDownEvent;
}) {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={"ghost"} className="cursor-pointer">
          <Smile /> Add icon
        </Button>
      </PopoverTrigger>
      <PopoverContent className="!w-auto !border-0 !p-0">
        <EmojiPicker
          theme={resolvedTheme === "dark" ? Theme.DARK : Theme.LIGHT}
          onEmojiClick={onEmojiClick}
        />
      </PopoverContent>
    </Popover>
  );
}
