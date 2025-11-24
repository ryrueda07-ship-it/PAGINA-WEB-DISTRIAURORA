import { GoogleGenAI } from "@google/genai";

// Initialize the Gemini API client safely
// We check if process is defined to avoid ReferenceError in browser environments
const getApiKey = () => {
  try {
    return (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : '';
  } catch (e) {
    return '';
  }
};

const apiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

const SYSTEM_INSTRUCTION = `
Eres el asistente virtual inteligente de "Distribuidora Aurora SAS".
Tu nombre es "AuroraBot".
La empresa se dedica a la distribución mayorista de suministros industriales, plásticos, empaques y materias primas.
El tono de la conversación debe ser profesional, amable y eficiente.
Objetivos:
1. Ayudar a los clientes a encontrar información sobre nuestros servicios (Logística, Distribución, Reciclaje).
2. Responder dudas sobre horarios de atención (Lunes a Viernes 8am - 6pm).
3. Invitar a los usuarios a usar el formulario de contacto para cotizaciones formales.

Si te preguntan algo fuera del contexto de la empresa, responde amablemente que solo puedes asistir con temas relacionados a Distribuidora Aurora.
`;

export const sendMessageToGemini = async (
  history: { role: string; parts: { text: string }[] }[],
  newMessage: string
): Promise<string> => {
  try {
    if (!apiKey) {
      return "Lo siento, el servicio de IA no está configurado correctamente (Falta API Key). Por favor contacta por teléfono.";
    }

    const chat = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
      history: history,
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "Lo siento, no pude procesar tu solicitud en este momento.";
  } catch (error) {
    console.error("Error communicating with Gemini:", error);
    return "Hubo un error de conexión. Por favor intenta más tarde.";
  }
};