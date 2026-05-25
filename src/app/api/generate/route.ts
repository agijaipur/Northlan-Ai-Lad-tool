import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || 'dummy_key',
});

export async function POST(req: Request) {
  try {
    const { prompt, actionType } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API Key is not configured.' }, { status: 500 });
    }

    let systemPrompt = '';
    
    if (actionType === 'summary') {
      systemPrompt = `You are a CRM assistant. Your job is to analyze the following lead information and return a structured summary.
Format your output using simple HTML lists and headings (e.g., <h3>, <ul>, <li>, <strong>) without markdown code blocks.
Include:
- Project Summary
- Suggested Services
- Estimated Complexity (Low/Medium/High)
- Rough Timeline Suggestions`;
    } else if (actionType === 'proposal') {
      systemPrompt = `You are an expert sales assistant. Your job is to draft a professional proposal based on the provided lead summary and notes.
Format your output in rich HTML suitable for a WYSIWYG editor (e.g. use <p>, <strong>, <em>, <h1>, <h2>, <ul>, <li>) without markdown code blocks.
Include standard proposal sections:
- Project Overview
- Deliverables
- Estimated Timeline
- Pricing Breakdown (make intelligent estimates based on the budget)
- Terms & Next Steps`;
    } else {
      // Fallback
      systemPrompt = 'You are a helpful AI writing assistant. Format your response in simple HTML suitable for a rich text editor. Do not include ```html blocks.';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0.7,
      max_tokens: 1500,
    });

    const generatedText = response.choices[0]?.message?.content || '';

    // Remove any markdown HTML blocks if the AI accidentally includes them
    const cleanedText = generatedText.replace(/^```html\n?/, '').replace(/```$/, '');

    return NextResponse.json({ text: cleanedText });
  } catch (error: any) {
    console.error('Error generating AI text:', error);
    return NextResponse.json(
      { error: error.message || 'An error occurred during generation' },
      { status: 500 }
    );
  }
}
