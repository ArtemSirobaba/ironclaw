import { Icon } from "../../../design-system/icons.js";
import { React, html } from "../../../lib/html.js";
import { useT } from "../../../lib/i18n.js";
import {
  formatSize,
  useComposerAttachments,
} from "../hooks/useComposerAttachments.js";

export function ChatInput({
  onSend,
  disabled,
  initialText = "",
  resetKey = "",
}) {
  const t = useT();
  const [text, setText] = React.useState("");
  const textareaRef = React.useRef(null);
  const {
    images,
    attachments,
    addFiles,
    removeImage,
    removeAttachment,
    clearAttachments,
  } = useComposerAttachments();

  const autoResize = React.useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  React.useEffect(() => {
    autoResize();
  }, [text, autoResize]);

  React.useEffect(() => {
    if (!initialText) return;
    setText(initialText);
    window.requestAnimationFrame(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
        textareaRef.current.setSelectionRange(
          initialText.length,
          initialText.length
        );
      }
    });
  }, [initialText, resetKey]);

  const handleSend = React.useCallback(() => {
    if (
      (!text.trim() && images.length === 0 && attachments.length === 0) ||
      disabled
    )
      return;
    onSend(text.trim(), { images, attachments });
    setText("");
    clearAttachments();
    if (textareaRef.current) textareaRef.current.style.height = "auto";
  }, [text, images, attachments, disabled, onSend, clearAttachments]);

  const onKeyDown = React.useCallback(
    (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const onPaste = React.useCallback(
    (e) => {
      const files = Array.from(e.clipboardData.files);
      if (files.length > 0) {
        e.preventDefault();
        addFiles(files);
      }
    },
    [addFiles]
  );

  const onDrop = React.useCallback(
    (e) => {
      e.preventDefault();
      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) addFiles(files);
    },
    [addFiles]
  );

  const onDragOver = React.useCallback((e) => e.preventDefault(), []);

  const onFileInputChange = React.useCallback(
    (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length > 0) addFiles(files);
      e.target.value = "";
    },
    [addFiles]
  );

  return html`
    <div
      className="border-t border-white/10 bg-iron-950/84 px-4 py-4 sm:px-5 lg:px-8"
    >
      ${(images.length > 0 || attachments.length > 0) &&
      html`
        <div className="mb-2 flex flex-wrap gap-2">
          ${images.map(
            (img, i) => html`
              <div key=${i} className="group relative">
                <img
                  src=${img.dataUrl}
                  className="h-16 w-16 rounded-lg border border-iron-700 object-cover"
                  alt=""
                />
                <button
                  onClick=${() => removeImage(i)}
                  className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-red-300/30 bg-red-500 text-white opacity-0 transition group-hover:opacity-100"
                  aria-label=${t("chat.removeImage")}
                >
                  <${Icon} name="close" className="h-3 w-3" />
                </button>
              </div>
            `
          )}
          ${attachments.map(
            (att, i) => html`
              <div
                key=${i}
                className="flex items-center gap-2 rounded-md border border-iron-700 bg-iron-900 px-2 py-1 text-xs"
              >
                <${Icon} name="file" className="h-3.5 w-3.5 text-signal" />
                <span className="truncate">${att.filename}</span>
                <span className="text-iron-200">${formatSize(att.size)}</span>
                <button
                  onClick=${() => removeAttachment(i)}
                  className="ml-1 text-iron-200 hover:text-white"
                  aria-label=${t("chat.removeAttachment")}
                >
                  <${Icon} name="close" className="h-3.5 w-3.5" />
                </button>
              </div>
            `
          )}
        </div>
      `}

      <div
        className="mx-auto flex max-w-5xl items-end gap-2"
        onDrop=${onDrop}
        onDragOver=${onDragOver}
      >
        <label
          className="v2-button flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-md border border-white/10 bg-white/[0.035] text-iron-200 hover:border-signal/40 hover:text-signal"
        >
          <input
            type="file"
            multiple
            className="hidden"
            onChange=${onFileInputChange}
          />
          <${Icon} name="attach" className="h-5 w-5" />
        </label>

        <textarea
          ref=${textareaRef}
          value=${text}
          onChange=${(e) => setText(e.target.value)}
          onKeyDown=${onKeyDown}
          onPaste=${onPaste}
          placeholder=${t("chat.placeholder")}
          rows=${1}
          disabled=${disabled}
          className="max-h-[200px] min-h-[44px] flex-1 resize-none rounded-md border border-white/10 bg-iron-900/86 px-3 py-2.5 text-sm text-white outline-none transition placeholder:text-iron-700 focus:border-signal/70 disabled:opacity-50"
        />

        <button
          onClick=${handleSend}
          disabled=${disabled ||
          (!text.trim() && images.length === 0 && attachments.length === 0)}
          className="v2-button v2-button-primary flex h-11 w-11 shrink-0 items-center justify-center rounded-md disabled:opacity-50"
          aria-label=${t("chat.send")}
        >
          <${Icon} name="send" className="h-5 w-5" />
        </button>
      </div>
    </div>
  `;
}
