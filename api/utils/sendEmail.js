 import transporterPromise from '../config/nodemailer.js';

 //import { MailtrapClient } from 'mailtrap';

 const verifyEmail = async (email, username, link) => {
     try {
         const transporter = await transporterPromise;
         
         const mailOptions = {
             from: `"GuinaNutri - TFE"  <${process.env.ADRESS_MAILTRAP}>`,
             to: email,
             subject: 'Confirmation compte GuinaNutri',
             html: `
                 <div>
                     <h1> Bienvenue ${username}, </h1>
                     <p> Merci de créer un compte sur GuinaNutri. Veuillez cliquer sur le lien ci-dessous pour vérifier votre adresse e-mail:</p>
                     <a href="${link}">Vérifier mon compte</a>
                     <p> 
                         Dans le cadre du TFE, l'envoi de mail est fait par ethereal.email.
                         Donc si le mail peut paraître bizarre, c'est normal
                     </p>
                 </div>
             `,
         };
         const result = await transporter.sendMail(mailOptions);
         console.log("Email sent successfully:", result);
     } catch (error) {
         console.error("Error sending email:", error);
         throw error;
     }
 };
 
 export default verifyEmail;
 
 