import express from "express";
import { copyS3Folder } from "./aws.js";
import cors from "cors"
const app = express();
app.use(cors())
app.use(express.json())
const PORT = process.env.PORT || 3001;

app.post("/project", async (req, res) => {
    const language = req.body.language;
    const projectId = req.body.projectId
    console.log(req.body);
    
    console.log("Inside projects");
    
    res.send("Inside projects");

    const content = await copyS3Folder(`base-code-${language}`, `users-code/${projectId}`)
    console.log(content);
    
    console.log("project created");

})

app.listen(PORT, () => {
    console.log(`Listening to port ${PORT}`);
})