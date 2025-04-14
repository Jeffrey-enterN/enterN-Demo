import { useState, useEffect, useRef } from "react";
import { Send, Paperclip, Phone, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Message as MessageType } from "@shared/schema";

interface Message {
  id: number;
  senderId: number;
  content: string;
  createdAt: string;
  senderName?: string;
}

interface MessageInterfaceProps {
  matchId: number;
  currentUserId: number;
  currentUserName: string;
  matchUserName: string;
  matchUserCompany?: string; // Optional: only for employers
  initialMessages?: Message[];
  onClose?: () => void;
}

export default function MessageInterface({
  matchId,
  currentUserId,
  currentUserName,
  matchUserName,
  matchUserCompany,
  initialMessages = [],
  onClose
}: MessageInterfaceProps) {
  const [newMessage, setNewMessage] = useState<string>("");
  const { toast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch messages for this match
  const { data: fetchedMessages = [], isLoading } = useQuery<MessageType[]>({
    queryKey: [`/api/messages/${matchId}`],
    refetchInterval: 5000, // Poll for new messages every 5 seconds
  });

  // Use a combination of initial messages and fetched messages, prioritizing fetched messages
  const messages = fetchedMessages.length > 0 
    ? fetchedMessages.map(msg => ({
        id: msg.id,
        senderId: msg.senderId,
        content: msg.content,
        createdAt: msg.createdAt.toString(),
        senderName: msg.senderId === currentUserId ? currentUserName : matchUserName
      }))
    : initialMessages;

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest(
        "POST", 
        `/api/messages/${matchId}`, 
        { content }
      );
      return await response.json();
    },
    onSuccess: () => {
      // Clear the input field
      setNewMessage("");
      
      // Invalidate and refetch messages
      queryClient.invalidateQueries({ queryKey: [`/api/messages/${matchId}`] });
      
      // Show success toast
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully.",
        duration: 2000,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: `Failed to send message: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Function to send a message
  const sendMessage = () => {
    if (!newMessage.trim()) return;
    sendMessageMutation.mutate(newMessage);
  };

  // Handle Enter key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Group messages by date for better UI organization
  const groupedMessages = messages.reduce((groups: { [key: string]: Message[] }, message) => {
    const date = new Date(message.createdAt).toLocaleDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(message);
    return groups;
  }, {});

  return (
    <Card className="flex flex-col h-[600px] w-full max-w-2xl shadow-lg border-[#e0f7fa] bg-gradient-to-b from-white to-[#f5fdff]">
      <CardHeader className="border-b px-4 py-3 flex flex-row items-center justify-between bg-white">
        <div className="flex items-center space-x-2">
          <Avatar className="h-10 w-10 border-2 border-[#5ce1e6]">
            <AvatarFallback className="bg-[#5ce1e6] text-white">
              {matchUserName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold">{matchUserName}</h3>
            {matchUserCompany && (
              <p className="text-sm text-gray-500">{matchUserCompany}</p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <Button size="icon" variant="ghost" className="text-[#5ce1e6] hover:text-[#5ce1e6] hover:bg-[#e0f7fa]">
            <Phone className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="ghost" className="text-[#5ce1e6] hover:text-[#5ce1e6] hover:bg-[#e0f7fa]">
            <Video className="h-5 w-5" />
          </Button>
          {onClose && (
            <Button size="sm" variant="outline" onClick={onClose}>
              Close
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
        {Object.keys(groupedMessages).length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <p className="text-lg font-medium text-gray-500">Start the conversation</p>
              <p className="text-sm text-gray-400">
                Send a message to begin chatting with {matchUserName}
              </p>
            </div>
          </div>
        ) : (
          Object.entries(groupedMessages).map(([date, dayMessages]) => (
            <div key={date} className="space-y-2">
              <div className="flex items-center justify-center">
                <Separator className="flex-grow" />
                <span className="mx-2 text-xs text-gray-500">{date}</span>
                <Separator className="flex-grow" />
              </div>
              
              {dayMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.senderId === currentUserId ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.senderId === currentUserId
                        ? "bg-[#5ce1e6] text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {new Date(message.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </CardContent>

      <CardFooter className="p-3 border-t">
        <div className="flex w-full items-center space-x-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="text-gray-400 hover:text-[#5ce1e6]"
          >
            <Paperclip className="h-5 w-5" />
          </Button>
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button
            type="button"
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="bg-[#5ce1e6] hover:bg-[#4bced3] text-white"
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}