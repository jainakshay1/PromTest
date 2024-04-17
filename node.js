const express = require("express")
//const {HeavyTask} = require("./util");
const { getRandomValues } = require("crypto");
const responseTime = require("response-time")


const client =require("prom-client")

const collectdefault_matrix=client.collectDefaultMetrics;
const { resolve } = require("path");
const app =express();
const PORT = process.env.PORT || 8000
collectdefault_matrix({register:client.register})
app.get("/",(req,res) => {
    return res.json({message : "hello this is a slow route"})
    
})

//creating counter to know about the total req
const totalreqc = new client.Counter(
    {
        name : "total_req",
        help : "tells total req"
    }
)

app.use(
    responseTime((req,res,time)=>{
        totalreqc.inc()
    })
)

// creating route for metrics
app.get("/metrics",async (req,res)=>{
    res.setHeader('Content-Type',client.register.contentType)
    const metrics = await client.register.metrics();
    res.send(metrics)
})



app.get("/slow", async (req,res)=>{
    try{
        const timetake = await HeavyTask();
        return res.json({
            status: "success",
            message: "this is a slow function ${timetake}ms"
        })
    }
    catch(error){
        return res.status(500).json({status:"error",error: "internal server error"})
    
    }
})

function HeavyTask() {
    const ms = getRandomValues([100,200,300,400,500,600,700])
    const shouldthrowerr = getRandomValues([1,2,3,4,5,5,6,7])==8
    if (shouldthrowerr){
        const randomerr = getRandomValues(["DB server error",
        " Database error",
         "error 405",
         "error payment fail"]) 
         throw new Error(randomerr)
    }
   return new Promise((resolve,reject)=>setTimeout(()=>resolve(ms).ms)) 
    
}
app.listen(PORT, ()=>{
    console.log("express server running on http://localhost:${PORT}")
})