"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod";

export async function generateForm(
    prevState: {
        message: string
    },
    formData: FormData
) {
    const schema = z.object({
        description: z.string().min(1),
    });

    const parse = schema.safeParse({
        description: formData.get("description"),
    });

    if (!parse.success) {
        console.log(parse.error);
        return {
            message: "Failed to parse data",
        };
    }

    if (!process.env.GEMINI_API_KEY) {
        return {
            message: "No GEMINI API KEY found",
        };
    }

    const data = parse.data;
    const promptExplanation =
        "Based on the description, generate a survey object with 3 fields: name(string) for the form, description(string) of the form and a questions array where every element has 2 fields: text and the fieldType and fieldType can be of these options RadioGroup, Select, Input, Textarea, Switch; and return it in json format. For RadioGroup, and Select types also return fieldOptions array with text and value fields. For example, for RadioGroup, and Select types, the field options array can be [{text: 'Yes', value: 'yes'}, {text: 'No', value: 'no'}] and for Input, Textarea, and Switch types, the field options array can be empty. For example, for Input, Textarea, and Switch types, the field options array can be []";

    try {
        const response = await fetch("https://googleapis.com/v1/models", { // Use the correct endpoint
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.GEMINI_API_KEY ?? ""}`,
            },
            method: "POST",
            body: JSON.stringify({
                model: "gemini-1.5-flash", // Use the appropriate model name
                messages: [
                    {
                        role: "system",
                        content: `${data.description} ${promptExplanation}`,
                    },
                ],
            }),
        });
        
        const json = await response.json();

        revalidatePath("/");
        return {
            message: "success",
            data: json,
        };
    } catch (e) {
        console.log(e);
        return {
            message: "Failed to create form",
        };
    }
}
