import express from 'express';
import { connectDB } from './DB/connection.js';
import AuthRouter from './src/modules/Auth/Auth.Route.js';
import UserRouter from './src/modules/User/User.Router.js';
import services from './src/modules/Services/Services.Router.js';
import Team from './src/modules/Team/Team.Router.js';
import ConsultationRouter from './src/modules/Consultation/Consultation.Router.js';
import ProjectsAndAchievementsRouter from './src/modules/ProjectsAndAchievements/ProjectsAndAchievements.router.js';
import EventsAndNewsRouter from './src/modules/EventsAndNews/EventsAndNews.Router.js';
import Contact from './src/modules/Contact/ContactUs.Router.js';
import Community from './src/modules/Community/Community.Router.js';
import PaymentRouter from './src/modules/Payment/Payment.Router.js'; 


import path from "path"
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
console.log(process.env.MONGO_URI)
connectDB();


app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));
app.use('/auth', AuthRouter);
app.use('/user', UserRouter);
app.use('/services', services);
app.use('/team', Team);
app.use('/ProjectsAndAchievements', ProjectsAndAchievementsRouter);
app.use('/eventsAndNews', EventsAndNewsRouter);
app.use('/contact', Contact);
app.use('/consultation', ConsultationRouter);
app.use('/community',Community)
app.use('/payment', PaymentRouter); 
app.get("/",(req,res)=> {
    res.send("hallo")
})
//global error handler
app.use((err, req, res, next) => { 
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({ message: err.message, stack: err.stack }); 
    })

/* app.use((err, req, res, next) => {
const statusCode = err.statusCode || 500;

console.error("Error:", err);

res
    .status(statusCode)
    .send(`Error: ${err.message}`);
}); */

export const server =app.listen(PORT , console.log(`Server is running on port ${PORT}`));
export default app;
