// functions/index.js
const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

const sgMail = require('@sendgrid/mail');
// Configurez votre clé API SendGrid via Firebase Functions (ex: firebase functions:config:set sendgrid.key="VOTRE_API_KEY")
sgMail.setApiKey(functions.config().sendgrid.key);

exports.sendNewEventEmail = functions.firestore
  .document('events/{eventId}')
  .onCreate(async (snap, context) => {
    const eventData = snap.data();
    
    // Construction du contenu de l'email
    const subject = `Nouveau événement : ${eventData.title}`;
    const text = eventData.description || 'Un nouvel événement a été créé.';
    const html = `
      <h1>${eventData.title}</h1>
      <p><strong>Date :</strong> ${new Date(eventData.date).toLocaleString()}</p>
      <p>${eventData.description || ''}</p>
      ${eventData.lieu ? `<p><strong>Lieu :</strong> ${eventData.lieu}</p>` : ''}
    `;

    // Récupération de tous les utilisateurs inscrits dans la collection "users"
    const usersSnapshot = await admin.firestore().collection('users').get();
    const emails = [];
    usersSnapshot.forEach(doc => {
      const data = doc.data();
      if (data.email) {
        emails.push(data.email);
      }
    });

    if (emails.length === 0) {
      console.log("Aucun utilisateur inscrit pour recevoir des notifications par email.");
      return null;
    }

    const msg = {
      to: emails,
      from: 'votre-email@exemple.com', // Remplacez par votre adresse email vérifiée
      subject: subject,
      text: text,
      html: html,
    };

    try {
      await sgMail.sendMultiple(msg);
      console.log("Emails envoyés avec succès.");
    } catch (error) {
      console.error("Erreur lors de l'envoi d'email :", error);
    }

    return null;
  });
