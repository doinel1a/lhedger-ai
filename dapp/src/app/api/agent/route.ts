import { ChatOpenAI } from '@langchain/openai';
import { NextRequest, NextResponse } from 'next/server';

import { aaveBorrowTool, aaveDepositTool } from '@/lib/agents/tools';

export default async function handler(req: NextRequest) {
  const body = await req.json();
  const { prompt } = body as { prompt: string };
  if (!prompt) {
    return NextResponse.json(
      {
        error: 'Prompt is required'
      },
      {
        status: 400
      }
    );
  }

  const model = new ChatOpenAI({ model: 'gpt-4o' });

  const modelWithTools = model.bind({
    tools: [aaveDepositTool, aaveBorrowTool]
  });

  const result = await modelWithTools.invoke(prompt);

  return NextResponse.json(
    {
      content: result.content,
      tool_calls: result.tool_calls
    },
    {
      status: 200
    }
  );
}

export { handler as POST };
