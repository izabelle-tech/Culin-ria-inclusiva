import { GoogleGenAI, Type, Modality } from "@google/genai";
import type { Recipe } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const recipeSchema = {
  type: Type.OBJECT,
  properties: {
    name: { type: Type.STRING, description: 'Nome da receita.' },
    description: { type: Type.STRING, description: 'Uma breve e convidativa descrição da receita.' },
    ingredients: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Lista de ingredientes com suas respectivas quantidades.'
    },
    preparation: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: 'Passo a passo detalhado do modo de preparo da receita.'
    },
    yield: { type: Type.STRING, description: 'Rendimento da receita em porções. Exemplo: "4 porções".' },
    dailyValues: {
      type: Type.OBJECT,
      properties: {
        calories: { type: Type.STRING, description: 'Valor diário percentual de calorias. Exemplo: "25% VD"' },
        carbohydrates: { type: Type.STRING, description: 'Valor diário percentual de carboidratos. Exemplo: "15% VD"' },
        proteins: { type: Type.STRING, description: 'Valor diário percentual de proteínas. Exemplo: "30% VD"' },
        fats: { type: Type.STRING, description: 'Valor diário percentual de gorduras totais. Exemplo: "20% VD"' }
      },
      description: 'Valores diários percentuais baseados em uma dieta de 2000 kcal. Use a abreviação VD.'
    }
  },
  required: ['name', 'description', 'ingredients', 'preparation', 'yield', 'dailyValues']
};

const responseSchema = {
  type: Type.ARRAY,
  items: recipeSchema
};

const generateRecipeImage = async (recipeName: string): Promise<string> => {
    try {
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: `Uma fotografia de alta qualidade, profissional e apetitosa de ${recipeName}, bem empratado e com uma iluminação atraente.` }],
          },
          config: {
              responseModalities: [Modality.IMAGE],
          },
        });
        
        for (const part of response.candidates?.[0]?.content?.parts || []) {
            if (part.inlineData) {
              const base64ImageBytes: string = part.inlineData.data;
              return `data:image/png;base64,${base64ImageBytes}`;
            }
        }
        throw new Error('Nenhuma imagem foi gerada.');
    } catch (error) {
        console.error(`Erro ao gerar imagem para "${recipeName}":`, error);
        // Retorna uma imagem de placeholder em caso de falha
        return `https://via.placeholder.com/600x400.png?text=Erro+ao+carregar+imagem`;
    }
}


export const generateRecipes = async (prompt: string, isInclusive: boolean): Promise<Recipe[]> => {
  const inclusivePrompt = `Gere 2 receitas inclusivas, SEM GLÚTEN e SEM LACTOSE, com base na seguinte descrição: "${prompt}".`;
  const allPrompt = `Gere 2 receitas deliciosas, sem restrições alimentares específicas, com base na seguinte descrição: "${prompt}".`;

  const finalPrompt = isInclusive ? inclusivePrompt : allPrompt;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: finalPrompt,
      config: {
        systemInstruction: "Você é um assistente de culinária especialista em criar receitas. Responda sempre em português do Brasil e no formato JSON solicitado.",
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.7,
      },
    });

    const responseText = response.text.trim();
    if (!responseText) {
        throw new Error("A resposta da API está vazia.");
    }

    const textRecipes = JSON.parse(responseText) as Omit<Recipe, 'imageUrl'>[];

    // Gerar imagens para cada receita em paralelo
    const recipesWithImages = await Promise.all(
        textRecipes.map(async (recipe) => {
            const imageUrl = await generateRecipeImage(recipe.name);
            return { ...recipe, imageUrl };
        })
    );
    
    return recipesWithImages;

  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Não foi possível gerar as receitas.");
  }
};
