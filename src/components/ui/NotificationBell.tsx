"use client"

import { useState, useEffect } from "react"
import { Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/shadcn-ui/dropdown-menu"
import { Button } from "@/components/shadcn-ui/button"
import { ScrollArea } from "@/components/shadcn-ui/scroll-area"
import { Badge } from "@/components/shadcn-ui/badge"
import { useNavigate } from 'react-router-dom'

// Types based on the Java enums
type TypeNotification = "SIGNATURE" | "APPROBATION" | "DEMANDE"
type StatusNotification = "ENVOYE" | "LU"

interface Notification {
    id: string
    message: string
    type: TypeNotification
    link: string
    status: StatusNotification
    createdAt: string
}

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [isOpen, setIsOpen] = useState(false)
    const navigate = useNavigate();

    // Fetch notifications
    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await fetch("/api/notifications")
                if (response.ok) {
                    const data = await response.json()
                    setNotifications(data)
                }
            } catch (error) {
                console.error("Failed to fetch notifications:", error)
            }
        }

        fetchNotifications()

        // Set up polling for new notifications
        const interval = setInterval(fetchNotifications, 60000) // Poll every minute

        return () => clearInterval(interval)
    }, [])

    // Count unread notifications
    const unreadCount = notifications.filter((n) => n.status === "ENVOYE").length

    // Handle notification click
    const handleNotificationClick = async (notification: Notification) => {
        // Mark as read
        try {
            await fetch(`/api/notifications/${notification.id}/read`, {
                method: "PUT",
            })

            // Update local state
            setNotifications(notifications.map((n) => (n.id === notification.id ? { ...n, status: "LU" } : n)))

            // Navigate to the appropriate page based on notification type
            if (notification.type === "DEMANDE") {
                navigate("/demandes")
            } else {
                // For SIGNATURE and APPROBATION, extract the demande ID from the link
                const demandeId = notification.link.split("/").pop()
                navigate(`/demande/${demandeId}`)
            }

            setIsOpen(false)
        } catch (error) {
            console.error("Failed to mark notification as read:", error)
        }
    }

    // Generate notification style based on type
    const getNotificationStyle = (type: TypeNotification) => {
        switch (type) {
            case "SIGNATURE":
                return "border-l-4 border-blue-500"
            case "APPROBATION":
                return "border-l-4 border-green-500"
            case "DEMANDE":
                return "border-l-4 border-orange-500"
            default:
                return ""
        }
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                        <Badge
                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500"
                            variant="destructive"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </Badge>
                    )}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
                <div className="p-2 font-medium border-b">Notifications</div>
                {notifications.length === 0 ? (
                    <div className="p-4 text-center text-muted-foreground">Aucune notification</div>
                ) : (
                    <ScrollArea className="h-[300px]">
                        <div className="p-2 grid gap-1">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-3 rounded-md cursor-pointer hover:bg-accent ${
                                        notification.status === "ENVOYE" ? "bg-muted" : ""
                                    } ${getNotificationStyle(notification.type)}`}
                                    onClick={() => handleNotificationClick(notification)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div className="font-medium text-sm">{notification.message}</div>
                                        {notification.status === "ENVOYE" && <div className="h-2 w-2 rounded-full bg-blue-500 mt-1"></div>}
                                    </div>
                                    <div className="text-xs text-muted-foreground mt-1">
                                        {new Date(notification.createdAt).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ScrollArea>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
