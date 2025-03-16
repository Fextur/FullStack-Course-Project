import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

class ContentDao {
  async generateContent(contentType: string) : Promise<string>{
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "system", content: contentType }],
        max_tokens: 50,
      });

      return (
        response.choices[0].message?.content?.trim() ||
        "Error generating content"
      );
    } catch (error) {
      console.error("OpenAI API error:", error);
      throw new Error("Failed to generate content");
    }
  }
}

export default new ContentDao();
