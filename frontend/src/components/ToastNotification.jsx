import { useEffect, useState } from "react";


export default function ToastNotification({ message, duration = 3000, onClose }) {
const [open, setOpen] = useState(Boolean(message));


useEffect(() => {
if (!message) return;
setOpen(true);
const t = setTimeout(() => {
setOpen(false);
onClose && onClose();
}, duration);
return () => clearTimeout(t);
}, [message, duration, onClose]);


if (!open || !message) return null;
return (
<div className="toast-wrap">
<div className="toast">{message}</div>
</div>
);
}