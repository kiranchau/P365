import { Toaster } from 'react-hot-toast';


export function Notification() {
    return (
        <Toaster position="top-center"
            reverseOrder={false}
            toastOptions={{
                duration: 4000,
                iconTheme: {
                    primary: "red",
                    secondary: "white"
                },
                role: "status",
                ariaLive: "polite",
                style: {
                    background: "black",
                    color: "whitesmoke"
                }
            }} />
    )
}