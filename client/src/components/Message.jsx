function Message({ message }) {
  if (!message?.text) {
    return null;
  }

  const messageRole =
    message.type === "error" ? "alert" : "status";

  return (
    <p
      className={`message ${message.type}`}
      role={messageRole}
    >
      {message.text}
    </p>
  );
}

export default Message;