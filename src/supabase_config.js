// Configuration Supabase pour BridgeFacile
const SUPABASE_URL = 'https://wfctinichbyfuwmxkebl.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmY3RpbmljaGJ5ZnV3bXhrZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MTU2NjEsImV4cCI6MjA1MTA5MTY2MX0.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndmY3RpbmljaGJ5ZnV3bXhrZWJsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzU1MTU2NjEsImV4cCI6MjA1MTA5MTY2MX0';

// Initialisation du client Supabase
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Fonction pour envoyer un contact vers la base de données
export async function submitContact(contactData) {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert([
        {
          pseudo: contactData.pseudo,
          email: contactData.email,
          message: contactData.message,
          phone: contactData.phone || null,
          status: 'nouveau'
        }
      ]);

    if (error) {
      console.error('Erreur lors de l\'envoi du contact:', error);
      return { success: false, error: error.message };
    }

    console.log('Contact envoyé avec succès:', data);
    return { success: true, data };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: err.message };
  }
}

// Fonction pour récupérer les leçons
export async function getLessons() {
  try {
    const { data, error } = await supabase
      .from('lessons')
      .select('*')
      .order('order_in_module', { ascending: true });

    if (error) {
      console.error('Erreur lors de la récupération des leçons:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: err.message };
  }
}

// Fonction pour mettre à jour la progression d'un étudiant
export async function updateStudentProgress(studentId, lessonId, status, score = null) {
  try {
    const { data, error } = await supabase
      .from('student_progress')
      .upsert([
        {
          student_id: studentId,
          lesson_id: lessonId,
          status: status,
          score: score,
          completed_at: status === 'termine' ? new Date().toISOString() : null
        }
      ]);

    if (error) {
      console.error('Erreur lors de la mise à jour de la progression:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data };
  } catch (err) {
    console.error('Erreur inattendue:', err);
    return { success: false, error: err.message };
  }
}

