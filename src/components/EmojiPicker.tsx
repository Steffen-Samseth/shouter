import EmojiPickerReact from "emoji-picker-react";
import { FunctionComponent, useState } from "react";
import FaceMeh from "./icons/FaceMeh";
import { Arrow, useLayer } from "react-laag";

interface Props {
  onEmojiClick?: (emoji: string) => void;
}

const EmojiPicker: FunctionComponent<Props> = ({ onEmojiClick }) => {
  const [isOpen, setIsOpen] = useState(false);

  const { renderLayer, triggerProps, layerProps, arrowProps } = useLayer({
    isOpen,
    onOutsideClick: () => setIsOpen(false),
    onDisappear: () => setIsOpen(false),
    auto: true,
    placement: "top-end",
    triggerOffset: 12,
    arrowOffset: 12,
  });

  return (
    <>
      <button
        {...triggerProps}
        onClick={() => {
          setIsOpen(true);
        }}
      >
        <FaceMeh className="mr-1 h-4 fill-zinc-400" />
      </button>

      {renderLayer(
        isOpen && (
          <div {...layerProps}>
            <EmojiPickerReact
              onEmojiClick={(emojiData) => {
                if (onEmojiClick) onEmojiClick(emojiData.emoji), setIsOpen(false);
              }}
            />
            <Arrow {...arrowProps} />
          </div>
        )
      )}
    </>
  );
};

export default EmojiPicker;
