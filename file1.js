const express = require("express");
const cluster = require("cluster");
const totalCPU = require("os").cpus().length;
const PORT = process.env.PORT || 8000

if(cluster.isMaster){
    console.log("Total number of cpu is ",totalCPU);
    console.log("Master process id ",process.pid);
    //fork worker
    for(let i=1;i<=totalCPU;i++){
        cluster.fork();
    }

    cluster.on("exit",(worker,code,signal)=>{
        console.log("RIP -> worker node dies and id is ",worker.pid);
        console.log("Space available so making another worker");
        cluster.fork();
    })
}else{
    console.log("Worker node started and id is ",process.pid);
    const app = express();   
    app.get("/",(req,res)=>{
        console.log("request received for workder ",process.pid)
        res.send(`Sending response from worker with id is ${process.pid}`)
    })

    app.listen(PORT,()=>{
        console.log("Worker node is listening on ",PORT)
    })
}