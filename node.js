const express = require("express")
//const {HeavyTask} = require("./util");
const { getRandomValues } = require("crypto");
const { resolve } = require("path");
const app =express();
const PORT = process.env.PORT || 8000
app.get("/",(req,res) => {
    return res.json({message : "hello this is a slow route"})
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