import { useState, useEffect, useRef } from "react";
import { chatService } from "../../services/chatService";
import {
  Bot,
  User,
  Send,
  Sparkles,
  Package,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function ChatInterface(){

const [messages,setMessages]=useState([])
const [input,setInput]=useState("")
const [loading,setLoading]=useState(false)

const [sessionId]=useState(()=>{

const saved=localStorage.getItem("chat_session_id")

if(saved) return saved

const id="session_"+Date.now()

localStorage.setItem("chat_session_id",id)

return id

})

const messagesEndRef=useRef(null)
const firstLoad = useRef(true)

const scrollToBottom=()=>{
messagesEndRef.current?.scrollIntoView({behavior:"smooth"})
}

/* ONLY SCROLL WHEN NEW MESSAGE ARRIVES */

useEffect(()=>{

if(firstLoad.current){
firstLoad.current=false
return
}

scrollToBottom()

},[messages])


/* LOAD CHAT HISTORY */

useEffect(()=>{

const savedChat=localStorage.getItem("chat_history")

if(savedChat){

setMessages(JSON.parse(savedChat))

}else{

setMessages([{
role:"assistant",
content:"👋 Hi! I'm VoiceStock AI, your inventory assistant. How can I help you today?",
type:"conversation"
}])

}

},[])


/* SAVE CHAT */

useEffect(()=>{

if(messages.length){

localStorage.setItem("chat_history",JSON.stringify(messages))

}

},[messages])


/* COMMAND LOG */

const commandLogs = messages
.filter(m => m.type === "command")
.slice(-8)
.reverse()


/* SEND MESSAGE */

const handleSubmit=async(e)=>{

e.preventDefault()

if(!input.trim()) return

const userMessage={role:"user",content:input}

setMessages(prev=>[...prev,userMessage])

setInput("")
setLoading(true)

try{

const response=await chatService.sendMessage(input,sessionId)

const aiMessage={
role:"assistant",
content:response.data.response,
type:response.data.type,
data:response.data.data
}

setMessages(prev=>[...prev,aiMessage])

if(response.data.type==="command"){
window.dispatchEvent(new Event("inventoryUpdated"))
}

}catch(error){

setMessages(prev=>[
...prev,
{
role:"error",
content:error.response?.data?.response || "Error processing command"
}
])

}finally{

setLoading(false)

}

}


/* QUICK COMMANDS */

const quickCommands=[
{icon:Package,label:"Show inventory",text:"What products do I have?"},
{icon:AlertTriangle,label:"Low stock",text:"Show me low stock items"},
{icon:TrendingUp,label:"Inventory value",text:"What's my total inventory value?"},
{icon:Sparkles,label:"Add laptops",text:"Add 50 laptops"},
{icon:Sparkles,label:"Create product",text:"Create a new product"}
]


return(

<div className="grid grid-cols-12 gap-6 h-[calc(100vh-120px)]">

{/* LEFT PANEL */}

<div className="col-span-3 bg-white border rounded-2xl shadow-sm p-5 flex flex-col">

<h3 className="font-semibold mb-4 flex items-center gap-2">
<Bot size={18}/>
Conversations
</h3>

<div className="p-3 bg-indigo-50 rounded-lg flex items-center gap-2 mb-6">
<Bot size={16}/>
Inventory Bot
</div>

<h4 className="text-sm font-semibold text-gray-600 mb-3">
Command Log
</h4>

<div className="space-y-2 overflow-y-auto">

{commandLogs.length===0 &&(
<p className="text-xs text-gray-400">
No commands executed yet
</p>
)}

{commandLogs.map((cmd,i)=>(
<div
key={i}
className="text-xs p-2 border rounded-lg bg-gray-50"
>

<div className="font-medium text-gray-700">
{cmd.content}
</div>

<div className="text-green-600">
✔ Executed
</div>

</div>
))}

</div>

</div>


{/* CENTER CHAT PANEL */}

<div className="col-span-6 bg-white border rounded-2xl shadow-sm flex flex-col h-full">

{/* HEADER */}

<div className="p-4 border-b flex items-center gap-3">

<Bot size={20}/>

<h2 className="font-semibold">
Kognio Inventory Assistant
</h2>

</div>


{/* MESSAGE AREA (SCROLL ONLY HERE) */}

<div className="flex-1 overflow-y-auto p-5 space-y-4 max-h-[520px]">

{messages.map((msg,i)=>(

<div
key={i}
className={`flex ${msg.role==="user"?"justify-end":"justify-start"}`}
>

<div
className={`
max-w-[70%] px-4 py-3 rounded-xl text-sm

${msg.role==="user"
?"bg-gradient-to-r from-indigo-500 to-purple-500 text-white"
: msg.role==="error"
? "bg-red-500 text-white"
: "bg-gray-50 border"}

`}
>

{msg.role==="assistant" && (
<div className="text-xs text-gray-500 mb-1 flex items-center gap-1">
<Bot size={14}/> AI
</div>
)}

{msg.role==="user" && (
<div className="text-xs text-indigo-100 mb-1 flex items-center gap-1">
<User size={14}/> You
</div>
)}

<div className="whitespace-pre-wrap">
{msg.content}
</div>

{msg.data && msg.type==="command" && (

<div className="mt-2 text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
✔ Command executed
</div>

)}

</div>

</div>

))}

{loading && (
<div className="text-sm text-gray-500 flex items-center gap-2">
<Sparkles size={16}/>
AI thinking...
</div>
)}

<div ref={messagesEndRef}/>

</div>


{/* INPUT (ALWAYS FIXED INSIDE PANEL) */}

<form
onSubmit={handleSubmit}
className="border-t p-4 flex gap-3"
>

<input
value={input}
onChange={(e)=>setInput(e.target.value)}
placeholder="Ask about inventory..."
className="flex-1 border rounded-xl px-4 py-3 text-sm outline-none"
/>

<button
type="submit"
disabled={!input.trim()}
className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 rounded-xl flex items-center gap-2"
>

<Send size={16}/>
Send

</button>

</form>

</div>


{/* RIGHT PANEL */}

<div className="col-span-3 bg-white border rounded-2xl shadow-sm p-5">

<h3 className="font-semibold mb-4 flex items-center gap-2">
<Sparkles size={18}/>
Quick Commands
</h3>

<div className="space-y-3">

{quickCommands.map((cmd,i)=>{

const Icon=cmd.icon

return(

<button
key={i}
onClick={()=>setInput(cmd.text)}
className="w-full flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 text-sm"
>

<Icon size={16}/>
{cmd.label}

</button>

)

})}

</div>

</div>

</div>

)

}