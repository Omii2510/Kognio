import { useState } from "react";
import { chatService } from "../../services/chatService";
import { Mic, Square, Loader2, Volume2 } from "lucide-react";

export default function VoiceInput() {

const [isListening,setIsListening]=useState(false)
const [recognition,setRecognition]=useState(null)

const [transcript,setTranscript]=useState("")
const [response,setResponse]=useState(null)

const [processing,setProcessing]=useState(false)
const [awaitConfirm,setAwaitConfirm]=useState(false)

const [error,setError]=useState(null)

const [history,setHistory]=useState([])
const [status,setStatus]=useState("idle")

const [language,setLanguage]=useState("mr-IN")
const [autoSpeak,setAutoSpeak]=useState(true)
const [isSpeaking,setIsSpeaking]=useState(false)


/* TEXT TO SPEECH */

const speak=(text)=>{

if(!("speechSynthesis" in window)) return

window.speechSynthesis.cancel()

const utterance=new SpeechSynthesisUtterance(text)

utterance.lang=language
utterance.rate=0.9

utterance.onstart=()=>setIsSpeaking(true)
utterance.onend=()=>setIsSpeaking(false)

window.speechSynthesis.speak(utterance)

}


/* STOP SPEAKING */

const stopSpeaking=()=>{
window.speechSynthesis.cancel()
setIsSpeaking(false)
}


/* START LISTENING */

const startListening=()=>{

if(!("webkitSpeechRecognition" in window)){
setError("Speech recognition not supported")
return
}

const rec=new webkitSpeechRecognition()

rec.lang=language
rec.continuous=false
rec.interimResults=false

setRecognition(rec)

rec.onstart=()=>{
setIsListening(true)
setStatus("Listening...")
setTranscript("")
}

rec.onresult=(event)=>{

const text=event.results[0][0].transcript

setTranscript(text)
setIsListening(false)

confirmCommand(text)

}

rec.onerror=(event)=>{
setError(event.error)
setIsListening(false)
}

rec.onend=()=>setIsListening(false)

rec.start()

}


/* STOP MIC */

const stopListening=()=>{

if(recognition){
recognition.stop()
}

setIsListening(false)
setStatus("Stopped")

}


/* CONFIRM COMMAND BEFORE EXECUTION */

const confirmCommand=(text)=>{

setAwaitConfirm(true)
setStatus("Awaiting Confirmation")

}


/* EXECUTE COMMAND */

const executeCommand=async()=>{

setProcessing(true)
setStatus("Processing")

try{

const result=await chatService.sendMessage(transcript)

setResponse(result.data)

setHistory(prev=>[
{
command:transcript,
result:result.data.response,
time:new Date().toLocaleTimeString()
},
...prev
])

setStatus("Success")

if(autoSpeak && result.data.response){
speak(result.data.response)
}

}catch(err){

const errorMsg=err.response?.data?.response || "Command Failed"

setError(errorMsg)

setStatus("Failed")

if(autoSpeak) speak(errorMsg)

}

finally{

setProcessing(false)
setAwaitConfirm(false)

}

}


/* SUGGESTIONS */

const suggestions=[
"Add 50 laptops",
"Remove 10 mouse",
"Show inventory",
"What is inventory value",
"Create product GPU price 30000"
]


return(

<div className="space-y-8 max-w-5xl mx-auto">

<h1 className="text-2xl font-semibold text-gray-800">
Voice Assistant
</h1>


{/* MIC ORB */}

<div className="flex flex-col items-center gap-4">

<button
onClick={startListening}
disabled={isListening || processing}
className={`

w-40 h-40 rounded-full flex items-center justify-center

text-white shadow-xl transition

${isListening
? "bg-gradient-to-r from-pink-500 to-red-500 animate-pulse"
: processing
? "bg-gradient-to-r from-blue-500 to-cyan-500"
: "bg-gradient-to-r from-indigo-500 to-purple-500 hover:scale-105"}

`}
>

{processing
? <Loader2 className="animate-spin" size={40}/>
: <Mic size={40}/>
}

</button>

{isListening && (

<button
onClick={stopListening}
className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg"
>

<Square size={16}/>
Stop Mic

</button>

)}

</div>


{/* WAVEFORM */}

{isListening && (

<div className="flex justify-center gap-1">

{Array.from({length:20}).map((_,i)=>(

<div
key={i}
className="w-1 bg-indigo-500 animate-pulse"
style={{
height:Math.random()*40+10
}}
/>

))}

</div>

)}


{/* STATUS */}

<div className="text-center text-sm text-gray-500">

Status: {status}

</div>


{/* TRANSCRIPT */}

{transcript && (

<div className="bg-indigo-500 text-white p-6 rounded-2xl shadow">

<h3>You said</h3>

<p className="text-lg">
{transcript}
</p>

</div>

)}


{/* CONFIRMATION */}

{awaitConfirm && (

<div className="bg-yellow-100 p-6 rounded-xl">

<h3 className="font-semibold mb-3">
Confirm Command
</h3>

<p className="mb-4">
Do you want to execute:
<strong> {transcript}</strong> ?
</p>

<div className="flex gap-4">

<button
onClick={executeCommand}
className="bg-green-500 text-white px-4 py-2 rounded-lg"
>
Confirm
</button>

<button
onClick={()=>setAwaitConfirm(false)}
className="bg-gray-500 text-white px-4 py-2 rounded-lg"
>
Speak Again
</button>

</div>

</div>

)}


{/* AI RESPONSE */}

{response && (

<div className="bg-white border rounded-2xl p-6 shadow">

<div className="flex justify-between items-center mb-3">

<h3 className="font-semibold text-gray-800">
AI Response
</h3>

{isSpeaking && (

<button
onClick={stopSpeaking}
className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg text-sm"
>

<Square size={14}/>
Stop Voice

</button>

)}

</div>

<p className="whitespace-pre-wrap text-gray-700">
{response.response}
</p>

{/* Manual Speak Button */}

{!autoSpeak && !isSpeaking && (

<button
onClick={()=>speak(response.response)}
className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
>

<Volume2 size={16}/>
Speak Response

</button>

)}

</div>

)}


{/* SUGGESTIONS */}

<div className="bg-gray-50 p-6 rounded-2xl border">

<h3 className="font-semibold mb-3">
Try Saying
</h3>

<div className="flex flex-wrap gap-2">

{suggestions.map((s,i)=>(

<button
key={i}
onClick={()=>setTranscript(s)}
className="px-3 py-1 bg-white border rounded-full text-sm"
>

{s}

</button>

))}

</div>

</div>


{/* HISTORY */}

<div className="bg-white p-6 rounded-2xl border shadow">

<h3 className="font-semibold mb-4">
Voice Command History
</h3>

<div className="space-y-3">

{history.length===0 && (

<p className="text-sm text-gray-400">
No commands yet
</p>

)}

{history.map((h,i)=>(

<div
key={i}
className="border p-3 rounded-lg text-sm"
>

<div className="font-medium">
{h.command}
</div>

<div className="text-gray-500">
{h.result}
</div>

<div className="text-xs text-gray-400">
{h.time}
</div>

</div>

))}

</div>

</div>

</div>

)

}