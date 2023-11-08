import { Message } from '@/types/chat';
import { OpenAIModel } from '@/types/openai';
import { OpenAIClient } from "@azure/openai";
import { ClientSecretCredential } from "@azure/identity";

import { AZURE_DEPLOYMENT_ID, OPENAI_API_HOST, AZURE_OPENAI_SUBSCRIPTION_ID, AZURE_TENANT_ID, AZURE_OPENAI_SECRET } from '../app/const';


export class OpenAIError extends Error {
  type: string;
  param: string;
  code: string;

  constructor(message: string, type: string, param: string, code: string) {
    super(message);
    this.name = 'OpenAIError';
    this.type = type;
    this.param = param;
    this.code = code;
  }
}

export const OpenAIStream = async (
  model: OpenAIModel,
  systemPrompt: string,
  temperature : number,
  cred: any,
  messages: Message[],
) => {
  const credential = new ClientSecretCredential(AZURE_TENANT_ID, AZURE_OPENAI_SUBSCRIPTION_ID, AZURE_OPENAI_SECRET);
  const client = new OpenAIClient(OPENAI_API_HOST, credential);
 
  console.log("Using system prompt; ", systemPrompt)
  console.log("Using temperature; ", temperature)
 
  const result = await client.getChatCompletions(
    AZURE_DEPLOYMENT_ID, 
    messages = [
      {
        role: 'system',
        content: systemPrompt,
      },
      ...messages,
    ],
    {
      maxTokens: 128, 
      temperature: temperature
    }
  );
  
  let returnMsgs: string[] = result.choices.map((c: any) => c.message.content)
  // let returnMsgs: string[] = ["hello"]
    
  return returnMsgs
};
