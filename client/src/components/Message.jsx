function Message({ message }) {
  if (!message?.text) {
    return null;
  }

  return (
    <div className={`message ${message.type}`} aria-live="polite">
      {message.text}
    </div>
  );
}

export default Message;