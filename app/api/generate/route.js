import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import path from "path";
import { PineconeStore } from '@langchain/pinecone';
import { Pinecone as PineconeClient } from "@pinecone-database/pinecone";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { OpenAIEmbeddings } from '@langchain/openai';
import { OpenAI } from "openai";
import { loadQAStuffChain } from "langchain/chains"
import { NextResponse } from "next/server";

const primer = `You are a knowledgeable fitness assistant specializing in workout routines, diet plans, and healthy food choices. Your role is to provide users with personalized advice based on their fitness goals, dietary preferences, and lifestyle.

1. You can suggest workout routines for various fitness levels, including strength training, cardio, flexibility exercises, and recovery strategies.

2. You can recommend certain exercises based on different muscles or muscles groups

3. You can explain how to do a certain exercise based on the exercise

4. You offer dietary guidance tailored to different goals, such as muscle gain, fat loss, or general wellness.

5. You can recommend specific foods, meal plans, and recipes that align with the user's nutritional needs, whether they are vegan, vegetarian, or follow a specific diet like keto or paleo.

6. If asked about supplements, provide general information and suggest consulting with a healthcare professional before starting any new supplement regimen.

7. Always encourage balanced and sustainable approaches to fitness and diet, avoiding extreme or potentially harmful recommendations.

8. Ensure that your advice respects the user's preferences, cultural considerations, and any dietary restrictions or allergies.

9. If you're unsure about any information, it's okay to say you don't know and offer to help the user find a reliable source.

10. Your goal is to help users achieve their fitness goals in a healthy and sustainable way, offering practical and actionable advice.

11. Format your response in a way where each thing is on a different line since your messages will be brodcasted on frontend.

12. Make sure after every sentence has a \n after its done.`

export async function POST(req) {
    const filePath = path.join(process.cwd(), "content", "WorkoutPDF.pdf");
    const loader = new PDFLoader(filePath);

    const docs = await loader.load();
    console.log(docs[0]);

    const textSplitter = new RecursiveCharacterTextSplitter({
        chunkSize: 500,
        chunkOverlap: 250,
        separators: ["\n\n\n", "\n\n", "\n", " ", ""],
    });

    const splitDocs = await textSplitter.splitDocuments(docs);
    console.log(splitDocs[30]);

    const texts = splitDocs.map((doc, index) => {
        const content = doc.pageContent || "No content available";
        return `Content: ${content}`;
    });

    console.log(texts);

    const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
        dangerouslyAllowBrowswer: true,
    })

    const pinecone = new PineconeClient({
        apiKey: process.env.PINECONE_API_KEY,
    });

    const embeddings = new OpenAIEmbeddings({
        openAIApiKey: process.env.OPENAI_API_KEY,
        batchSize: 100,
        model: 'text-embedding-3-small'
    })

    const indexName = process.env.PINECONE_INDEX_NAME
    const namespace = process.env.PINECONE_NAMESPACE

    const pineconeIndex = pinecone.Index(indexName)

    const pdfEmbeddings = await embeddings.embedDocuments(texts)

    console.log("length of embeddings: ", pdfEmbeddings.length)

    const pdfVectors = pdfEmbeddings.map((embedding, i) => ({
        id: `doc_${i}`,
        values: embedding,
        metadata: {
            text: texts[i]
        }
    }))

    await pineconeIndex.namespace(namespace).upsert(
        pdfVectors,
    )

    console.log("Embeddings in Pinecone")

    const request = await req.json()

    const data = request[request.length - 1]

    const query = data.content

    console.log(query)

    const queryEmbedding = await new OpenAIEmbeddings().embedQuery(query)

    let queryResponse = await pineconeIndex.namespace(namespace).query({
        vector: queryEmbedding,
        topK: 10,
        includeMetadata: true,
    })

    const concatenatedText = queryResponse.matches
        .map((match) => match.metadata.text)
        .join(" ")

    console.log(`Concatenated Text: ${concatenatedText}`)

    const augmentedQuery = `<CONTEXT>\n${concatenatedText}\n</CONTEXT>\n\nMY QUESTION:\n${query}`;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
            { "role": "system", "content": primer },
            { "role": "user", "content": augmentedQuery }
        ],
        stream: true
    });

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
        async start(controller) {
            for await (const chunk of response) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                    controller.enqueue(encoder.encode(content));
                }
            }
            controller.close();
        },
    });

    return new NextResponse (stream, {
        headers: {
            "Content-Type": "text/event-stream",
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
        },
    })
}