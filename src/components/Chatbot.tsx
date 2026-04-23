import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm MarvelBot 🚗 Welcome to Marvel Driving School! How can I help you today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  const quickReplies = [
    "View Packages",
    "Training Schedule",
    "Book a Lesson",
    "Contact Info",
  ];

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages([...messages, userMessage]);
    setInputValue("");

    // Simulate bot response
    setTimeout(() => {
      const botResponse = getBotResponse(inputValue.toLowerCase());
      const botMessage: Message = {
        id: messages.length + 2,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);
  };

  const getBotResponse = (input: string): string => {
    if (input.includes("price") || input.includes("package") || input.includes("cost")) {
      return "Our packages:\n\n🎓 Beginner Course: ₦70,000\n• Complete training for first-time drivers\n• Includes theory & practical sessions\n\n🔄 Refresher Course: ₦45,000\n• Perfect for returning drivers\n• Focused skill building\n\nWould you like to book a lesson?";
    }
    
    if (input.includes("schedule") || input.includes("time") || input.includes("when")) {
      return "📅 Training Schedule:\n\n• Days: Monday - Friday\n• Hours: 8:30 AM - 5:30 PM\n• Practical: Mon-Thu\n• Theory Classes: Friday (starts 10 AM)\n• Weekend: Special request only\n\nLocation: BCA Road by Secretariat, beside Vision Africa Radio Station";
    }
    
    if (input.includes("book") || input.includes("register") || input.includes("enroll")) {
      return "Great! To book your lesson, I'll need:\n\n1. Your full name\n2. Preferred day (Mon-Fri)\n3. Morning or Afternoon?\n4. Manual or Automatic?\n5. Package (Beginner/Refresher)\n6. Phone number\n\nPlease provide these details, or contact us directly:\n📱 WhatsApp: +234 816 597 3142";
    }
    
    if (input.includes("location") || input.includes("address") || input.includes("where")) {
      return "📍 Our Locations:\n\n🏆 Training Ground (FRSC Approved):\nBCA Road by Secretariat, beside Vision Africa Radio Station\n\n📍 Other Offices:\n• Low-Cost Housing Estate\n• Ohobo Afara Junction\n• 88 Old Timber Road\n• Umudike beside Chaise World Hotel\n\nAll practical training happens at BCA Road!";
    }
    
    if (input.includes("contact") || input.includes("phone") || input.includes("whatsapp")) {
      return "📞 Contact Us:\n\n📱 Phone/WhatsApp: +234 816 597 3142\n📸 Instagram: @marveldrivingschool\n⏰ Hours: Mon-Fri, 8:30 AM - 5:30 PM\n\nFeel free to reach out anytime!";
    }

    return "For specific details about that, please contact our CEO directly:\n\n📱 +234 816 597 3142 (WhatsApp)\n\nOr ask me about:\n• Packages & Pricing\n• Training Schedule\n• Locations\n• Booking a Lesson";
  };

  const handleQuickReply = (reply: string) => {
    setInputValue(reply);
    handleSendMessage();
  };

  return (
    <>
      {/* Chat Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 md:w-16 md:h-16 bg-gradient-primary text-white rounded-full shadow-large hover:shadow-hover transition-all duration-300 flex items-center justify-center group"
        aria-label="Open chat"
      >
        {isOpen ? (
          <X className="w-6 h-6 md:w-7 md:h-7" />
        ) : (
          <MessageCircle className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 h-[32rem] bg-card border border-border rounded-2xl shadow-large flex flex-col overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-primary p-4 text-white">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold">MarvelBot</h3>
                <p className="text-xs text-white/80">Online • Ready to help</p>
              </div>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-2xl whitespace-pre-line ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-foreground"
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Replies */}
          <div className="px-4 pb-2">
            <div className="flex flex-wrap gap-2">
              {quickReplies.map((reply) => (
                <button
                  key={reply}
                  onClick={() => handleQuickReply(reply)}
                  className="text-xs px-3 py-1.5 bg-accent text-accent-foreground rounded-full hover:bg-accent/80 transition-colors"
                >
                  {reply}
                </button>
              ))}
            </div>
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Type your message..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button
                onClick={handleSendMessage}
                size="icon"
                className="flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
